(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/extUI/forms/forms"],{531:function(e,n,t){"use strict";(function(e){t(5);r(t(3));var n=r(t(532));function r(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=t,e(n.default)}).call(this,t(1)["createPage"])},532:function(e,n,t){"use strict";t.r(n);var r=t(533),o=t(535);for(var u in o)"default"!==u&&function(e){t.d(n,e,(function(){return o[e]}))}(u);t(537);var i,s=t(15),a=Object(s["default"])(o["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],i);a.options.__file="pages/extUI/forms/forms.vue",n["default"]=a.exports},533:function(e,n,t){"use strict";t.r(n);var r=t(534);t.d(n,"render",(function(){return r["render"]})),t.d(n,"staticRenderFns",(function(){return r["staticRenderFns"]})),t.d(n,"recyclableRender",(function(){return r["recyclableRender"]})),t.d(n,"components",(function(){return r["components"]}))},534:function(e,n,t){"use strict";var r;t.r(n),t.d(n,"render",(function(){return o})),t.d(n,"staticRenderFns",(function(){return i})),t.d(n,"recyclableRender",(function(){return u})),t.d(n,"components",(function(){return r}));try{r={uniCard:function(){return t.e("uni_modules/uni-card/components/uni-card/uni-card").then(t.bind(null,1072))},uniSection:function(){return t.e("components/uni-section/uni-section").then(t.bind(null,1079))},uniForms:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uni-forms/components/uni-forms/uni-forms")]).then(t.bind(null,1086))},uniFormsItem:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uni-forms/components/uni-forms-item/uni-forms-item")]).then(t.bind(null,1094))},uniEasyinput:function(){return t.e("uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput").then(t.bind(null,1101))},uniDataCheckbox:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox")]).then(t.bind(null,1108))},uniDatetimePicker:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker")]).then(t.bind(null,1056))},uniSegmentedControl:function(){return t.e("uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control").then(t.bind(null,1117))}}}catch(s){if(-1===s.message.indexOf("Cannot find module")||-1===s.message.indexOf(".vue"))throw s;console.error(s.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var o=function(){var e=this,n=e.$createElement;e._self._c},u=!1,i=[];o._withStripped=!0},535:function(e,n,t){"use strict";t.r(n);var r=t(536),o=t.n(r);for(var u in r)"default"!==u&&function(e){t.d(n,e,(function(){return r[e]}))}(u);n["default"]=o.a},536:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var t={data:function(){return{baseFormData:{name:"",age:"",introduction:"",sex:2,hobby:[5],datetimesingle:1627529992399},alignmentFormData:{name:"",age:""},sexs:[{text:"男",value:0},{text:"女",value:1},{text:"保密",value:2}],hobbys:[{text:"跑步",value:0},{text:"游泳",value:1},{text:"绘画",value:2},{text:"足球",value:3},{text:"篮球",value:4},{text:"其他",value:5}],current:0,items:["左对齐","顶部对齐"],valiFormData:{name:"",age:"",introduction:""},rules:{name:{rules:[{required:!0,errorMessage:"姓名不能为空"}]},age:{rules:[{required:!0,errorMessage:"年龄不能为空"},{format:"number",errorMessage:"年龄只能输入数字"}]}},customFormData:{name:"",age:"",hobby:[]},customRules:{name:{rules:[{required:!0,errorMessage:"姓名不能为空"}]},age:{rules:[{required:!0,errorMessage:"年龄不能为空"}]},hobby:{rules:[{format:"array"},{validateFunction:function(e,n,t,r){return n.length<2&&r("请至少勾选两个兴趣爱好"),!0}}]}},dynamicFormData:{email:"",domains:{}},dynamicLists:[],dynamicRules:{email:{rules:[{required:!0,errorMessage:"域名不能为空"},{format:"email",errorMessage:"域名格式错误"}]}}}},computed:{alignment:function(){return 0===this.current?"left":1===this.current?"top":"left"}},onLoad:function(){},onReady:function(){this.$refs.customForm.setRules(this.customRules)},methods:{onClickItem:function(e){console.log(e),this.current=e.currentIndex},add:function(){this.dynamicLists.push({label:"域名",rules:[{required:!0,errorMessage:"域名项必填"}],id:Date.now()})},del:function(e){var n=this.dynamicLists.findIndex((function(n){return n.id===e}));this.dynamicLists.splice(n,1)},submit:function(n){this.$refs[n].validate().then((function(n){console.log("success",n),e.showToast({title:"校验通过"})})).catch((function(e){console.log("err",e)}))}}};n.default=t}).call(this,t(1)["default"])},537:function(e,n,t){"use strict";t.r(n);var r=t(538),o=t.n(r);for(var u in r)"default"!==u&&function(e){t.d(n,e,(function(){return r[e]}))}(u);n["default"]=o.a},538:function(e,n,t){}},[[531,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/extUI/forms/forms.js.map