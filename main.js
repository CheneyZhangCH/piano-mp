import App from './App'
import store from './store'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}
// 引入请求库
import hRequire from './common/require.js'
Vue.prototype.$http = hRequire

import customTabbar from './components/custom-tabbar'
Vue.component('customTabbar', customTabbar)

// 权限验证操作
Vue.prototype.checkAuth = (callback) => {
	const token = uni.getStorageSync('token')
	// 权限验证
	if (!token) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		return uni.navigateTo({
			url: '/pages/login/index'
		})
	}
	callback()
}

App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif