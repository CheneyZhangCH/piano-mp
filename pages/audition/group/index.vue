<template>
  <view class="page">
    <view class="page-content">
      <template v-if="Array.isArray(teacherGroup) && teacherGroup.length > 0">
        <view v-for="group in teacherGroup" :key="group.id" class="group">
          <view class="group-title">
            <view class="group-name">
              <image class="group-icon" src="/static/images/group.png"></image>
              <text>{{ group.groupName }}</text>
            </view>
            <view class="group-num">{{ group.teachers.length + '人' }}</view>
          </view>
          <view class="group-content">
            <view v-for="teacher in group.teachers" :key="teacher.accountId" class="teacher-item" @click="navToTeacher(teacher)">
              <image class="avatar" :src="teacher.coverUrl" mode="fit"></image>
              <text>{{ teacher.teacherName }}</text>
            </view>
          </view>
        </view>
      </template>
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

<script>
export default {
  data() {
    return {
      tabBars: [
        {
          pagePath: '/pages/audition/group/index',
          text: '老师课表',
          iconPath: '/static/images/tabBar/kebiao.png',
          selectedIconPath: '/static/images/tabBar/kebiao_selected.png'
        },
        {
          pagePath: '/pages/audition/index/index',
          text: '账号开通',
          iconPath: '/static/images/tabBar/kaitong.png',
          selectedIconPath: '/static/images/tabBar/kaitong_selected.png'
        },
        {
          pagePath: '/pages/audition/index/index',
          text: '学员续费',
          iconPath: '/static/images/tabBar/xufei.png',
          selectedIconPath: '/static/images/tabBar/xufei_selected.png'
        },
      ],
      currentTab: {},
      teacherGroup: [],
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
      uni.showToast({ title: '请先登录', icon: 'none' })
      return uni.navigateTo({ url: '/pages/login/index' })
    }

    this.currentTab = this.tabBars[0]
    uni.setNavigationBarTitle({ title: this.tabBars[0].text })
    this.initOptions()
  }
  ,
  methods: {
    async initOptions() {
      const teacherGroupRes = await this.$http.get('/mini/teacherGroup/listTeachers',)
      console.log('teacherGroupRes', teacherGroupRes);
      this.teacherGroup = teacherGroupRes.data || []
    },
    handleNav(tab) {
      console.log('handleNav', tab)
      uni.navigateTo({ url: tab.pagePath })
    },
    navToTeacher(teacher) {
      uni.navigateTo({ url: `/pages/audition/teacher/index?id=${teacher.accountId}&name=${teacher.teacherName}` })
    },
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding-top: 4rpx;
  background: #F5F7FA;
}

.page-content {
  height: 100vh;
  padding-bottom: 100rpx;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.group {
  width: 100%;

  .group-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    background: #FFFFFF;
    padding: 0 56rpx;
    font-size: 32rpx;
    color: #141F33;

    .group-name {
      display: inline-flex;
      align-items: center;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }

    .group-num {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }

  .group-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
  }

  .group-content {
    display: flex;
    flex-wrap: wrap;
    padding-left: 60rpx;
    padding-top: 36rpx;

    .teacher-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #141F33;
      line-height: 40rpx;
      margin-bottom: 36rpx;
      margin-left: 72rpx;

      &:nth-child(4n+1) {
        margin-left: 0;
      }

      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50rpx;
        margin-bottom: 20rpx;
      }

    }

  }
}


</style>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  z-index: 9;
  bottom: 0;
  display: flex;
  width: 100vw;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 2rpx 0 0 0 rgba(0, 0, 0, 0.1);
  background-color: #FFF;

  image {
    will-change: transform;
  }

  .tab-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //width: 33.33%;
    width: 100%;
    height: 100rpx;

    .tab-bar-item-icon {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 10rpx;
    }

    .tab-bar-item-text {
      width: 100%;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 24rpx;
      font-weight: 400;
      line-height: 36rpx;
      color: #616B80;
      text-align: center;

      &.selected {
        font-weight: 500;
        color: #62BBEC;
      }
    }
  }
}
</style>
