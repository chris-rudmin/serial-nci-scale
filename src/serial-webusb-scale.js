
const filters = [
  { vendorId: 0x1A86, productId: 0x7523 }, // CH340 serial converter
];

// 7e1 byte format
const psUsbConfig = {
  baudrate: 9600,
  databits: 7, 
  stopbits: 1,
  parity: 'even',
};

// USB default commands
const Scp12Commands = {
  CR: parseInt(0x0d, 16), // Carriage Return
  W:  parseInt(0x57, 16), // Get Weight
  S:  parseInt(0x53, 16), // Get Status
  Z:  parseInt(0x5a, 16), // Zero
};

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
    super();
    this.onSettled = onSettled;
    this.devicePromise = this.initDevice();
  }

  async initDevice() {
    this.device = await navigator.usb.requestDevice({ filters });
    await this.device.open();
    if (this.device.configuration === null) {
      await this.device.selectConfiguration(1);
    }
    await this.device.claimInterface(0);

    // Set Data Terminal Ready signal
    const setDTR = await this.device.controlTransferOut({
      'requestType': 'vendor',
      'recipient': 'device',
      'request': 0x22,
      'value': 0x01,
      'index': 0x01
    });

    console.log(setDTR);

    this.readLoop();
  }

  async disconnect () {

    // Turn Off Data Terminal Ready signal
    await this.device.controlTransferOut({
      'requestType': 'vendor',
      'recipient': 'device',
      'request': 0x22,
      'value': 0x00,
      'index': 0x01
    });
    return this.device.close();
  }

  // send typedArray
  send (data) {
    return this.device.transferOut(2, data.buffer);
  }

  readLoop() {
    return this.device.transferIn(2, 64).then(result => {
      console.log('dataIn:');
      console.log(result);
      return this.readLoop();
    });
  }

  getWeight() {
    const { W, CR } = Scp12Commands;
    return this.send(Uint8Array.from([W, CR]));
  }

  getStatus() {
    const { S, CR } = Scp12Commands;
    return this.send(Uint8Array.from([S, CR]));
  }

  zero() {
    const { Z, CR } = Scp12Commands;
    return this.send(Uint8Array.from([Z, CR]));
  }
};
