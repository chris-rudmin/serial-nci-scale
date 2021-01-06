import { serial } from 'web-serial-polyfill';

const filters = [
  { usbVendorId: 0x2341, usbProductId: 0x0043 },
];

// 7e1 byte format
const psUsbConfig = {
  baudRate: 9600,
  databit: 7, 
  stopbits: 1,
  parity: 'even',
};

// USB default commands
const Scp12Commands = {
  getWeight:  0x570d, // W
  getStatus:  0x530d, // S
  zero:       0x5a0d, // Z
}

// EH-SCP commands
const EhScpCommands = {
  getWeight:      0x570d, // W
  zero:           0x5a0d, // Z
  standardWeight: 0x4c0d, // L
  metricWeight:   0x4b0d, // K
};

// DB9 single mode commands
const SingleCommands = {
  getWeight:  0x570d, // W
  getStatus:  0x530d, // S
  zero:       0x5a0d, // Z
  tare:       0x540d, // T
  changeUnit: 0x550d, // U
  toggleHold: 0x4c0d, // L
  powerOff:   0x580d, // X
};


export default class SerialWebUSBScale extends EventTarget {
  constructor({ onSettled = () => {}, portConfig }) {
    this.onSettled = onSettled;
    this.portConfig = Object.assign({}, psUsbConfig, portConfig);
    this.portPromise = this.initPort();

    // Recursive Async loop to read
    // this.portPromise.then(async () => {
    //   const { done, value } = await this.reader.read();

    //   if (done) {
    //     // Allow the serial port to be closed later.
    //     reader.releaseLock();
    //     break;
    //   }

    //   if (value) {
    //     console.log(value);
    //   }
    // })
  }

  initPort() {
    return serial.requestPort({ filters }).then(async port => {
      this.port = port;
      this.reader = port.readable.getReader();
      this.writer = port.writable.getWriter();
      await port.open(this.portConfig);
      return port;
    });
  }

  async getWeight() {
    await this.portPromise;
    await this.writer.write();
  }

  async getStatus() {
    await this.portPromise;
    await this.writer.write();
  }

  async zero() {
    await this.portPromise;
    this.writer.write();
  }
};
