# Serial NCI Scale

An API to query a Serial Scale which supports the NCI protocal (SCP-12, NCI 3825, NCI 3835). Tested against the Salter Brecknell PS-USB scale. Depends on the Web Serial API.


## Getting Started

Page Hosting the library must be served over HTTPS.
Demo is available at https://chris-rudmin.github.io/serial-nci-scale/

### Installation

```console
npm install serial-nci-scale --save
```

### Usage

```js
import SerialNCIScale from 'serial-nci-scale';

const scale = new SerialNCIScale();
const { weight, units, status } = await scale.getWeight();
```

### Constructor
- `const scale = new SerialNCIScale( [config] )` - Create a new instance with optional device filter array or port config object

#### Config Object
- `config.filters` - Optional - Array of [filters](https://wicg.github.io/serial/#serialportfilter-dictionary) to use when initializing the port. Defaults to [].
- `config.portConfig` - Optional - Object containing [serial configuration](https://wicg.github.io/serial/#serialoptions-dictionary) to use for initializing port. Defaults to 7E1 byte format.

#### Instance Methods

- `scale.getWeight()` - Returns a promise which resolves with scale weight data. Required to be called from user action
- `scale.getStatus()` - Returns a promise which resolves with scale status data. Required to be called from user action
- `scale.zero()` - Returns a promise which resolves when the scale is zeroed. Required to be called from user action
- `scale.startPolling([pollInterval])` - Starts polling the scale for weight data. Default polling interval is 500 ms Required to be called from user action
- `scale.stopPolling()` - Stops polling the scale
- `scale.disconnect()` - Returns a promise which resolves once disconnected. Closes the read and write streams and frees the serial port

#### Static Attributes

- `SerialNCIScale.isWebSerialSupported` - `true` if Web Serial API exists in your browser
- `SerialNCIScale.supportedScaleFilters` - Array of devices which are known to be supported

#### Events

The serial-nci-scale instance is an EventTarget and can be listened to for custom events. Scale data is contained the in the `detail` property.

- `weight` - Dispatched for every weight read
- `status` - Dispatched for every status read
- `settled` - Dispatched when the scale is no longer in motion and if the weight is different than the last settled weight

```js
scale.addEventListener('settled', ({ detail }) => foo(detail.status));
scale.startPolling();
```

### Supported Browsers

Currently only Chrome 89+ and Edge 89+ support the Web Serial API.
Earlier versions of Chrome and Edge can use the API if it is enabled in chrome://flags
