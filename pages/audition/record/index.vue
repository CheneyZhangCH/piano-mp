<template>
  <view class="page">
    <view class="search-item flex justify-between align-center">
      <view class="mode" @click="toggleSearchMode">{{ mode === 'month' ? '按月份筛选' : '自定义时间' }}</view>
      <view class="selector text-right">
        <picker v-if="mode === 'month'" mode="date" fields="month" :value="month" :start="startDate" :end="endDate" @change="monthPicker">
          <view class="uni-input search-date">{{ month || '请选择月份' }}</view>
        </picker>

        <uni-datetime-picker
          v-if="mode === 'range'"
          :value="range"
          :border="false"
          :clear-icon="false"
          type="daterange"
          @change="rangePicker"
        >
          <view class="uni-input search-date">{{ Array.isArray(range) && range.length > 0 ? range.join(' - ') : '请选择日期范围' }}</view>
        </uni-datetime-picker>
      </view>
    </view>

    <template v-if="list.length > 0">
      <view v-for="(listItem, listIndex) in list" :key="listIndex" class="section">
        <view class="section-title flex align-center justify-between">
          <view class="section-sub-title" @click="goSearch">
            <text>{{ listItem.date }}</text>
            <image class="arrow_down" src="/static/images/arrow_down_dark.png"></image>
          </view>
          <view class="section-description">{{ `开通账号${ listItem.items.length }个` }}</view>
        </view>
        <view class="section-content">
          <view v-for="(item, itemIndex) in listItem.items" :key="itemIndex" class="section-content-item flex">
            <view class="avatar">
              <image v-if="item.student.gender === 'male'" class="avatar-image" src="/static/images/avatar_m.png"></image>
              <image v-if="item.student.gender === 'female'" class="avatar-image" src="/static/images/avatar_f.png"></image>
            </view>
            <view class="content flex-1">
              <view class="flex justify-between align-center flex-1 h-40">
                <view>
                  <text class="name">{{ item.student.studentName }}</text>
                  <image v-if="item.student.gender === 'male'" class="gender-icon" src="/static/images/male_selected.png"></image>
                  <image v-if="item.student.gender === 'female'" class="gender-icon" src="/static/images/female_selected.png"></image>
                  <text class="age">{{ `${ item.student.age }岁` }}</text>
                </view>
                <view>
                  <text class="date">{{ item.contract.createDate }}</text>
                </view>
              </view>
              <view class="flex justify-between align-center h-36 mt-12">
                <view>
                  <text class="period">{{ item.contract.packageName }}</text>
                </view>
                <view @click="toggleFolded(listIndex, itemIndex)">
                  <text class="more">更多信息</text>
                  <image v-if="item.folded" class="arrow_down" src="/static/images/arrow_down.png"></image>
                  <image v-if="!item.folded" class="arrow_down" src="/static/images/arrow_up.png"></image>
                </view>
              </view>

              <template v-if="!item.folded">
                <view v-for="course in item.contract.courses" class="flex justify-between align-center h-36 mt-12 course">
                  {{ `${ course.courseName }(${ course.teacherName }老师) ${ dayOfWeekOBj[course.dayOfWeek] } ${ course.timetablePeriodName }` }}
                </view>
              </template>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>
<script>

import dayjs from "dayjs";

export default {
  components: {},
  data() {
    return {
      list: [{ date: '', items: [] }],
      dayOfWeekOBj: { 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 7: '周日', },
      mode: 'month',
      month: '',
      range: [],
    }
  },
  onReady: function () {
  },
  onLoad() {
    const token = uni.getStorageSync('token')
    console.log('token', token)

    // 权限验证
    if (!token) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return uni.navigateTo({ url: '/pages/login/index' })
    }
    this.handleSearch()
  },
  methods: {
    toggleSearchMode() {
      this.mode = (this.mode === 'month' ? 'range' : 'month')
      this.month = ''
      this.range = []
    },
    monthPicker(e) {
      this.month = e.detail.value
      this.handleSearch()
    },
    rangePicker(e) {
      this.range = e
      this.handleSearch()
    },
    async handleSearch() {
      let params = {}
      if (this.mode === 'month' && this.month) {
        params = {
          maxMonth: this.month,
          minMonth: this.month,
        }
      }
      if (this.mode === 'range' && Array.isArray(this.range) && this.range.length > 0) {
        params = {
          minDate: this.range[0],
          maxDate: this.range[1],
        }
      }
      const listRes = await this.$http.post('/mini/studentContract/getAccountContracts', { data: params })
      console.log(listRes);
      if (listRes.ok) {
        const list = Array.isArray(listRes.data) ? listRes.data.map(item => {
          item.folded = true
          item.date = dayjs(item.contract.createTime).format('YYYY年MM月')
          item.contract.createDate = dayjs(item.contract.createTime).format('YYYY-MM-DD')

          const [birthYear, birthMonth, birthDay] = dayjs(item.student.birthday).format('YYYY-MM-DD').split('-')
          const [curYear, curMonth, curDay] = dayjs().format('YYYY-MM-DD').split('-')
          let age = curYear - birthYear
          if (curMonth > birthMonth) {
            age += 1
          } else if (curMonth === birthMonth && curDay >= birthDay) {
            age += 1
          }
          item.student.age = age

          return item
        }) : []
        const result = []
        list.forEach(l => {
          const item = result.find(r => r.date === l.date)
          if (item) {
            if (Array.isArray(item.items)) {
              item.items.push(l)
            } else {
              item.items = [l]
            }
          } else {
            result.push({
              date: l.date,
              items: [l]
            })
          }
        })
        console.log('list', list);
        console.log('result', result);
        this.list = result
      } else {
        uni.showToast({ title: res.message, icon: 'none' })
      }
    },
    toggleFolded(listIndex, itemIndex) {
      this.list[listIndex].items[itemIndex].folded = !this.list[listIndex].items[itemIndex].folded
    },
    goSearch() {


    },
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  background-color: #FFF;
  padding: 24rpx 30rpx 24rpx 36rpx;

  .mode {
    height: 44rpx;
    line-height: 44rpx;
    padding-left: 8rpx;
    padding-right: 8rpx;
    border-radius: 8rpx;
    border: 2rpx solid #62BBEC;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #62BBEC;
  }

  .search-date {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #62BBEC;
  }

  .selector {
    width: 500rpx;
    text-align: right;
  }
}

.section {
  width: 100vw;

  .section-title {
    height: 88rpx;
    background: #F5F7FA;
    padding-left: 32rpx;
    padding-right: 30rpx;

    .section-sub-title {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #141F33;
      margin-right: 4rpx;
    }

    .section-description {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #99A0AD;
    }
  }

  .section-content {
    background-color: #FFF;

    .section-content-item {
      padding: 24rpx 30rpx 24rpx 36rpx;
      border-bottom: 2rpx solid #F5F7FA;
    }

    .avatar {
      margin-right: 24rpx;

      .avatar-image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }
    }

    .content {
      padding-top: 6rpx;
    }

    .name {
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #141F33;
    }

    .gender-icon {
      width: 24rpx;
      height: 24rpx;
      margin-left: 16rpx;
    }

    .age {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #525666;
      margin-left: 8rpx;
    }

    .date {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #141F33;
    }

    .period {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #525666;
    }

    .more {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #99A0AD;
    }

    .course {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #99A0AD;
    }

  }
}

.arrow_down {
  height: 20rpx;
  width: 20rpx;
}

</style>
