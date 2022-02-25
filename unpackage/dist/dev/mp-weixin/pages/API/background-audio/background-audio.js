(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/API/background-audio/background-audio"],{359:function(e,n,t){"use strict";(function(e){t(5);a(t(3));var n=a(t(360));function a(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=t,e(n.default)}).call(this,t(1)["createPage"])},360:function(e,n,t){"use strict";t.r(n);var a=t(361),r=t(363);for(var o in r)"default"!==o&&function(e){t.d(n,e,(function(){return r[e]}))}(o);t(365);var i,u=t(15),c=Object(u["default"])(r["default"],a["render"],a["staticRenderFns"],!1,null,null,null,!1,a["components"],i);c.options.__file="pages/API/background-audio/background-audio.vue",n["default"]=c.exports},361:function(e,n,t){"use strict";t.r(n);var a=t(362);t.d(n,"render",(function(){return a["render"]})),t.d(n,"staticRenderFns",(function(){return a["staticRenderFns"]})),t.d(n,"recyclableRender",(function(){return a["recyclableRender"]})),t.d(n,"components",(function(){return a["components"]}))},362:function(e,n,t){"use strict";var a;t.r(n),t.d(n,"render",(function(){return r})),t.d(n,"staticRenderFns",(function(){return i})),t.d(n,"recyclableRender",(function(){return o})),t.d(n,"components",(function(){return a}));try{a={pageHead:function(){return t.e("components/page-head/page-head").then(t.bind(null,1039))}}}catch(u){if(-1===u.message.indexOf("Cannot find module")||-1===u.message.indexOf(".vue"))throw u;console.error(u.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var r=function(){var e=this,n=e.$createElement;e._self._c},o=!1,i=[];r._withStripped=!0},363:function(e,n,t){"use strict";t.r(n);var a=t(364),r=t.n(a);for(var o in a)"default"!==o&&function(e){t.d(n,e,(function(){return a[e]}))}(o);n["default"]=r.a},364:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=o(t(348));function r(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return r=function(){return e},e}function o(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var n=r();if(n&&n.has(e))return n.get(e);var t={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var i=a?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(t,o,i):t[o]=e[o]}return t.default=e,n&&n.set(e,t),t}var i={data:function(){return{title:"backgroundAudio",bgAudioMannager:null,dataUrl:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3",playing:!1,playTime:0,formatedPlayTime:"00:00:00"}},onLoad:function(){var n=this;this.playing=this.$backgroundAudioData.playing,this.playTime=this.$backgroundAudioData.playTime,this.formatedPlayTime=this.$backgroundAudioData.formatedPlayTime;var t=e.getBackgroundAudioManager();t.title||(t.title="致爱丽丝"),t.singer||(t.singer="暂无"),t.coverImgUrl||(t.coverImgUrl="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/c517b410-5184-11eb-b997-9918a5dda011.jpeg"),t.onPlay((function(){console.log("开始播放"),n.$backgroundAudioData.playing=n.playing=!0})),t.onPause((function(){console.log("暂停播放"),n.$backgroundAudioData.playing=n.playing=!1})),t.onEnded((function(){n.playing=!1,n.$backgroundAudioData.playing=!1,n.$backgroundAudioData.playTime=n.playTime=0,n.$backgroundAudioData.formatedPlayTime=n.formatedPlayTime=a.formatTime(0)})),t.onTimeUpdate((function(e){Math.floor(t.currentTime)>Math.floor(n.playTime)&&(n.$backgroundAudioData.formatedPlayTime=n.formatedPlayTime=a.formatTime(Math.floor(t.currentTime))),n.$backgroundAudioData.playTime=n.playTime=t.currentTime})),this.bgAudioMannager=t},methods:{play:function(e){this.bgAudioMannager.src?(this.bgAudioMannager.seek(this.playTime),this.bgAudioMannager.play()):(this.bgAudioMannager.startTime=this.playTime,this.bgAudioMannager.src=this.dataUrl)},seek:function(e){this.bgAudioMannager.seek(e.detail.value)},pause:function(){this.bgAudioMannager.pause()},stop:function(){this.bgAudioMannager.stop(),this.$backgroundAudioData.playing=this.playing=!1,this.$backgroundAudioData.playTime=this.playTime=0,this.$backgroundAudioData.formatedPlayTime=this.formatedPlayTime=a.formatTime(0)}}};n.default=i}).call(this,t(1)["default"])},365:function(e,n,t){"use strict";t.r(n);var a=t(366),r=t.n(a);for(var o in a)"default"!==o&&function(e){t.d(n,e,(function(){return a[e]}))}(o);n["default"]=r.a},366:function(e,n,t){}},[[359,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/API/background-audio/background-audio.js.map