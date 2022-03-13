<template>
  <view class="content">
    <view
      v-for="lesson in lessonList"
      :key="lesson.id"
      class="lesson-item"
      @click="() => handleNavToLesson(lesson)"
    >
      <image
        class="lesson-item-image"
        :src="lesson.coverImg"
      />
    </view>
    <view class="tab-bar">
      <view
        v-for="tab in tabBars"
        :key="tab.text"
        class="tab-bar-item"
        @click="() => handleNav(tab)"
      >
        <image
          class="tab-bar-item-icon"
          :src="currentTab.text === tab.text ? tab.selectedIconPath : tab.iconPath"
        />
        <text
          class="tab-bar-item-text"
          :class="currentTab.text === tab.text ? 'selected' : ''"
        >
          {{ tab.text }}
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="js">
export default {
  data() {
    return {
      tabBars: [
        {
          pagePath: 'pages/index/index',
          text: '配套视频',
          iconPath: '/static/images/tabBar/video.png',
          selectedIconPath: '/static/images/tabBar/video_selected.png'
        },
        // {
        //   pagePath: "pages/index/index",
        //   text: "课后作业",
        //   iconPath: "/static/images/tabBar/homework.png",
        //   selectedIconPath: "/static/images/tabBar/homework_selected.png"
        // },
        // {
        //   pagePath: "pages/index/index",
        //   text: "学员中心",
        //   iconPath: "/static/images/tabBar/user.png",
        //   selectedIconPath: "/static/images/tabBar/user_selected.png"
        // },
      ],
      currentTab: {},
      lessonList: [
        {
          id: 1,
          name: '车尔尼钢琴599',
          coverImg: 'http://static.gangqintonghua.com/test/1.png',
        },
        {
          id: 2,
          name: '上音考试曲目',
          coverImg: 'http://static.gangqintonghua.com/test/2.png',
        },
        {
          id: 3,
          name: '什密特手指练习',
          coverImg: 'http://static.gangqintonghua.com/test/3.png',
        },
      ],
      shiTingTabs: [
        {
          pagePath: 'pages/index/index',
          text: '老师课表',
          iconPath: '/static/images/tabBar/kebiao.png',
          selectedIconPath: '/static/images/tabBar/kebiao_selected.png'
        },
        {
          pagePath: 'pages/index/index',
          text: '账号开通',
          iconPath: '/static/images/tabBar/kaitong.png',
          selectedIconPath: '/static/images/tabBar/kaitong_selected.png'
        },
        {
          pagePath: 'pages/index/index',
          text: '学员续费',
          iconPath: '/static/images/tabBar/xufei.png',
          selectedIconPath: '/static/images/tabBar/xufei_selected.png'
        },
      ]
    }
  },
  onLoad() {
    const token = uni.getStorageSync('token')
    const accountType = uni.getStorageSync('accountType')
    // const phone = uni.getStorageSync('phone')
    // const userId = uni.getStorageSync('userId')
    console.log('token', token)
    console.log('accountType', accountType)
    // console.log('phone', phone)
    // console.log('userId', userId)

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



    if (accountType === 'SUPER_ADMIN') {
      return uni.redirectTo({ url: '/pages/audition/index/index' })
    }
    if (accountType === 'AUDITION') {
      return uni.redirectTo({ url: '/pages/audition/index/index' })
    }
    this.currentTab = this.tabBars[0]
    uni.setNavigationBarTitle({ title: this.tabBars[0].text })
  },
  methods: {
    handleNav(tab) {
      this.currentTab = tab
      uni.setNavigationBarTitle({ title: tab.text })
    },
    handleNavToLesson(lesson) {
      uni.navigateTo({ url: `/pagesLesson/detail/index?id=${lesson.id}` })
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  text-align: center;
}
.lesson-item {
  width: 690rpx;
  height: 270rpx;
  margin-top: 30rpx;
  .lesson-item-image {
    width: 690rpx;
    height: 270rpx;
  }
}

.tab-bar {
  position: fixed;
  bottom: 0;
  width: 100vw;
  display: flex;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 2rpx 0 0 0 rgba(0, 0, 0, 0.1);

  image {
    will-change: transform
  }

  .tab-bar-item {
    //width: 33.33%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .tab-bar-item-icon {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 10rpx;
    }

    .tab-bar-item-text {
      width: 100%;
      text-align: center;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #616B80;
      line-height: 36rpx;

      &.selected {
        font-weight: 500;
        color: #62BBEC;
      }
    }
  }
}
</style>
