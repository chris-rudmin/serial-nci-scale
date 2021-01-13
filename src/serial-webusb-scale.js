
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

const eventDefaults = {
  type: null,
  weight: null,
  units: null,
  status: {}
};


// Implements NCI (or H-100), (or 3825) protocol
// No Handshake.
export default class SerialWebUSBScale extends EventTarget {
  constructor() {
    super();
    this.isConnected = false;
    this.isPolling = false;
    this.lastSettled = Object.assign({}, eventDefaults);
    this.decoder = new TextDecoder('windows-1252');
  }

  async initPort() {
    if (!this.isConnected) {
      this.port = await navigator.serial.requestPort({ filters });
      await this.port.open(psUsbConfig);
      this.reader = this.port.readable.getReader();
      this.writer = this.port.writable.getWriter();
      this.isConnected = true;
      this.readLoop();
    }

    return this.port;
  }

  async disconnect () {
    if (this.isConnected) {
      this.isConnected = false;
      await this.getWeight(); // Await one last poll to complete before disconnecting
      this.reader.releaseLock();
      this.writer.releaseLock();
      return this.port.close();
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
    // 6 bits because parity bit has been validated and stripped
    if (n < 0 || n > 63 || n % 1 !== 0) {
        throw new Error(`${n} does not fit into 6 bits`);
    }
    return ("000000" + n.toString(2)).substr(-6).split('').reverse();
  }

  // Status is two 7 bit values stored in two bytes
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

  parseResponses(data) {
    const output = {};

    switch (data.length) {
      case 16: // <LF>p00xxx.xxUU<CR>hh<ETX>
        output.type = 'weight';
        output.weight = parseFloat(this.decoder.decode(data.subarray(1, 10)).trim(), 10);
        output.units = this.decoder.decode(data.subarray(10, 12)).trim();
        output.status = this.parseStatus(data.subarray(13, 15));
        break;

      case 15: // <LF>p00xxxxxUU<CR>hh<ETX>
        output.type = 'weight';
        output.weight = parseFloat(this.decoder.decode(data.subarray(1, 9)).trim(), 10);
        output.units = this.decoder.decode(data.subarray(9, 11)).trim();
        output.status = this.parseStatus(data.subarray(12, 14));
        break;

      case 14: // <LF>pxxx.xxUU<CR>hh<ETX>
        output.type = 'weight';
        output.weight = parseFloat(this.decoder.decode(data.subarray(1, 8)).trim(), 10);
        output.units = this.decoder.decode(data.subarray(8, 10)).trim();
        output.status = this.parseStatus(data.subarray(11, 13));
        break;

      case 13: // <LF>pxxxxxUU<CR>hh<ETX>
        output.type = 'weight';
        output.weight = parseFloat(this.decoder.decode(data.subarray(1, 7)).trim(), 10);
        output.units = this.decoder.decode(data.subarray(7, 9)).trim();
        output.status = this.parseStatus(data.subarray(10, 12));
        break;

      case 5: // <LF>hh<CR><ETX>
        output.type = 'status';
        output.status = this.parseStatus(data.subarray(1, 3));
        break;

      case 3: // <LF>?<CR>
        console.warn('Unrecognized command received');
        break;

      default:
        console.log('Unrecognized response payload', data);
    }

    return output;
  }

  readLoop() {
    return this.reader.read().then(({ value, done }) => {

      // Keep read loop open while connected
      if (this.isConnected) {
        this.readLoop();
      }

      const data = this.parseResponses(value);

      // Publish event
      if (data.type){
        this.dispatchEvent(new CustomEvent(data.type, {detail: {...data}}))
      }

      if (data.type === 'weight' && this.lastSettled.weight !== data.weight && data.status.stable) {
        this.lastSettled = data;
        this.dispatchEvent(new CustomEvent('settled', {detail: {...data}}));
      }
    }).catch((e) => {
      console.error(e);
      return this.disconnect();
    });
  }

  startPolling() {
    if (this.isConnected && !this.isPolling) {
      this.isPolling = true;
      const poll = setInterval(() => this.isConnected && this.isPolling ? this.getWeight() : clearInterval(poll), 250);
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
