(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uni-group/components/uni-group/uni-group"],{1124:function(n,t,e){"use strict";e.r(t);var r=e(1125),u=e(1127);for(var i in u)"default"!==i&&function(n){e.d(t,n,(function(){return u[n]}))}(i);e(1129);var o,c=e(15),a=Object(c["default"])(u["default"],r["render"],r["staticRenderFns"],!1,null,"176b3b64",null,!1,r["components"],o);a.options.__file="uni_modules/uni-group/components/uni-group/uni-group.vue",t["default"]=a.exports},1125:function(n,t,e){"use strict";e.r(t);var r=e(1126);e.d(t,"render",(function(){return r["render"]})),e.d(t,"staticRenderFns",(function(){return r["staticRenderFns"]})),e.d(t,"recyclableRender",(function(){return r["recyclableRender"]})),e.d(t,"components",(function(){return r["components"]}))},1126:function(n,t,e){"use strict";var r;e.r(t),e.d(t,"render",(function(){return u})),e.d(t,"staticRenderFns",(function(){return o})),e.d(t,"recyclableRender",(function(){return i})),e.d(t,"components",(function(){return r}));var u=function(){var n=this,t=n.$createElement;n._self._c},i=!1,o=[];u._withStripped=!0},1127:function(n,t,e){"use strict";e.r(t);var r=e(1128),u=e.n(r);for(var i in r)"default"!==i&&function(n){e.d(t,n,(function(){return r[n]}))}(i);t["default"]=u.a},1128:function(n,t,e){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e={name:"uniGroup",emits:["click"],props:{title:{type:String,default:""},top:{type:[Number,String],default:10},mode:{type:String,default:"default"}},data:function(){return{margin:!1,border:!1}},watch:{title:function(t){n.report&&""!==t&&n.report("title",t)}},created:function(){this.form=this.getForm(),this.form&&(this.margin=!0,this.border=this.form.border)},methods:{getForm:function(){var n=this.$parent,t=n.$options.name;while("uniForms"!==t){if(n=n.$parent,!n)return!1;t=n.$options.name}return n},onClick:function(){this.$emit("click")}}};t.default=e}).call(this,e(1)["default"])},1129:function(n,t,e){"use strict";e.r(t);var r=e(1130),u=e.n(r);for(var i in r)"default"!==i&&function(n){e.d(t,n,(function(){return r[n]}))}(i);t["default"]=u.a},1130:function(n,t,e){}}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-group/components/uni-group/uni-group.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uni-group/components/uni-group/uni-group-create-component',
    {
        'uni_modules/uni-group/components/uni-group/uni-group-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(1124))
        })
    },
    [['uni_modules/uni-group/components/uni-group/uni-group-create-component']]
]);
