<template>
  <view class="page" :style="pageStyle">
    <view class="custom-header">
      <view class="title" :style="customTitleStyle">
        <uni-icons
          v-if="studentId"
          type="left"
          color="#FFF"
          size="16"
          @click="back"
          style="float: left; padding: 0 30rpx"
        />
        学员中心
      </view>
    </view>
    <scroll-view scroll-y="true" class="page-content">
      <view class="user">
        <image :src="student.coverUrl || defaultCover" class="cover" />
        <view class="info">
          <view class="name">
            <text class="student">{{ student.studentName }}</text>
            <text class="package">{{ coursePackage.packageName }}</text>
          </view>
          <view class="msg flex justify-between align-center">
            <view class="gender-age">
              <image
                class="gender"
                :src="`/static/images/student/${student.gender || 'male'}.png`"
              ></image>
              <text v-if="student.age" class="age">{{ student.age }}岁</text>
            </view>
            <view class="expiry" :class="{ guoqu: expiryDateStr === '您的账户已过期' }">
              {{ expiryDateStr }}
            </view>
          </view>
        </view>
      </view>
      <view v-for="item in courses" :key="item.id" class="block course">
        <view class="block-title">
          <view>
            <text class="name">{{ item.courseName }}</text>
            <text class="times">共{{ item.courseNum }}节</text>
          </view>
          <view class="btn" @click="toFinishLesson(item)"> 消课记录 </view>
        </view>
        <view class="content">
          <view class="info">
            <text class="name">剩余课时</text>
            <text class="num">{{ item.remainCourseNum }}</text>
            <text class="unit">（节）</text>
          </view>
          <view class="info">
            <text class="name">上课时间</text>
            <text class="time days">周{{ WEEK_DAY[item.dayOfWeek] }}</text>
            <text class="time">{{ item.timetablePeriodName }}</text>
          </view>
          <view class="info">
            <text class="name">任课老师</text>
            <image class="cover" :src="item.teacherCoverUrl" />
            <text class="teacher">{{ item.teacherName }}</text>
          </view>
        </view>
      </view>
      <view class="block tools-block">
        <view class="block-title">
          <text class="name">我的工具</text>
        </view>
        <view class="tools">
          <view class="tool" @click="toComplaint">
            <image src="/static/images/student/nimingtousu.png" />
            <text>匿名投诉</text>
          </view>
          <view class="tool" @click="toTrainTickets">
            <image src="/static/images/student/peilianquan.png" />
            <text>课程陪练券</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <customTabbar v-if="!studentId" :active="2" />
  </view>
</template>

<script lang="js">
import dayjs from "dayjs"
import { weekOrDateTime } from '@/utils/format'

const WEEK_DAY = ['', '一', '二', '三', '四', '五', '六', '日']
export default {
	data() {
		return {
			defaultCover: 'https://static.gangqintonghua.com/img/touxiang/pic1.webp',
			detail: null,

			datacenterFlag: true,


			headerHeight: 0,
			headerTop: 0,

			accountType: '',
			userId: 0,
			studentId: 0,

			WEEK_DAY
		}
	},
	computed: {
		pageStyle() {
			return `padding-top: ${(this.headerHeight + this.headerTop + 20) * 2}rpx; padding-bottom: ${this.datacenterFlag ? '100rpx' : 0};`
		},
		customTitleStyle() {
			return `top: ${this.headerTop * 2}rpx; height: ${this.headerHeight * 2}rpx; line-height: ${this.headerHeight * 2}rpx`
		},

		coursePackage() {
			return this.detail?.coursePackage ?? {}
		},
		courses() {
			return this.coursePackage?.courses ?? []
		},
		student() {
			return this.detail?.student ?? {}
		},
		trainTicketNum() {
			return this.detail?.trainTicketNum ?? 0
		},

		expiryDateStr() {
			const expiryDate = this.student?.expiryDate
			return dayjs().isAfter(dayjs(expiryDate)) ? '您的账户已过期' : '有效期至 ' + dayjs(expiryDate).format('YYYY年MM月DD日')
		}
	},
	onLoad(option) {
		const token = uni.getStorageSync('token')
		const accountType = uni.getStorageSync('accountType')
		const userId = uni.getStorageSync('userId')

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
		this.accountType = accountType
		this.userId = userId

		let rect = wx.getMenuButtonBoundingClientRect();

		this.headerHeight = rect.height
		this.headerTop = rect.top

		if (option?.studentId) {
			this.studentId = option.studentId
		}

		this.init()
	},
	methods: {
		weekOrDateTime,
		async init() {
			const res = await this.$http.get(`/mini/student/getStudentDetail?studentId=${this.studentId || this.userId}`)
			this.detail = res.data ?? {}
		},

		toFinishLesson({ courseType, courseId, teacherId }) {
			uni.navigateTo({ url: '/pages/teacher/xiaokeOrhexiaoRecord/index?courseType=' + courseType + '&courseId=' + courseId + '&teacherId=' + teacherId })
		},

		toComplaint() {
			uni.navigateTo({ url: '/pages/student/complaint/index' })
		},

		toTrainTickets() {
			uni.navigateTo({ url: '/pages/student/trainTicket/index' })
		},

		back() {
			uni.navigateBack({ delta: 1 })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;

  .custom-header {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 500rpx;
    background-image: url("https://static.gangqintonghua.com/img/beijing/bg1.png");
    background-size: 100%;
    background-repeat: no-repeat;
    &.group {
      background-image: url("https://static.gangqintonghua.com/img/beijing/bg2.png");
    }
    .title {
      position: absolute;
      width: 100%;
      z-index: 1;
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #fff;
    }
  }
  &-content {
    position: relative;
    z-index: 1;
    height: 100%;
    .block {
      margin: 0 30rpx;
      background: #ffffff;
      border-radius: 10px;
      padding: 24rpx 24rpx 0 36rpx;
      + .block {
        margin-top: 30rpx;
      }
      .block-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30rpx;
        .name {
          font-size: 28rpx;
          color: #141f33;
          margin-right: 12rpx;
        }
        .times {
          font-size: 20rpx;
          color: #99a0ad;
          align-self: flex-end;
        }
        .btn {
          font-size: 24rpx;
          color: #99a0ad;
        }
      }
    }
    .user {
      display: flex;
      position: relative;
      padding-left: 30rpx;
      margin-bottom: 30rpx;
      .cover {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }
      .info {
        flex: 1;
        overflow: hidden;
        .name {
          margin: 14rpx 0 20rpx;
          .student {
            font-size: 32rpx;
            font-weight: 500;
            color: #fff;
            line-height: 44rpx;
            margin-right: 16rpx;
          }
          .package {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 20rpx;

            padding: 6rpx 18rpx;
            font-size: 20rpx;
            color: #eff5ff;
            line-height: 28rpx;
          }
        }
        .msg {
          .gender-age {
            display: inline-flex;
            align-items: center;
          }
          .gender {
            width: 28rpx;
            height: 26rpx;
            margin-right: 12rpx;
          }
          .age {
            font-size: 28rpx;
            color: #ffffff;
            line-height: 40rpx;
          }
          .expiry {
            font-size: 24rpx;
            color: #fff;
            padding-right: 32rpx;
            &.guoqi {
              font-size: 24rpx;
            }
          }
        }
      }
    }
    .course {
      padding-bottom: 28rpx;
      .content {
        display: flex;
        justify-content: space-around;
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          .name {
            font-size: 24rpx;
            color: #99a0ad;
            line-height: 34rpx;
          }
          .num {
            font-size: 48rpx;
            font-weight: 500;
            color: #141f33;
            line-height: 66rpx;
            margin-top: 12rpx;
          }
          .unit,
          .time,
          .teacher {
            font-size: 24rpx;
            color: #141f33;
            line-height: 34rpx;
          }
          .days {
            margin: 28rpx 0 14rpx 0;
          }
          .cover {
            width: 44rpx;
            height: 44rpx;
            border-radius: 50%;
            margin: 24rpx 0 8rpx 0;
          }
        }
      }
    }
    .tools-block {
      margin-bottom: 30rpx;
      .tools {
        padding-bottom: 30rpx;
        display: flex;
        column-gap: 100rpx;
        .tool {
          display: flex;
          flex-direction: column;
          align-items: center;
          image {
            width: 40rpx;
            height: 40rpx;
            margin-bottom: 6rpx;
          }
          text {
            font-size: 24rpx;
            color: #616b80;
          }
        }
      }
    }
  }
}
</style>
