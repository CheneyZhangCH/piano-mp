(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/u-link/u-link"],{1032:function(n,e,t){"use strict";t.r(e);var r=t(1033),u=t(1035);for(var i in u)"default"!==i&&function(n){t.d(e,n,(function(){return u[n]}))}(i);var o,c=t(15),a=Object(c["default"])(u["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],o);a.options.__file="components/u-link/u-link.vue",e["default"]=a.exports},1033:function(n,e,t){"use strict";t.r(e);var r=t(1034);t.d(e,"render",(function(){return r["render"]})),t.d(e,"staticRenderFns",(function(){return r["staticRenderFns"]})),t.d(e,"recyclableRender",(function(){return r["recyclableRender"]})),t.d(e,"components",(function(){return r["components"]}))},1034:function(n,e,t){"use strict";var r;t.r(e),t.d(e,"render",(function(){return u})),t.d(e,"staticRenderFns",(function(){return o})),t.d(e,"recyclableRender",(function(){return i})),t.d(e,"components",(function(){return r}));var u=function(){var n=this,e=n.$createElement;n._self._c},i=!1,o=[];u._withStripped=!0},1035:function(n,e,t){"use strict";t.r(e);var r=t(1036),u=t.n(r);for(var i in r)"default"!==i&&function(n){t.d(e,n,(function(){return r[n]}))}(i);e["default"]=u.a},1036:function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t={name:"u-link",props:{href:{type:String,default:""},text:{type:String,default:""},inWhiteList:{type:Boolean,default:!1}},methods:{openURL:function(){this.inWhiteList?n.navigateTo({url:"/pages/component/web-view/web-view?url="+this.href}):(n.setClipboardData({data:this.href}),n.showModal({content:"本网址无法直接在小程序内打开。已自动复制网址，请在手机浏览器里粘贴该网址",showCancel:!1}))}}};e.default=t}).call(this,t(1)["default"])}}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/u-link/u-link.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/u-link/u-link-create-component',
    {
        'components/u-link/u-link-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(1032))
        })
    },
    [['components/u-link/u-link-create-component']]
]);
