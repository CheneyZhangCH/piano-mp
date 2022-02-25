<template>
  <view class="page">
    <view class="page-content">
      <view class="title">一、合同双方信息</view>
      <view class="contract-item flex">
        <text class="contract-item-label">甲方：</text>
        <text class="contract-item-value flex-1 text-underline">钢琴童话（上海兴心教育科技有限公司）</text>
      </view>
      <view class="contract-item flex justify-between">
        <view class="contract-item-sub-item inline-flex">
          <text class="contract-item-label">乙方：</text>
          <text class="contract-item-value text-underline px-8">{{ basicForm.studentName }}</text>
        </view>
        <view class="contract-item-sub-item inline-flex">
          <text class="contract-item-label">监护人联系方式：</text>
          <text class="contract-item-value text-underline px-8">{{ basicForm.phone }}</text>
        </view>
      </view>

      <view class="title">二、签约课程信息</view>
      <view class="contract-item">{{ basicForm.packageName }}</view>
      <view v-for="course in basicForm.courses" :key="course.id" class="contract-item">
        {{
          course.courseName + course.courseNum + '节 ' + course.teacherName + dayOfWeekOBj[course.dayOfWeek] + ' ' + course.timetablePeriodName
        }}
      </view>
      <view class="contract-item">{{ '账户有效期：' + basicForm.expiryMonths + '个月' }}</view>

      <template v-for="contract in contractItems">
        <view class="title">{{ contract.title }}</view>
        <view v-for="(item, index) in contract.items" class="contract-item flex">
          <view class="contract-item-sub-item no">{{ (index + 1) + '. ' }}</view>
          <view class="contract-item-sub-item flex-1 inline-flex flex-wrap" :class="{'bold': item.bold}">{{ item.text }}</view>
        </view>
      </template>

      <view class="title">五、合同解除</view>
      <view class="contract-item flex">
        开课后，乙方因个人原因退学，可向甲方提出申请解除本合同，经甲方同意后，甲方有权扣除剩余课程费用的30%作为违约金，甲方扣除乙方违约金和已完成的课程费用后，在15个工作日内将剩余费用退还给乙方，如乙方已领取的教材和资料等其他用品可归还甲方或按照原价等价扣除。
      </view>

    </view>
    <view class="tab-bar">
      <view class="tab-bar-item mt-40">
        <button class="btn-primary" type="primary" @click="handleSubmit">确认无误，发送合同</button>
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
          pagePath: 'pagesAudition/index/index',
          text: '老师课表',
          iconPath: '/static/images/tabBar/kebiao.png',
          selectedIconPath: '/static/images/tabBar/kebiao_selected.png'
        },
        {
          pagePath: 'pagesAudition/index/index',
          text: '账号开通',
          iconPath: '/static/images/tabBar/kaitong.png',
          selectedIconPath: '/static/images/tabBar/kaitong_selected.png'
        },
        {
          pagePath: 'pagesAudition/index/index',
          text: '学员续费',
          iconPath: '/static/images/tabBar/xufei.png',
          selectedIconPath: '/static/images/tabBar/xufei_selected.png'
        },
      ],
      currentTab: {},

      contractItems: [
        {
          title: '三、甲方权责',
          items: [
            { text: '甲方需提供合格经过培训的专业教师以保证教学质量。', bold: false, },
            { text: '甲方必须为乙方提供专业的学习场所用于开展学习服务。', bold: false, },
            { text: '甲方需为乙方建立学员学习记录档案并反馈学员学习状况。', bold: false, },
          ],
        },
        {
          title: '四、乙方权责',
          items: [
            { text: '若乙方因个人原因请假或缺席，需至少提前2小时告知甲方，若无故缺席、迟到等行为，甲方有权利扣除相应课时。', bold: false, },
            { text: '若因乙方之原因(如迟到，缺勤，未按时完成作业，不配合教学计划等)致使学习目的无法完成，则甲方不承担任何责任。', bold: false, },
            { text: '乙方购买的课时，需在相应有效期内使用完毕，若因个人原因导致课时沉余，甲方有权利针对过期课时进行等价折课或抵扣券等操作。', bold: false, },
            { text: '为保证乙方安全，上下学及上课过程须由家长或其监护人接送，甲方不负责由此产生的一切意外事故。', bold: false, },
            { text: '甲方提供的内部教材，学习资料及配套物料等，仅限乙方本人使用，乙方不得擅自将内部资料告知或借阅他人使用，如乙方违反本条约定，甲方有权当即终止本协议。。', bold: true, },
          ],
        }
      ],

      dayOfWeekOBj: {
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日',
      },

      basicForm: {
        studentName: '',
        phone: '',
        gender: '', // female,male
        birthday: '',
        age: '',

        packageIndex: 0, // 选中的课程包index
        packageId: '',
        packageName: '',
        expiryMonths: 0,
        expiryDate: 0,
        courses: [],

        basicStudyDays: 0,
        basicStudyChapters: 0,
      },
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

    this.initData()
  },
  methods: {
    initData() {
      const contract = uni.getStorageSync('contract')
      this.basicForm = contract ? JSON.parse(contract) : {
        studentName: '',
        phone: '',
        gender: '', // female,male
        birthday: '',
        age: '',

        packageIndex: 0, // 选中的课程包index
        packageId: '',
        packageName: '',
        expiryMonths: 0,
        expiryDate: 0,
        courses: [],

        basicStudyDays: 0,
        basicStudyChapters: 0,
      }
    },
    async handleSubmit() {
      console.log('this.basicForm', this.basicForm);
      const {
        studentName,
        phone,
        gender, // female,male
        birthday,
        age,

        packageIndex, // 选中的课程包index
        packageId,
        packageName,
        expiryMonths,
        expiryDate,
        courses,

        basicStudyDays,
        basicStudyChapters,
      } = this.basicForm
      const data = { basicStudyChapters, basicStudyDays, birthday, courses, expiryMonths, gender, packageId, phone, studentName, }
      const res = await this.$http.post('/mini/student/addStudent', { data })
      if (res.ok) {
        uni.redirectTo({ url: '/pages/audition/success/index' })
      } else {
        uni.showToast({ title: res.message, icon: 'none' })
      }

    }

  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding-top: 36rpx;
  background: #F5F7FA;
}

.page-content {
  height: 100vh;
  //height: calc(100vh - 100rpx -  constant(safe-area-inset-bottom));
  //height: calc(100vh - 100rpx - env(safe-area-inset-bottom));
  padding-bottom: 100rpx;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

</style>

<style lang="scss" scoped>
.title {
  width: 646rpx;
  margin: 36rpx auto 0 auto;
  font-size: 24rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #141F33;
  line-height: 36rpx;
}

.contract-item {
  box-sizing: border-box;
  width: 646rpx;
  margin: 12rpx auto 0 auto;
  padding-left: 52rpx;
  font-size: 20rpx;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: #141F33;
  line-height: 28rpx;

  .contract-item-label {
    min-width: 68rpx;
  }
}

.contract-item-sub-item {
  font-size: 20rpx;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: #141F33;
  line-height: 28rpx;

  &.bold {
    font-weight: 500;
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

  .tab-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //width: 33.33%;
    width: 100%;
    height: 100rpx;
  }
}
</style>
