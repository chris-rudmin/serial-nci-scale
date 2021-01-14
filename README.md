# Serial NCI Scale

An API to query a Serial Scale which supports the NCI protocal (SCP-12, NCI 3825, NCI 3835). Tested against the Salter Brecknell PS-USB scale. Depends on the Web Serial API.


## Getting Started

Page Hosting the library must be served over HTTPS.
Demo is available at https://chris-rudmin.github.io/serial-nci-scale/

### Installation

```console
npm install serial-nci-scale --save
```

### Constructor
- `const scale = new SerialNCIScale({ portConfig, filters })` - Create a new instance with device filters array or portConfig object

### Instance Methods

- `scale.getWeight()` - Returns a promise which resolves with scale weight data. Required to be called from user action
- `scale.getStatus()` - Returns a promise which resolves with scale status data. Required to be called from user action
- `scale.zero()` - Returns a promise which resolves when the scale is zeroed. Required to be called from user action
- `scale.startPolling()` - Starts polling the scale for weight data every 250ms. Required to be called from user action
- `scale.stopPolling()` - Stops polling the scale
- `scale.disconnect()` - Returns a promise which resolves once disconnected. Closes the read and write streams and frees the serial port

### Example

```js
import SerialNCIScale from 'serial-nci-scale';

const scale = new SerialNCIScale();
const { weight, units, status } = await scale.getWeight();
```

### Events

The serial-nci-scale instance is an EventTarget and can be listened to for custom events. Scale data is contained the in the `detail` property.

- `weight` - Dispatched for every weight read
- `status` - Dispatched for every status read
- `settled` - Dispatched when the scale is no longer in motion and if the weight is different than the last settled weight


### Supported Browsers

Currently only Chrome 89+ supports the Web Serial API.
Earlier versions of Chrome can use the API if it is enabled in chrome://flags
