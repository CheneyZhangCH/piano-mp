(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat"],{1405:function(e,t,r){"use strict";r.r(t);var n=r(1406),a=r(1408);for(var u in a)"default"!==u&&function(e){r.d(t,e,(function(){return a[e]}))}(u);var o,i=r(15),s=Object(i["default"])(a["default"],n["render"],n["staticRenderFns"],!1,null,null,null,!1,n["components"],o);s.options.__file="uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.vue",t["default"]=s.exports},1406:function(e,t,r){"use strict";r.r(t);var n=r(1407);r.d(t,"render",(function(){return n["render"]})),r.d(t,"staticRenderFns",(function(){return n["staticRenderFns"]})),r.d(t,"recyclableRender",(function(){return n["recyclableRender"]})),r.d(t,"components",(function(){return n["components"]}))},1407:function(e,t,r){"use strict";var n;r.r(t),r.d(t,"render",(function(){return a})),r.d(t,"staticRenderFns",(function(){return o})),r.d(t,"recyclableRender",(function(){return u})),r.d(t,"components",(function(){return n}));var a=function(){var e=this,t=e.$createElement;e._self._c},u=!1,o=[];a._withStripped=!0},1408:function(e,t,r){"use strict";r.r(t);var n=r(1409),a=r.n(n);for(var u in n)"default"!==u&&function(e){r.d(t,e,(function(){return n[e]}))}(u);t["default"]=a.a},1409:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(1410),a={name:"uniDateformat",props:{date:{type:[Object,String,Number],default:function(){return"-"}},locale:{type:String,default:"zh"},threshold:{type:Array,default:function(){return[0,0]}},format:{type:String,default:"yyyy/MM/dd hh:mm:ss"},refreshRate:{type:[Number,String],default:0}},data:function(){return{refreshMark:0}},computed:{dateShow:function(){return this.refreshMark,(0,n.friendlyDate)(this.date,{locale:this.locale,threshold:this.threshold,format:this.format})}},watch:{refreshRate:{handler:function(){this.setAutoRefresh()},immediate:!0}},methods:{refresh:function(){this.refreshMark++},setAutoRefresh:function(){var e=this;clearInterval(this.refreshInterval),this.refreshRate&&(this.refreshInterval=setInterval((function(){e.refresh()}),parseInt(this.refreshRate)))}}};t.default=a}}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat-create-component',
    {
        'uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(1405))
        })
    },
    [['uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat-create-component']]
]);
