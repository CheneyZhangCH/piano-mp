<template>
  <view class="page">
    <view class="image-wrap">
      <image class="image" src="/static/images/success.png"/>
    </view>
    <view class="description">合同已发送，等待对方确认</view>
    <view class="btn-wrap">
      <button class="btn-second flex align-center justify-center" @click="back">我知道了</button>
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
  },
  methods: {
    navToLogin() {
      uni.navigateTo({ url: '/pages/login/login' })
    },
    getUserPhoneNumber(e) {
      console.log('getUserPhoneNumber', e)
      console.log(e.detail.code)
    },
    back() {
      uni.navigateBack({ delta: 1 })
    },
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-wrap {
  text-align: center;
}

.image {
  width: 120rpx;
  height: 120rpx;
  margin: 216rpx auto 80rpx auto;
}
.description {
  font-size: 32rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #141F33;
  line-height: 44rpx;
  text-align: center;
}
.btn-wrap {
  margin-top: 568rpx;
}

button::after {
  border: none;
}
</style>
