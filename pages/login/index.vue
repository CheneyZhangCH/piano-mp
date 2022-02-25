<template>
  <view class="login-all-wrap">
    <view class="login-image-wrap">
      <image
        class="login-image"
        src="https://static.gangqintonghua.com/mp/login.png"
      />
    </view>
    <view class="login-btn-wrap">
      <button class="login-btn-text self-login" open-type="getPhoneNumber" @getphonenumber="getUserPhoneNumber">本机号码一键登录</button>
      <button @click="navToLogin">
        <view class="login-btn-text other-login">
          <text>其他手机号码登录</text>
        </view>
      </button>
    </view>
  </view>
</template>
<script>

export default {
  components: {},
  data() {
    return {
      jumpPage: '',
      keyword: '',
      loading: false,
    }
  },
  onReady: function () {
  },
  onLoad(option) {
    if (option.page !== '') {
      this.jumpPage = option.page
    }

    if (option.keyword !== '') {
      this.keyword = option.keyword
    }

    wx.login({
      success (res) {
        console.log('wx.login', res);
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: 'https://example.com/onLogin',
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },
  methods: {
    navToLogin() {
      uni.navigateTo({ url: '/pages/login/login' })
    },
    async getUserPhoneNumber(e) {
      console.log('getUserPhoneNumber', e)
      console.log(e.detail.code)
      this.loading = true
      try {
        const res = await this.$http.post('/login/wechatPhoneLoginMini', { data: e.detail.code} )
        console.log('handle login', res)
        const { accountType, token, phone, id } = res.data
        uni.setStorageSync('accountType', accountType)
        uni.setStorageSync('token', token)
        uni.setStorageSync('phone', phone)
        uni.setStorageSync('userId', id)

        uni.navigateBack({	delta: 2	})
      } finally {
        this.loading = false
      }

    },
    back() {
      uni.navigateBack({ delta: 1 })
    },
  }
}
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.back-image {
  float: left;
  width: 40rpx;
  height: 40rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;
}

.login-all-wrap {
  position: relative;
  padding: 0;
}

.login-image-wrap {
  height: 100vh;
  width: 100vw;

  .login-image {
    height: 100vh;
    width: 100vw;
  }
}

.login-btn-wrap {
  position: absolute;
  top: 900rpx;
  z-index: 1;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    position: relative;
    height: 88rpx;
    width: 350rpx;
    border-radius: 44rpx;
    padding: 0;
    background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
    color: #E3E5E9;

    & + button {
      margin-top: 60rpx;
      //color: #E3E5E9;
      color: rgba(227, 229, 233, 0.15);
      background-color: rgba(0, 0, 0, 0.15);
    }
  }

  .login-btn-text {
    width: 350rpx;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }

  .self-login {
    color: #E3E5E9;
    background-color: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
  }

  .other-login {
    color: #E3E5E9;
    background-color: rgba(0, 0, 0, 0.15);
  }

  .login-btn-bg {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 44rpx;
    display: inline-block;
    width: 350rpx;
    height: 88rpx;
  }
}

button::after {
  border: none;
}
</style>
