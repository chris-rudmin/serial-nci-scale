import { serial } from 'web-serial-polyfill';

const filters = [
  { usbVendorId: 0x2341, usbProductId: 0x0043 },
];

export default class SerialWebUSBScale {
  constructor() {
    serial.requestPort({ filters }).then(port => this.port = port);
  }

};
