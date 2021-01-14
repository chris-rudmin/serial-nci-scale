
const commandChars = {
  CR:  parseInt('0d', 16), // Carriage Return
  W:   parseInt('57', 16), // Get Weight
  S:   parseInt('53', 16), // Get Status
  Z:   parseInt('5a', 16), // Zero
  LF:  parseInt('0A', 16), // Line Feed
  ETX: parseInt('03', 16), // End Of Text
  Q:   parseInt('3F', 16), // Question Mark
};

// USB default commands
const commands = {
  weight: new Uint8Array([commandChars.W, commandChars.CR]),
  status: new Uint8Array([commandChars.S, commandChars.CR]),
  zero: new Uint8Array([commandChars.Z, commandChars.CR]),
};

const eventDefaults = {
  type: null,
  weight: null,
  units: null,
  status: {}
};

// 7e1 byte format
const defaultPortConfig = {
  baudRate: 9600,
  dataBits: 7, 
  stopBits: 1,
  parity: 'even',
};


// Implements NCI protocol (Scp-12 or H-100 or 3825/3835). No Handshake.
export default class SerialNCIScale extends EventTarget {
  constructor(config = {}) {
    super();
    this.filters = config.filters || [];
    this.portConfig = Object.assign({}, defaultPortConfig, config.portConfig);
    this.isConnected = false;
    this.isPolling = false;
    this.lastSettled = Object.assign({}, eventDefaults);
    this.decoder = new TextDecoder('windows-1252');
    this.responseBuffer = new Uint8Array();
  }

  static isWebSerialSupported() {
    return navigator && navigator.serial ? true : false;
  }

  async initPort() {
    if (!this.isConnected) {
      return navigator.serial.requestPort({ filters: this.filters }).then(port => {
        this.port = port;
        return this.port.open(this.portConfig);
       }).then(() => {
        this.reader = this.port.readable.getReader();
        this.writer = this.port.writable.getWriter();
        this.isConnected = true;
        this.readLoop();
      });
    }
  }

  async disconnect () {
    if (this.isConnected) {
      this.isConnected = false;
      try {
        await this.reader.cancel().then(() => this.reader.releaseLock());
        await this.writer.abort().then(() => this.writer.releaseLock());
        await this.port.close();
      }
      catch (e) {
        console.error(e);
      }
    }
  }

  send (data) {
    return this.initPort().then(() => {
      return this.writer.write(data).catch(e => {
        this.disconnect();
        throw e;
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
    };
  }

  flushResponseBuffer() {
    const lfIndex = this.responseBuffer.indexOf(commandChars.LF);
    const crIndex = this.responseBuffer.indexOf(commandChars.CR)
    const etxIndex = this.responseBuffer.indexOf(commandChars.ETX);

    // discard anything preceeding <LF> and process again
    if (lfIndex > 0) {
      this.responseBuffer = this.responseBuffer.slice(lfIndex);
      return this.flushResponseBuffer();
    }

    if (lfIndex === 0 && crIndex > 0) {

      // Unknown Command Response <LF>?<CR>
      if (crIndex === 2 && this.responseBuffer[1] === commandChars.Q) {
        console.warn('Unrecognized command received');
        this.responseBuffer = this.responseBuffer.slice(crIndex + 1);
        return this.flushResponseBuffer();
      }

      // Data to publish
      if (etxIndex !== -1) {
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

  async readLoop() {
    while (true) {
      try {
        const { value, done } = await this.reader.read();
        if (done) { break; } // this.reader.cancel()
        this.responseBuffer = Uint8Array.from([...this.responseBuffer, ...value]);
        this.flushResponseBuffer();
      }
      catch (e) {
        this.disconnect();
        break;
      }
    }
  }

  startPolling() {
    if (!this.isPolling) {
      this.initPort().then(() => {
        this.isPolling = true;
        const poll = setInterval(() => {
          if (this.isConnected && this.isPolling) { 
            this.send(commands.weight);
          }
          else {
            clearInterval(poll);
            this.isPolling = false;
          }
        }, 500);
      });
    }
  }

  stopPolling() {
    this.isPolling = false;
  }

  sendAndGetResponse(type) {
    return new Promise((resolve, reject) => {
      const onResponse = (e) => {
        this.removeEventListener(type, onResponse);
        resolve(e.detail);
      };
      this.addEventListener(type, onResponse);
      this.send(commands[type]).catch(e => {
        this.removeEventListener(type, onResponse);
        reject(e);
      });
    });
  }

  getWeight() {
    return this.sendAndGetResponse('weight');
  }

  getStatus() {
    return this.sendAndGetResponse('status');
  }

  zero() {
    return this.send(commands.zero);
  }
};


SerialNCIScale.supportedScaleFilters = [
  { usbVendorId: 0x1A86, usbProductId: 0x7523 }, // CH340 serial converter
]
