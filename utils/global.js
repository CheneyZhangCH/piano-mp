export default {
    install(Vue) {
        Vue.prototype.$toast = function(options) {
            uni.showToast({
                ...options
            })
        }
    }
}
