(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/API/storage/storage"],{417:function(e,t,n){"use strict";(function(e){n(5);o(n(3));var t=o(n(418));function o(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=n,e(t.default)}).call(this,n(1)["createPage"])},418:function(e,t,n){"use strict";n.r(t);var o=n(419),a=n(421);for(var r in a)"default"!==r&&function(e){n.d(t,e,(function(){return a[e]}))}(r);n(423);var c,s=n(15),i=Object(s["default"])(a["default"],o["render"],o["staticRenderFns"],!1,null,null,null,!1,o["components"],c);i.options.__file="pages/API/storage/storage.vue",t["default"]=i.exports},419:function(e,t,n){"use strict";n.r(t);var o=n(420);n.d(t,"render",(function(){return o["render"]})),n.d(t,"staticRenderFns",(function(){return o["staticRenderFns"]})),n.d(t,"recyclableRender",(function(){return o["recyclableRender"]})),n.d(t,"components",(function(){return o["components"]}))},420:function(e,t,n){"use strict";var o;n.r(t),n.d(t,"render",(function(){return a})),n.d(t,"staticRenderFns",(function(){return c})),n.d(t,"recyclableRender",(function(){return r})),n.d(t,"components",(function(){return o}));try{o={pageHead:function(){return n.e("components/page-head/page-head").then(n.bind(null,1039))}}}catch(s){if(-1===s.message.indexOf("Cannot find module")||-1===s.message.indexOf(".vue"))throw s;console.error(s.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var a=function(){var e=this,t=e.$createElement;e._self._c},r=!1,c=[];a._withStripped=!0},421:function(e,t,n){"use strict";n.r(t);var o=n(422),a=n.n(o);for(var r in o)"default"!==r&&function(e){n.d(t,e,(function(){return o[e]}))}(r);t["default"]=a.a},422:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={data:function(){return{title:"get/set/clearStorage",key:"",data:""}},methods:{keyChange:function(e){this.key=e.detail.value},dataChange:function(e){this.data=e.detail.value},getStorage:function(){var t=this.key;this.data;0===t.length?e.showModal({title:"读取数据失败",content:"key 不能为空",showCancel:!1}):e.getStorage({key:t,success:function(t){e.showModal({title:"读取数据成功",content:"data: '"+t.data+"'",showCancel:!1})},fail:function(){e.showModal({title:"读取数据失败",content:"找不到 key 对应的数据",showCancel:!1})}})},setStorage:function(){var t=this.key,n=this.data;0===t.length?e.showModal({title:"保存数据失败",content:"key 不能为空",showCancel:!1}):e.setStorage({key:t,data:n,success:function(t){e.showModal({title:"存储数据成功",content:JSON.stringify(t.errMsg),showCancel:!1})},fail:function(){e.showModal({title:"储存数据失败!",showCancel:!1})}})},clearStorage:function(){e.clearStorageSync(),this.key="",this.data="",e.showModal({title:"清除数据成功",content:" ",showCancel:!1})}}};t.default=n}).call(this,n(1)["default"])},423:function(e,t,n){"use strict";n.r(t);var o=n(424),a=n.n(o);for(var r in o)"default"!==r&&function(e){n.d(t,e,(function(){return o[e]}))}(r);t["default"]=a.a},424:function(e,t,n){}},[[417,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/API/storage/storage.js.map