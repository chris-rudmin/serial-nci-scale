# Serial NCI Scale

A Serial NCI Scale written against the Salter Brecknell PS-USB spec.


## Getting Started

Page Hosting the library must be served over HTTPS.
Demo is available at https://chris-rudmin.github.io/serial-nci-scale/

### Installation

```console
npm install serial-nci-scale --save
```

### Instance Methods

- `getWeight()` - asynchronous - Queries and returns the current weight. Required to be called from user action
- `getStatus()` - asynchronous - Queries and returns the current status. Required to be called from user action
- `zero()` - asynchronous - Zeroes the scale. Required to be called from user action
- `startPolling()` - Starts polling the scale for weight data every 250ms. Required to be called from user action
- `stopPolling()` - Stops polling the scale
- `disconnect()` - asynchronous - Stops all activities and closes the read and write streams and frees the serial port

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
