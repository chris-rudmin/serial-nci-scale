(this["webpackJsonpserial-nci-scale"]=this["webpackJsonpserial-nci-scale"]||[]).push([[0],{52:function(e,t,n){},58:function(e,t,n){"use strict";n.r(t);var r=n(4),i=n(0),s=n.n(i),a=n(11),o=n.n(a),c=(n(52),n(26)),u=n(30),l=n(31),f=n(21),h=n.n(f),d=n(29),p=n(32),v=n(33),b=n(34),g=n(39),j=n(40),y=[{usbVendorId:6790,usbProductId:29987}],O={baudRate:9600,dataBits:7,stopBits:1,parity:"even"},m={CR:parseInt("0d",16),W:parseInt("57",16),S:parseInt("53",16),Z:parseInt("5a",16)},w={CR:parseInt("0d",16),LF:parseInt("0A",16),ETX:parseInt("03",16),Q:parseInt("3F",16)},x={type:null,weight:null,units:null,status:{}},B=function(e){Object(b.a)(n,e);var t=Object(g.a)(n);function n(){var e;return Object(p.a)(this,n),(e=t.call(this)).isConnected=!1,e.isDisconnecting=!1,e.isPolling=!1,e.lastSettled=Object.assign({},x),e.decoder=new TextDecoder("windows-1252"),e.responseBuffer=new Uint8Array,e}return Object(v.a)(n,[{key:"initPort",value:function(){var e=Object(d.a)(h.a.mark((function e(){var t=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.isConnected){e.next=2;break}return e.abrupt("return",navigator.serial.requestPort({filters:y}).then((function(e){return t.port=e,t.port.open(O)})).then((function(){t.reader=t.port.readable.getReader(),t.writer=t.port.writable.getWriter(),t.isConnected=!0,t.readLoop()})).catch((function(e){console.log(e),t.disconnect()})));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"disconnect",value:function(){var e=Object(d.a)(h.a.mark((function e(){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.isConnected){e.next=10;break}return this.isDisconnecting=!0,e.next=4,this.getWeight();case 4:return this.reader.releaseLock(),this.writer.releaseLock(),e.next=8,this.port.close();case 8:this.isDisconnecting=!1,this.isConnected=!1;case 10:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"send",value:function(e){var t=this;return this.initPort().then((function(){return t.writer.write(e).catch((function(e){console.error(e),t.disconnect()}))}))}},{key:"bitArray",value:function(e){if(e<0||e>63||e%1!==0)throw new Error("".concat(e," does not fit into 6 bits"));return("000000"+e.toString(2)).substr(-6).split("").reverse()}},{key:"parseStatus",value:function(e){var t=this.bitArray(e[0]),n=this.bitArray(e[1]);return{stable:"0"===t[0],atZero:"1"===t[1],ramError:"1"===t[2],eepRomError:"1"===t[3],underCapacity:"1"===n[0],overCapacity:"1"===n[1],romError:"1"===n[2],calibrationError:"1"===n[3]}}},{key:"flushResponseBuffer",value:function(){var e=this.responseBuffer.indexOf(w.LF),t=this.responseBuffer.indexOf(w.CR),n=this.responseBuffer.indexOf(w.ETX);if(e>0)return this.responseBuffer=this.responseBuffer.slice(e),this.flushResponseBuffer();if(0===e&&t>0){if(2===t&&this.responseBuffer[1]===w.Q)return console.warn("Unrecognized command received"),this.responseBuffer=this.responseBuffer.slice(t+1),this.flushResponseBuffer();if(-1!==n){var r={};return 4===n?(r.type="status",r.status=this.parseStatus(this.responseBuffer.subarray(1,3))):n-t===3?(r.type="weight",r.status=this.parseStatus(this.responseBuffer.subarray(t+1,n)),r.units=this.decoder.decode(this.responseBuffer.subarray(t-2,t)).trim(),r.weight=parseFloat(this.decoder.decode(this.responseBuffer.subarray(e+1,t-2)).trim(),10)):console.warn("Unrecognized format",this.responseBuffer),r.type&&(this.dispatchEvent(new CustomEvent(r.type,{detail:Object(l.a)({},r)})),"weight"===r.type&&this.lastSettled.weight!==r.weight&&r.status.stable&&(this.lastSettled=r,this.dispatchEvent(new CustomEvent("settled",{detail:Object(l.a)({},r)})))),this.responseBuffer=this.responseBuffer.slice(n+1),this.flushResponseBuffer()}}}},{key:"readLoop",value:function(){var e=this;return this.reader.read().then((function(t){var n=t.value;t.done;e.isConnected&&!e.isDisconnecting&&e.readLoop(),e.responseBuffer=Uint8Array.from([].concat(Object(u.a)(e.responseBuffer),Object(u.a)(n))),e.flushResponseBuffer()})).catch((function(t){return console.error(t),e.disconnect()}))}},{key:"startPolling",value:function(){var e=this;this.isPolling||this.initPort().then((function(){e.isPolling=!0;var t=setInterval((function(){e.isConnected&&e.isPolling&&!e.isDisconnecting?e.getWeight():(clearInterval(t),e.isPolling=!1)}),250)}))}},{key:"stopPolling",value:function(){this.isPolling=!1}},{key:"getWeight",value:function(){var e=this;return new Promise((function(t){var n=m.W,r=m.CR;e.addEventListener("weight",(function n(r){e.removeEventListener("weight",n),t(r.detail)})),e.send(new Uint8Array([n,r]))}))}},{key:"getStatus",value:function(){var e=this;return new Promise((function(t){var n=m.S,r=m.CR;e.addEventListener("status",(function n(r){var i=r.detail;e.removeEventListener("status",n),t(i)})),e.send(new Uint8Array([n,r]))}))}},{key:"zero",value:function(){var e=m.Z,t=m.CR;return this.send(new Uint8Array([e,t]))}}]),n}(Object(j.a)(EventTarget)),k=n(89),C=n(80),E=n(82),S=n(83),P=n(84),L=n(27),R=n(85),I=n(86),D=n(87),A=new B,W=Object(C.a)((function(e){return{button:{marginTop:e.spacing(2),marginRight:e.spacing(2),marginBottom:e.spacing(4)},container:{marginTop:e.spacing(4)}}}));function F(){var e=W(),t=Object(i.useState)({}),n=Object(c.a)(t,2),s=n[0],a=n[1],o=Object(i.useState)(),u=Object(c.a)(o,2),l=u[0],f=u[1],h=Object(i.useState)(),d=Object(c.a)(h,2),p=d[0],v=d[1],b=function(e){var t=e.detail,n=e.timeStamp,r=e.type;a(t),f(new Date(n).toString()),v(r)};return Object(i.useEffect)((function(){return A.addEventListener("weight",b),A.addEventListener("status",b),A.addEventListener("settled",b),function(){A.removeEventListener("weight",b),A.removeEventListener("status",b),A.removeEventListener("settled",b)}})),Object(r.jsxs)("div",{children:[Object(r.jsx)(E.a,{position:"static",children:Object(r.jsx)(S.a,{children:Object(r.jsx)(L.a,{variant:"h5",children:"WebUSB Scale Demo"})})}),Object(r.jsxs)(P.a,{className:e.container,children:[Object(r.jsx)(L.a,{variant:"h6",gutterBottom:!0,children:"Controls"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.getWeight().then((function(e){return console.log(e)}))},children:"Get Weight"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.getStatus().then((function(e){return console.log(e)}))},children:"Get Status"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.zero()},children:"Zero"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.startPolling()},children:"Start Polling"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.stopPolling()},children:"Stop Polling"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.disconnect()},children:"Disconnect"}),Object(r.jsxs)(R.a,{children:[Object(r.jsx)(I.a,{title:"Event Log",subheader:l}),Object(r.jsxs)(D.a,{children:[Object(r.jsxs)(L.a,{variant:"subtitle2",display:"block",children:['Event: "',p,'"']}),Object(r.jsx)(L.a,{variant:"subtitle2",display:"block",children:Object(r.jsx)("div",{children:Object(r.jsx)("pre",{children:JSON.stringify(s,null,2)})})})]})]})]})]})}var N=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,91)).then((function(t){var n=t.getCLS,r=t.getFID,i=t.getFCP,s=t.getLCP,a=t.getTTFB;n(e),r(e),i(e),s(e),a(e)}))},T=n(88);o.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(T.a,{children:Object(r.jsx)(F,{})})}),document.getElementById("root")),N()}},[[58,1,2]]]);
//# sourceMappingURL=main.f330048f.chunk.js.map