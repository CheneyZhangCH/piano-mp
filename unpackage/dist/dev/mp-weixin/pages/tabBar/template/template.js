(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabBar/template/template"],{68:function(t,e,n){"use strict";(function(t){n(5);r(n(3));var e=r(n(69));function r(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n(1)["createPage"])},69:function(t,e,n){"use strict";n.r(e);var r=n(70),a=n(72);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);n(74),n(76);var i,u=n(15),l=Object(u["default"])(a["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],i);l.options.__file="pages/tabBar/template/template.nvue",e["default"]=l.exports},70:function(t,e,n){"use strict";n.r(e);var r=n(71);n.d(e,"render",(function(){return r["render"]})),n.d(e,"staticRenderFns",(function(){return r["staticRenderFns"]})),n.d(e,"recyclableRender",(function(){return r["recyclableRender"]})),n.d(e,"components",(function(){return r["components"]}))},71:function(t,e,n){"use strict";var r;n.r(e),n.d(e,"render",(function(){return a})),n.d(e,"staticRenderFns",(function(){return i})),n.d(e,"recyclableRender",(function(){return o})),n.d(e,"components",(function(){return r}));try{r={uLink:function(){return n.e("components/u-link/u-link").then(n.bind(null,1032))}}}catch(u){if(-1===u.message.indexOf("Cannot find module")||-1===u.message.indexOf(".vue"))throw u;console.error(u.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var a=function(){var t=this,e=t.$createElement,n=(t._self._c,t.__map(t.list,(function(e,n){var r=t.__get_orig(e),a=t.hideList.indexOf(e.url),o=e.open?t.__map(e.pages,(function(e,n){var r=t.__get_orig(e),a=t.hideList.indexOf(e.url);return{$orig:r,g1:a}})):null;return{$orig:r,g0:a,l0:o}})));t.$mp.data=Object.assign({},{$root:{l1:n}})},o=!1,i=[];a._withStripped=!0},72:function(t,e,n){"use strict";n.r(e);var r=n(73),a=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);e["default"]=a.a},73:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={props:{hasLeftWin:{type:Boolean},leftWinActive:{type:String}},data:function(){return{hideList:["ucharts","nav-city-dropdown"],list:[{name:"顶部选项卡",url:"tabbar"},{name:"组件通讯",url:"component-communication"},{name:"列表到详情示例",url:"list2detail-list"},{name:"GlobalData和vuex",url:"global"}]}},onShareAppMessage:function(){return{title:"欢迎体验uni-app",path:"/pages/tabBar/template/template"}},onNavigationBarButtonTap:function(e){t.navigateTo({url:"/pages/about/about"})},methods:{triggerCollapse:function(t,e){if(this.list[t].pages)for(var n=0;n<this.list.length;++n)this.list[n].open=t===n&&!this.list[n].open;else this.goDetailPage(this.list[t].url)},goDetailPage:function(e){var n=e.url?e.url:e,r=~n.indexOf("platform")?n:"/pages/template/"+n+"/"+n;return this.hasLeftWin?t.reLaunch({url:r}):t.navigateTo({url:r}),!1}}};e.default=n}).call(this,n(1)["default"])},74:function(t,e,n){"use strict";n.r(e);var r=n(75),a=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);e["default"]=a.a},75:function(t,e,n){},76:function(t,e,n){"use strict";n.r(e);var r=n(77),a=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);e["default"]=a.a},77:function(t,e,n){}},[[68,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tabBar/template/template.js.map