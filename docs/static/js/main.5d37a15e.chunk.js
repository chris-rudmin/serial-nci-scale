(this["webpackJsonpserial-nci-scale"]=this["webpackJsonpserial-nci-scale"]||[]).push([[0],{404:function(e,t,n){"use strict";n.r(t);var r=n(7),s=n(0),a=n.n(s),i=n(57),o=n.n(i),c=n(184),l=(n(198),n(200),n(201),n(202),n(203),n(204),n(205),n(206),n(207),n(208),n(209),n(210),n(211),n(212),n(213),n(214),n(215),n(216),n(217),n(218),n(219),n(220),n(221),n(222),n(223),n(225),n(226),n(88),n(227),n(228),n(229),n(230),n(231),n(232),n(233),n(234),n(235),n(236),n(237),n(238),n(239),n(240),n(242),n(243),n(244),n(245),n(246),n(247),n(248),n(249),n(250),n(251),n(252),n(253),n(255),n(256),n(257),n(258),n(259),n(260),n(261),n(262),n(263),n(264),n(265),n(266),n(268),n(269),n(270),n(271),n(272),n(273),n(275),n(277),n(279),n(280),n(281),n(282),n(283),n(284),n(285),n(286),n(287),n(288),n(289),n(290),n(291),n(292),n(293),n(294),n(295),n(296),n(297),n(298),n(300),n(301),n(305),n(306),n(307),n(309),n(310),n(311),n(312),n(313),n(314),n(315),n(316),n(317),n(318),n(319),n(162),n(320),n(321),n(322),n(323),n(324),n(325),n(326),n(165),n(327),n(328),n(329),n(330),n(331),n(332),n(334),n(335),n(336),n(337),n(338),n(339),n(340),n(341),n(342),n(343),n(344),n(345),n(346),n(347),n(348),n(349),n(350),n(351),n(352),n(353),n(357),n(358),n(359),n(360),n(361),n(362),n(363),n(364),n(365),n(366),n(367),n(368),n(369),n(370),n(371),n(372),n(373),n(374),n(375),n(376),n(377),n(378),n(379),n(380),n(381),n(382),n(383),n(384),n(385),n(386),n(387),n(388),n(389),n(390),n(391),n(392),n(393),n(394),n(395),n(396),n(399),n(175),n(129)),u=n(130),h=n(43),p=n.n(h),d=n(83),f=n(177),b=n(178),v=n(179),j=n(185),g=n(186),m=(n(176),{CR:parseInt("0d",16),W:parseInt("57",16),S:parseInt("53",16),Z:parseInt("5a",16),LF:parseInt("0A",16),ETX:parseInt("03",16),Q:parseInt("3F",16)}),y={weight:new Uint8Array([m.W,m.CR]),status:new Uint8Array([m.S,m.CR]),zero:new Uint8Array([m.Z,m.CR])},x={type:null,weight:null,units:null,status:{}},O={baudRate:9600,dataBits:7,stopBits:1,parity:"even"},w=function(e){Object(v.a)(n,e);var t=Object(j.a)(n);function n(){var e,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Object(f.a)(this,n),(e=t.call(this)).filters=r.filters||[],e.portConfig=Object.assign({},O,r.portConfig),e.isConnected=!1,e.isPolling=!1,e.lastSettled=Object.assign({},x),e.responseBuffer=new Uint8Array,e}return Object(b.a)(n,[{key:"decode",value:function(e){return String.fromCharCode.apply(null,e)}},{key:"initPort",value:function(){var e=Object(d.a)(p.a.mark((function e(){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.isConnected){e.next=10;break}return e.next=3,navigator.serial.requestPort({filters:this.filters});case 3:return this.port=e.sent,e.next=6,this.port.open(this.portConfig);case 6:this.reader=this.port.readable.getReader(),this.writer=this.port.writable.getWriter(),this.isConnected=!0,this.readLoop();case 10:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"disconnect",value:function(){var e=Object(d.a)(p.a.mark((function e(){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.isConnected){e.next=16;break}return this.isConnected=!1,e.prev=2,e.next=5,this.reader.cancel();case 5:return this.reader.releaseLock(),e.next=8,this.writer.abort();case 8:return this.writer.releaseLock(),e.next=11,this.port.close();case 11:e.next=16;break;case 13:e.prev=13,e.t0=e.catch(2),console.error(e.t0);case 16:case"end":return e.stop()}}),e,this,[[2,13]])})));return function(){return e.apply(this,arguments)}}()},{key:"send",value:function(e){var t=this;return this.initPort().then((function(){return t.writer.write(e).catch((function(e){throw t.disconnect(),e}))}))}},{key:"bitArray",value:function(e){if(e<0||e>63||e%1!==0)throw new Error("".concat(e," does not fit into 6 bits"));return("000000"+e.toString(2)).substr(-6).split("").reverse()}},{key:"parseStatus",value:function(e){var t=this.bitArray(e[0]),n=this.bitArray(e[1]);return{stable:"0"===t[0],atZero:"1"===t[1],ramError:"1"===t[2],eepRomError:"1"===t[3],underCapacity:"1"===n[0],overCapacity:"1"===n[1],romError:"1"===n[2],calibrationError:"1"===n[3]}}},{key:"flushResponseBuffer",value:function(){var e=this.responseBuffer.indexOf(m.LF),t=this.responseBuffer.indexOf(m.CR),n=this.responseBuffer.indexOf(m.ETX);if(e>0)return console.warn("Partial data received. Flushing."),this.responseBuffer=this.responseBuffer.slice(e),this.flushResponseBuffer();if(0===e&&t>0){if(2===t&&this.responseBuffer[1]===m.Q)return console.warn("Unrecognized command received"),this.responseBuffer=this.responseBuffer.slice(t+1),this.flushResponseBuffer();if(-1!==n){var r={};return 4===n?(r.type="status",r.status=this.parseStatus(this.responseBuffer.subarray(1,3))):n-t===3?(r.type="weight",r.status=this.parseStatus(this.responseBuffer.subarray(t+1,n)),r.units=this.decode(this.responseBuffer.subarray(t-2,t)).trim(),r.weight=parseFloat(this.decode(this.responseBuffer.subarray(e+1,t-2)).trim(),10)):console.warn("Unrecognized format",this.responseBuffer),r.type&&(this.dispatchEvent(new CustomEvent(r.type,{detail:Object(u.a)({},r)})),"weight"===r.type&&this.lastSettled.weight!==r.weight&&r.status.stable&&(this.lastSettled=r,this.dispatchEvent(new CustomEvent("settled",{detail:Object(u.a)({},r)})))),this.responseBuffer=this.responseBuffer.slice(n+1),this.flushResponseBuffer()}}}},{key:"readLoop",value:function(){var e=Object(d.a)(p.a.mark((function e(){var t,n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=1,e.next=4,this.reader.read();case 4:if(t=e.sent,n=t.value,!t.done){e.next=9;break}return e.abrupt("break",19);case 9:this.responseBuffer=Uint8Array.from([].concat(Object(l.a)(this.responseBuffer),Object(l.a)(n))),this.flushResponseBuffer(),e.next=17;break;case 13:return e.prev=13,e.t0=e.catch(1),this.disconnect(),e.abrupt("break",19);case 17:e.next=0;break;case 19:case"end":return e.stop()}}),e,this,[[1,13]])})));return function(){return e.apply(this,arguments)}}()},{key:"startPolling",value:function(){var e=Object(d.a)(p.a.mark((function e(){var t,n,r=this,s=arguments;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=s.length>0&&void 0!==s[0]?s[0]:500,this.isPolling){e.next=6;break}return e.next=4,this.initPort();case 4:this.isPolling=!0,n=setInterval((function(){r.isConnected&&r.isPolling?r.send(y.weight):(clearInterval(n),r.isPolling=!1)}),t);case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"stopPolling",value:function(){this.isPolling=!1}},{key:"sendAndGetResponse",value:function(e){var t=this;return new Promise((function(n,r){var s=function r(s){t.removeEventListener(e,r),n(s.detail)};t.addEventListener(e,s),t.send(y[e]).catch((function(n){t.removeEventListener(e,s),r(n)}))}))}},{key:"getWeight",value:function(){return this.sendAndGetResponse("weight")}},{key:"getStatus",value:function(){return this.sendAndGetResponse("status")}},{key:"zero",value:function(){return this.send(y.zero)}}]),n}(Object(g.a)(EventTarget));w.isWebSerialSupported=!(!navigator||!navigator.serial),w.supportedScaleFilters=[{usbVendorId:6790,usbProductId:29987}];var k=n(437),S=n(427),B=n(429),C=n(430),P=n(431),E=n(103),T=n(433),L=n(434),I=n(435),R=n(432),A=new w,N=Object(S.a)((function(e){return{button:{marginTop:e.spacing(2),marginRight:e.spacing(2)},spaceTop:{marginTop:e.spacing(4)}}}));function W(){var e=N(),t=Object(s.useState)({scaleData:{},eventTimeStamp:"",eventType:""}),n=Object(c.a)(t,2),a=n[0],i=n[1],o=function(e){var t=e.detail,n=e.timeStamp,r=e.type;i({scaleData:t,eventTimeStamp:n,eventType:r})};return Object(s.useEffect)((function(){return console.log("binding event handlers"),A.addEventListener("weight",o),A.addEventListener("status",o),A.addEventListener("settled",o),function(){console.log("Unbinding event handlers"),A.removeEventListener("weight",o),A.removeEventListener("status",o),A.removeEventListener("settled",o)}}),[]),Object(r.jsxs)("div",{children:[Object(r.jsx)(B.a,{position:"static",children:Object(r.jsx)(C.a,{children:Object(r.jsx)(E.a,{variant:"h5",children:"Serial NCI Scale"})})}),Object(r.jsxs)(P.a,{className:e.spaceTop,maxWidth:"md",children:[Object(r.jsx)(E.a,{variant:"h4",gutterBottom:!0,children:"Connect Your Scale!"}),Object(r.jsx)(E.a,{variant:"body1",display:"block",children:"To test the serial-nci-scale library, be sure to enable the Web Serial API in chrome://flags and connect your scale. USB scales will need the appropriate VCP driver on Windows to virtualize a serial port."}),Object(r.jsx)(E.a,{variant:"h5",gutterBottom:!0,className:e.spaceTop,children:"Known Supported Devices"}),Object(r.jsx)(E.a,{variant:"body1",display:"block",gutterBottom:!0,children:"- Brecknell PS-USB (70lb)"}),Object(r.jsx)(R.a,{className:e.spaceTop}),w.isWebSerialSupported?Object(r.jsxs)("div",{children:[Object(r.jsx)(E.a,{variant:"h5",gutterBottom:!0,className:e.spaceTop,children:"Controls"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.getWeight().then((function(e){return console.log(e)}))},children:"Get Weight"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.getStatus().then((function(e){return console.log(e)}))},children:"Get Status"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.zero()},children:"Zero"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.startPolling()},children:"Start Polling"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.stopPolling()},children:"Stop Polling"}),Object(r.jsx)(k.a,{className:e.button,variant:"contained",color:"primary",onClick:function(){return A.disconnect()},children:"Disconnect"}),Object(r.jsxs)(T.a,{className:e.spaceTop,children:[Object(r.jsx)(L.a,{title:"Event Log",subheader:"Event '".concat(a.eventType,"' at time ").concat(a.eventTimeStamp)}),Object(r.jsx)(I.a,{children:Object(r.jsx)(E.a,{variant:"body1",display:"block",component:"div",children:Object(r.jsx)("pre",{children:JSON.stringify(a.scaleData,null,2)})})})]})]}):Object(r.jsx)(T.a,{className:e.spaceTop,children:Object(r.jsxs)(I.a,{children:[Object(r.jsx)(E.a,{variant:"h5",gutterBottom:!0,children:"Web Serial API is not supported in your browser"}),Object(r.jsx)(E.a,{variant:"body1",children:"Try using Chrome with the Web Serial API enabled with flag chrome://flags/#enable-experimental-web-platform-features"})]})})]})]})}var F=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,439)).then((function(t){var n=t.getCLS,r=t.getFID,s=t.getFCP,a=t.getLCP,i=t.getTTFB;n(e),r(e),s(e),a(e),i(e)}))},U=n(436);o.a.render(Object(r.jsx)(a.a.StrictMode,{children:Object(r.jsx)(U.a,{children:Object(r.jsx)(W,{})})}),document.getElementById("root")),F()}},[[404,1,2]]]);
//# sourceMappingURL=main.5d37a15e.chunk.js.map