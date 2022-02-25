import $C from './config.js'

export default {
  common: {
    method: 'GET',
    header: {
      'content-type': 'application/json',
    },
    data: {}
  },
  request(options = {}) {
    options.url = $C.webUrl + options.url
    options.method = options.method || this.common.method
    options.header = options.header || this.common.header
    try {
      options.header['Authorization'] = uni.getStorageSync('token')
    } catch (e) {
      console.log(e)
    }
    // 验证权限token
    console.log(options.url)
    // 大坑,真机调试时,手机必须联网,否则连不上也不报错!!!!
    return uni.request(options)
  },
  async get(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    options.header = options.header || this.common.header
    try {
      options.header['Authorization'] = uni.getStorageSync('token')
    } catch (e) {
      console.log(e)
    }
    return new Promise(async (resolve, reject) => {
      const responses = await this.request(options)
      console.log('res ------------', responses);
      if (responses[0]) {
        uni.showToast({ title: '网络超时', icon: 'none' })
        reject({ message: "网络超时" });
      } else {
        const response = responses[1].data; // 如果返回的结果是data.data的，嫌麻烦可以用这个，return res,这样只返回一个data
        if (response.code === 401 || response.code === 403) {
          uni.setStorageSync('accountType', '')
          uni.setStorageSync('token', '')
          uni.setStorageSync('phone', '')
          uni.setStorageSync('userId', '')

          uni.showToast({ title: '请先登录', icon: 'none' })
          uni.navigateTo({ url: '/pages/login/index' })
          reject({ message: "登录信息过期" });
        }

        if (response.ok && response.code === 200) {
          resolve(response);
        }
        reject(response)
      }
    })
  },
  async post(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    options.header = options.header || this.common.header
    try {
      options.header['Authorization'] = uni.getStorageSync('token')
    } catch (e) {
      console.log(e)
    }
    return new Promise(async (resolve, reject) => {
      const responses = await this.request(options)
      console.log('res ------------', responses);
      if (responses[0]) {
        uni.showToast({ title: '网络超时', icon: 'none' })
        reject({ message: "网络超时" });
      } else {
        const response = responses[1].data; // 如果返回的结果是data.data的，嫌麻烦可以用这个，return res,这样只返回一个data
        console.log('response', response);
        if (response.code === 401 || response.code === 403) {
          uni.setStorageSync('accountType', '')
          uni.setStorageSync('token', '')
          uni.setStorageSync('phone', '')
          uni.setStorageSync('userId', '')

          uni.showToast({ title: '请先登录', icon: 'none' })
          uni.navigateTo({ url: '/pages/login/index' })
          reject({ message: "登录信息过期" });
        }

        if (response.ok && response.code === 200) {
          resolve(response);
        }
        reject(response)
      }
    })
  },

}
