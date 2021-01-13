(this["webpackJsonpserial-nci-scale"]=this["webpackJsonpserial-nci-scale"]||[]).push([[0],{52:function(e,t,n){},58:function(e,t,n){"use strict";n.r(t);var r=n(4),i=n(0),s=n.n(i),a=n(11),o=n.n(a),c=(n(52),n(26)),u=n(30),l=n(31),d=n(21),h=n.n(d),f=n(29),p=n(32),b=n(33),v=n(34),g=n(39),j=n(40),y=[{usbVendorId:6790,usbProductId:29987}],m={baudRate:9600,dataBits:7,stopBits:1,parity:"even"},O={CR:parseInt("0d",16),W:parseInt("57",16),S:parseInt("53",16),Z:parseInt("5a",16)},w={CR:parseInt("0d",16),LF:parseInt("0A",16),ETX:parseInt("03",16),Q:parseInt("3F",16)},x={type:null,weight:null,units:null,status:{}},B=function(e){Object(v.a)(n,e);var t=Object(g.a)(n);function n(){var e;return Object(p.a)(this,n),(e=t.call(this)).isConnected=!1,e.isDisconnecting=!1,e.isPolling=!1,e.lastSettled=Object.assign({},x),e.decoder=new TextDecoder("windows-1252"),e.responseBuffer=new Uint8Array,e}return Object(b.a)(n,[{key:"initPort",value:function(){var e=Object(f.a)(h.a.mark((function e(){var t=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.isConnected){e.next=2;break}return e.abrupt("return",navigator.serial.requestPort({filters:y}).then((function(e){return t.port=e,t.port.open(m)})).then((function(){t.reader=t.port.readable.getReader(),t.writer=t.port.writable.getWriter(),t.isConnected=!0,t.readLoop()})).catch((function(e){console.error(e),t.disconnect()})));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"disconnect",value:function(){var e=Object(f.a)(h.a.mark((function e(){var t=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.isConnected){e.next=3;break}return this.isDisconnecting=!0,e.abrupt("return",this.getWeight().then((function(){return t.reader.releaseLock(),t.writer.releaseLock(),t.port.close()})).finally((function(){t.isDisconnecting=!1,t.isConnected=!1})));case 3:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"readWriteError",value:function(e){return console.error(e),this.isConnected=!1,this.isDisconnecting=!1,this.port.close().catch((function(e){return console.error(e)}))}},{key:"send",value:function(e){var t=this;return this.initPort().then((function(){return t.writer.write(e).catch((function(e){return t.readWriteError(e)}))}))}},{key:"bitArray",value:function(e){if(e<0||e>63||e%1!==0)throw new Error("".concat(e," does not fit into 6 bits"));return("000000"+e.toString(2)).substr(-6).split("").reverse()}},{key:"parseStatus",value:function(e){var t=this.bitArray(e[0]),n=this.bitArray(e[1]);return{stable:"0"===t[0],atZero:"1"===t[1],ramError:"1"===t[2],eepRomError:"1"===t[3],underCapacity:"1"===n[0],overCapacity:"1"===n[1],romError:"1"===n[2],calibrationError:"1"===n[3]}}},{key:"flushResponseBuffer",value:function(){var e=this.responseBuffer.indexOf(w.LF),t=this.responseBuffer.indexOf(w.CR),n=this.responseBuffer.indexOf(w.ETX);if(e>0)return this.responseBuffer=this.responseBuffer.slice(e),this.flushResponseBuffer();if(0===e&&t>0){if(2===t&&this.responseBuffer[1]===w.Q)return console.warn("Unrecognized command received"),this.responseBuffer=this.responseBuffer.slice(t+1),this.flushResponseBuffer();if(-1!==n){var r={};return 4===n?(r.type="status",r.status=this.parseStatus(this.responseBuffer.subarray(1,3))):n-t===3?(r.type="weight",r.status=this.parseStatus(this.responseBuffer.subarray(t+1,n)),r.units=this.decoder.decode(this.responseBuffer.subarray(t-2,t)).trim(),r.weight=parseFloat(this.decoder.decode(this.responseBuffer.subarray(e+1,t-2)).trim(),10)):console.warn("Unrecognized format",this.responseBuffer),r.type&&(this.dispatchEvent(new CustomEvent(r.type,{detail:Object(l.a)({},r)})),"weight"===r.type&&this.lastSettled.weight!==r.weight&&r.status.stable&&(this.lastSettled=r,this.dispatchEvent(new CustomEvent("settled",{detail:Object(l.a)({},r)})))),this.responseBuffer=this.responseBuffer.slice(n+1),this.flushResponseBuffer()}}}},{key:"readLoop",value:function(){var e=this;return this.reader.read().then((function(t){var n=t.value;t.done;e.isConnected&&!e.isDisconnecting&&e.readLoop(),e.responseBuffer=Uint8Array.from([].concat(Object(u.a)(e.responseBuffer),Object(u.a)(n))),e.flushResponseBuffer()})).catch((function(t){return e.readWriteError(t)}))}},{key:"startPolling",value:function(){var e=this;this.isPolling||this.initPort().then((function(){e.isPolling=!0;var t=setInterval((function(){e.isConnected&&e.isPolling&&!e.isDisconnecting?e.getWeight():(clearInterval(t),e.isPolling=!1)}),250)}))}},{key:"stopPolling",value:function(){this.isPolling=!1}},{key:"getWeight",value:function(){var e=this;return new Promise((function(t){var n=O.W,r=O.CR;e.addEventListener("weight",(function n(r){e.removeEventListener("weight",n),t(r.detail)})),e.send(new Uint8Array([n,r]))}))}},{key:"getStatus",value:function(){var e=this;return new Promise((function(t){var n=O.S,r=O.CR;e.addEventListener("status",(function n(r){var i=r.detail;e.removeEventListener("status",n),t(i)})),e.send(new Uint8Array([n,r]))}))}},{key:"zero",value:function(){var e=O.Z,t=O.CR;return this.send(new Uint8Array([e,t]))}}]),n}(Object(j.a)(EventTarget)),k=n(91),C=n(81),E=n(83),S=n(84),P=n(85),L=n(27),I=n(87),R=n(88),W=n(89),T=n(86),A=new B,D=Object(C.a)((function(e){return{button:{marginTop:e.spacing(2),marginRight:e.spacing(2),marginBottom:e.spacing(4)},spaceTop:{marginTop:e.spacing(4)}}}));function N(){var e=D(),t=Object(i.useState)({}),n=Object(c.a)(t,2),s=n[0],a=n[1],o=Object(i.useState)(),u=Object(c.a)(o,2),l=u[0],d=u[1],h=Object(i.useState)(),f=Object(c.a)(h,2),p=f[0],b=f[1],v=function(e){var t=e.detail,n=e.timeStamp,r=e.type;a(t),d(new Date(n).toString()),b(r)};return Object(i.useEffect)((function(){return A.addEventListener("weight",v),A.addEventListener("status",v),A.addEventListener("settled",v),function(){A.removeEventListener("weight",v),A.removeEventListener("status",v),A.removeEventListener("settled",v)}})),Object(r.jsxs)("div",{children:[Object(r.jsx)(E.a,{position:"static",children:Object(r.jsx)(S.a,{children:Object(r.jsx)(L.a,{variant:"h5",children:"Serial NCI Scale Demo"})})}),Object(r.jsxs)(P.a,{className:e.spaceTop,maxWidth:"md",children:[Object(r.jsx)(L.a,{variant:"h5",children:"About this demo."}),Object(r.jsx)(L.a,{variant:"body1",display:"block",gutterBottom:!0,children:"To use the demo, be sure to enable the Web Serial API in chrome flags and plug in your scale. USB scales will need the appropriate VCP driver on Windows to virtualize a serial port."}),Object(r.jsx)(T.a,{}),Object(r.jsx)(L.a,{variant:"h5",gutterBottom:!0,className:e.spaceTop,children:"Controls"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.getWeight().then((function(e){return console.log(e)}))},children:"Get Weight"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.getStatus().then((function(e){return console.log(e)}))},children:"Get Status"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.zero()},children:"Zero"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.startPolling()},children:"Start Polling"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.stopPolling()},children:"Stop Polling"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.disconnect()},children:"Disconnect"}),Object(r.jsxs)(I.a,{className:e.spaceTop,children:[Object(r.jsx)(R.a,{title:"Event Log",subheader:l}),Object(r.jsxs)(W.a,{children:[Object(r.jsxs)(L.a,{variant:"body1",display:"block",children:["type: ",p]}),Object(r.jsx)(L.a,{variant:"body1",display:"block",component:"div",children:Object(r.jsx)("div",{children:Object(r.jsx)("pre",{children:JSON.stringify(s,null,2)})})})]})]})]})]})}var F=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,93)).then((function(t){var n=t.getCLS,r=t.getFID,i=t.getFCP,s=t.getLCP,a=t.getTTFB;n(e),r(e),i(e),s(e),a(e)}))},U=n(90);o.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(U.a,{children:Object(r.jsx)(N,{})})}),document.getElementById("root")),F()}},[[58,1,2]]]);
//# sourceMappingURL=main.e0489f09.chunk.js.map