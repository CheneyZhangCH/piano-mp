<template>
    <view class="page" :class="{ 'data-center': datacenterFlag }" :style="pageStyle">
        <!-- padding-bottom: ${this.datacenterFlag ? '100rpx' : 0}; -->
        <view class="custom-header">
            <view class="title" :style="customTitleStyle">
                <uni-icons v-if="studentId" type="left" color="#FFF" size="20" @click="back"
                    style="position: absolute; left: 0; padding: 0 30rpx" />
                学员中心
            </view>
        </view>
        <scroll-view scroll-y="true" class="page-content">
            <view class="user">
                <image :src="getStudentCoverUrl(student)" class="cover" />
                <view class="info">
                    <view class="name">
                        <text class="student">{{ student.studentName }}</text>
                        <text v-if="coursePackage.packageName" class="package">{{ coursePackage.packageName }}</text>
                    </view>
                    <view class="msg flex justify-between align-center">
                        <view class="gender-age">
                            <image class="gender" :src="`/static/images/student/${student.gender || 'male'}.png`">
                            </image>
                            <text v-if="student.age" class="age">{{ student.age }}岁</text>
                        </view>
                        <view class="expiry" :class="{ 'warning': getExpiryDateWarning(student.expiryDate) }">
                            {{ expiryDateStr }}
                        </view>
                    </view>
                </view>
            </view>
            <template v-if="courses.length">
                <view v-for="item in courses" :key="item.id" class="block course">
                    <view class="block-title">
                        <view>
                            <text class="name">{{ item.courseName }}</text>
                            <text class="times">共{{ item.originCourseNum }}节</text>
                        </view>
                        <view class="btn" @click="toFinishLesson(item)"> 消课记录 </view>
                    </view>
                    <view class="content">
                        <view class="info">
                            <text class="name">剩余课时</text>
                            <text class="num" :class="{ warning: item.remainCourseNum <= 6 }">{{
                                    item.remainCourseNum
                            }}</text>
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
            </template>
            <view class="block tools-block">
                <view class="block-title">
                    <text class="name">我的工具</text>
                </view>
                <view class="tools">
                    <view class="tool" @click="toComplaint">
                        <image src="/static/images/student/nimingtousu.png"
                            style="width: 36rpx; height: 40rpx; margin-bottom: 8rpx;" />
                        <text>匿名投诉</text>
                    </view>
                    <view class="tool" @click="toTrainTickets">
                        <view class="box">
                            <image src="/static/images/student/peilianquan.png"
                                style="width: 44rpx; height: 26rpx; margin-bottom: 16rpx;" />
                            <text v-if="detail.trainTicketNum" class="num">{{ detail.trainTicketNum }}张</text>
                        </view>
                        <text>课程陪练券</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="slogan">
            <image src="https://static.gangqintonghua.com/img/kong/slogan.png"></image>
        </view>

        <MessageNotify ref="notify" />
        <customTabbar v-if="!studentId" :active="2" />
    </view>
</template>

<script lang="js">
import MessageNotify from '../Components/MessageNotify'
import dayjs from "dayjs"
import { WEEK_DAY, getExpiryDateWarning } from '@/utils/format'
export default {
    components: {
        MessageNotify
    },
    data() {
        return {
            detail: null,

            datacenterFlag: true,


            headerHeight: 0,
            headerTop: 0,

            accountType: '',
            userId: 0,
            studentId: 0,

            WEEK_DAY,
            showed: false
        }
    },
    computed: {
        pageStyle() {
            return `padding-top: ${(this.headerHeight + this.headerTop + 20) * 2}rpx; `
        },
        customTitleStyle() {
            return `top: ${this.headerTop}px; height: ${this.headerHeight}px; line-height: ${this.headerHeight}px`
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
            const expiryDate = this.student.expiryDate
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
    onShow() {
        if (this.showed) this.init()
        this.showed = true
        this.$refs.notify.getMsgCount()
    },
    methods: {
        getExpiryDateWarning,
        async init() {
            const res = await this.$http.get(`/mini/student/getStudentDetail?studentId=${this.studentId || this.userId}`)//171
            this.detail = res.data ?? {}
        },

        toFinishLesson({ courseType, courseId }) {
            uni.navigateTo({ url: '/pages/teacher/xiaokeOrhexiaoRecord/index?courseType=' + courseType + '&courseId=' + courseId + '&studentId=' + (this.studentId || this.userId) })
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
    &.data-center {
        padding-bottom: 100rpx;
        padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
        padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
    }

    .custom-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 500rpx;
        background-image: url("https://static.gangqintonghua.com/img/beijing/xueyuanzhongxin.png");
        background-size: 100% 130%;
        background-repeat: no-repeat;

        .title {
            position: absolute;
            width: 100%;
            z-index: 1;
            text-align: center;
            font-size: 32rpx;
            font-weight: 600;
            color: #fff;
        }
    }

    &-content {
        position: relative;
        z-index: 1;
        // height: 100%;
        height: calc(100% - 138rpx);

        .block {
            margin: 0 30rpx;
            background: #ffffff;
            border-radius: 10px;
            padding: 24rpx 24rpx 0 36rpx;

            +.block {
                margin-top: 30rpx;
            }

            .block-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 36rpx;

                .name {
                    font-size: 28rpx;
                    font-weight: 600;
                    color: #525666;
                    margin-right: 12rpx;
                    line-height: 40rpx;
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
                    display: flex;
                    align-items: center;
                    margin: 14rpx 0 20rpx;

                    .student {
                        font-size: 32rpx;
                        font-weight: 600;
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

                        &.warning {
                            color: #f15e5e;
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

                        &.warning {
                            color: #f15e5e;
                        }
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

                .tool {
                    width: calc(100% / 3);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;

                    text {
                        font-size: 24rpx;
                        color: #616b80;
                    }

                    .box {
                        position: relative;
                    }

                    .num {
                        position: absolute;
                        top: -10rpx;
                        left: 26rpx;

                        height: 22rpx;
                        line-height: 22rpx;
                        background: #f15e5e;
                        border-radius: 6rpx;

                        font-size: 16rpx;
                        font-weight: 600;
                        color: #fff;
                        padding: 0 4rpx;
                        white-space: nowrap;
                    }
                }
            }
        }
    }

    .slogan {
        margin: 40rpx 0;
        text-align: center;

        image {
            width: 540rpx;
            height: 54rpx;
        }
    }
}
</style>
