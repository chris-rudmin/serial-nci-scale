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

const commands = {
  getReading: 0x570d,
  getStatus: 0x530d,
  zero: 0x5a0d,
  tare: 0x540d,
  changeUnit: 0x550d,
  toggleHold: 0x4c0d,
  powerOff: 0x580d,
};


export default class SerialWebUSBScale {
  constructor({ onSettled = () => {}, portConfig }) {
    this.onSettled = onSettled;
    this.portPromise = serial.requestPort({ filters }).then(async port => {
      this.port = port;
      this.reader = port.readable.getReader();
      this.writer = port.writable.getWriter();

      const config = Object.assign({}, psUsbConfig, portConfig);
      await port.open(config);
      return port;
    });
  }

  // Get the weight
  async getWeight() {
    await this.writer.write()
  }
};
