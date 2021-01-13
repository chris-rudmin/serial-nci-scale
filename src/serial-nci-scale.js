
const filters = [
  { usbVendorId: 0x1A86, usbProductId: 0x7523 }, // CH340 serial converter
];

// 7e1 byte format
const psUsbConfig = {
  baudRate: 9600,
  dataBits: 7, 
  stopBits: 1,
  parity: 'even',
};

// USB default commands
const Scp12Commands = {
  CR: parseInt('0d', 16), // Carriage Return
  W:  parseInt('57', 16), // Get Weight
  S:  parseInt('53', 16), // Get Status
  Z:  parseInt('5a', 16), // Zero
};

const ResponseChars = {
  CR:  parseInt('0d', 16), // Carriage Return
  LF:  parseInt('0A', 16), // Line Feed
  ETX: parseInt('03', 16), // End Of Text
  Q:   parseInt('3F', 16), // Question Mark
};

const eventDefaults = {
  type: null,
  weight: null,
  units: null,
  status: {}
};


// Implements NCI (or H-100), (or 3825) protocol
// No Handshake.
export default class SerialNCIScale extends EventTarget {
  constructor() {
    super();
    this.isConnected = false;
    this.isDisconnecting = false;
    this.isPolling = false;
    this.lastSettled = Object.assign({}, eventDefaults);
    this.decoder = new TextDecoder('windows-1252');
    this.responseBuffer = new Uint8Array();
  }

  async initPort() {
    if (!this.isConnected) {
      return navigator.serial.requestPort({ filters }).then(port => {
        this.port = port;
        return this.port.open(psUsbConfig);
       }).then(() => {
        this.reader = this.port.readable.getReader();
        this.writer = this.port.writable.getWriter();
        this.isConnected = true;
        this.readLoop();
      }).catch(e => {
        console.log(e);
        this.disconnect();
      });
    }
  }

  async disconnect () {
    if (this.isConnected) {
      this.isDisconnecting = true;
      await this.getWeight(); // Await one last poll to complete before disconnecting
      this.reader.releaseLock();
      this.writer.releaseLock();
      await this.port.close();
      this.isDisconnecting = false;
      this.isConnected = false;
    }
  }

  send (data) {
    return this.initPort().then(() => {
      return this.writer.write(data).catch((e) => {
        console.error(e);
        this.disconnect();
      });
    });
  }

  bitArray(n) {
    // 6 bits because parity bit has been validated and stripped from 7 bit data
    if (n < 0 || n > 63 || n % 1 !== 0) {
        throw new Error(`${n} does not fit into 6 bits`);
    }
    return ("000000" + n.toString(2)).substr(-6).split('').reverse();
  }

  // Status is two bytes
  parseStatus(data) {
    const firstByte = this.bitArray(data[0]);
    const secondByte = this.bitArray(data[1]);

    return {
      stable: firstByte[0] === '0' ? true : false,
      atZero: firstByte[1] === '1' ? true : false,
      ramError: firstByte[2] === '1' ? true : false,
      eepRomError: firstByte[3] === '1' ? true : false,
      underCapacity: secondByte[0] === '1' ? true : false,
      overCapacity: secondByte[1] === '1' ? true : false,
      romError: secondByte[2] === '1' ? true : false,
      calibrationError: secondByte[3] === '1' ? true : false,
    }
  }

  flushResponseBuffer() {
    const lfIndex = this.responseBuffer.indexOf(ResponseChars.LF);
    const crIndex = this.responseBuffer.indexOf(ResponseChars.CR)
    const etxIndex = this.responseBuffer.indexOf(ResponseChars.ETX);

    // discard anything preceeding <LF> and process again
    if (lfIndex > 0) {
      this.responseBuffer = this.responseBuffer.slice(lfIndex);
      return this.flushResponseBuffer();
    }
    
    if (lfIndex === 0 && crIndex > 0) {

      // Unknown Command Response <LF>?<CR>
      if (crIndex === 2 && this.responseBuffer[1] === ResponseChars.Q) {
        console.warn('Unrecognized command received');
        this.responseBuffer = this.responseBuffer.slice(crIndex + 1);
        return this.flushResponseBuffer();
      }

      // Data to publish
      else if (etxIndex !== -1) {
        const output = {};

        // Status format <LF>hh<CR><ETX>
        if (etxIndex === 4) {
          output.type = 'status';
          output.status = this.parseStatus(this.responseBuffer.subarray(1, 3));
        }

        // Weight format <LF>pxxxxxxUU<CR>hh<ETX>
        else if (etxIndex - crIndex === 3) {
          output.type = 'weight';
          output.status = this.parseStatus(this.responseBuffer.subarray(crIndex + 1, etxIndex));
          output.units = this.decoder.decode(this.responseBuffer.subarray(crIndex - 2, crIndex)).trim();
          output.weight = parseFloat(this.decoder.decode(this.responseBuffer.subarray(lfIndex + 1, crIndex - 2)).trim(), 10);
        }

        else {
          console.warn('Unrecognized format', this.responseBuffer);
        }

        // Publish any events
        if (output.type) {
          this.dispatchEvent(new CustomEvent(output.type, {detail: {...output}}))

          if (output.type === 'weight' && this.lastSettled.weight !== output.weight && output.status.stable) {
            this.lastSettled = output;
            this.dispatchEvent(new CustomEvent('settled', {detail: {...output}}));
          }
        }

        // Flush the data and run again
        this.responseBuffer = this.responseBuffer.slice(etxIndex + 1);
        return this.flushResponseBuffer();
      }
    }
  }

  readLoop() {
    return this.reader.read().then(({ value, done }) => {

      // Keep read loop open while connected
      if (this.isConnected && !this.isDisconnecting) {
        this.readLoop();
      }

      this.responseBuffer = Uint8Array.from([...this.responseBuffer, ...value]);
      this.flushResponseBuffer();
    }).catch((e) => {
      console.error(e);
      return this.disconnect();
    });
  }

  startPolling() {
    if (!this.isPolling) {
      this.initPort().then(() => {
        this.isPolling = true;
        const poll = setInterval(() => {
          if (this.isConnected && this.isPolling && !this.isDisconnecting){ 
            this.getWeight();
          }
          else {
            clearInterval(poll);
            this.isPolling = false;
          }
        }, 250);
      });
    }
  }

  stopPolling() {
    this.isPolling = false;
  }

  getWeight() {
    return new Promise(resolve => {
      const { W, CR } = Scp12Commands;
      const onWeight = (e) => {
        this.removeEventListener('weight', onWeight);
        resolve(e.detail);
      };
      this.addEventListener('weight', onWeight);
      this.send(new Uint8Array([W, CR]));
    });
  }

  getStatus() {
    return new Promise(resolve => {
      const { S, CR } = Scp12Commands;
      const onStatus = ({detail}) => {
        this.removeEventListener('status', onStatus);
        resolve(detail);
      };
      this.addEventListener('status', onStatus);
      this.send(new Uint8Array([S, CR]));
    });
  }

  zero() {
    const { Z, CR } = Scp12Commands;
    return this.send(new Uint8Array([Z, CR]));
  }
};
