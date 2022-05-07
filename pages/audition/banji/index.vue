<template>
    <view class="page" :style="pageStyle">
        <view class="custom-header" :style="customHeaderStyle">
            <view class="title" :style="customTitleStyle">
                <uni-icons type="left" color="#FFF" size="22" style="position: absolute; left: 0; padding: 0 30rpx"
                    @click="back" />班级详情
            </view>
        </view>
        <scroll-view scroll-y="true" class="page-content">
            <view v-if="detail.timetablePeriodId" class="panel" :style="panelStyle">
                <view class="banji">
                    <view class="msg ellipsis">
                        <text>周{{ WEEK_DAY[detail.dayOfWeek] }}</text>
                        <text>{{ detail.periodName }}</text>
                        <text>{{ detail.courseName }}({{ detail.teacherName }})</text>
                    </view>
                    <view class="infos">
                        <view class="info">
                            <text class="label">开班日期</text>
                            <text class="value">{{ startClassDate }}</text>
                        </view>
                        <view class="info">
                            <text class="label">班级人数</text>
                            <text class="value">{{ detail.students.length === detail.studentNum ? '满班' :
                                    `${detail.students.length}人`
                            }}</text>
                        </view>
                        <view class="info">
                            <text class="label">当前进度</text>
                            <text class="value ellipsis">
                                <text v-if="chapter.bookName">({{ chapter.bookName }})</text>
                                <text v-if="chapter.chapterName">{{ chapter.chapterName }}</text>
                            </text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="students">
                <view v-for="item in detail.students" :key="item.student.studentId" class="student">
                    <image class="cover" :src="getStudentCoverUrl(item.student)" />
                    <view class="info">
                        <view class="msg">
                            <text class="studentName">{{ item.student.studentName }}</text>
                            <image class="gender"
                                :src="`/static/images/student/${item.student.gender || 'male'}-selected.png`" />
                            <text class="age">{{ item.student.age + '岁' }}</text>
                            <text class="packageName">{{ item.coursePackage.packageName }}</text>
                            <text class="trainTicketNum">{{ '课程陪练券' + item.trainTicketNum + '张' }}</text>
                        </view>
                        <view class="main">
                            <view v-for="course in item.coursePackage.courses" :key="course.id" class="course"
                                :class="{ 'warning': course.remainCourseNum <= 6 }">
                                <text>{{ course.courseName }}({{ course.teacherName }})</text>
                                <text>周{{ WEEK_DAY[course.dayOfWeek] }}</text>
                                <text>{{ course.timetablePeriodName }}</text>
                                <text>剩余{{ course.remainCourseNum }}节</text>
                            </view>
                            <view class="course expiryDate"
                                :class="{ 'warning': getExpiryDateWarning(item.student.expiryDate) }">账号有效期剩余：{{
                                        getExpiryDate(item.student.expiryDate)
                                }}</view>
                        </view>
                        <view class="operation">
                            <view class="left">
                                <Remark :student="item.student" @confirm="init" />
                            </view>
                            <button class="btn" @click="studentId = item.student.studentId">查看详情</button>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <Student ref="student" :student-id="studentId" is-banji @close="studentId = 0" @refresh="init" />
    </view>
</template>

<script lang="js">
import Student from "@/components/Student";
import Remark from "@/components/Remark";
import dayjs from 'dayjs'
import { WEEK_DAY, getExpiryDate, getExpiryDateWarning } from '@/utils/format'
export default {
    components: {
        Student,
        Remark
    },
    data() {
        return {
            headerHeight: 0,
            headerTop: 0,
            WEEK_DAY,
            detail: {},

            studentId: 0,

            query: {}
        }
    },
    computed: {
        customHeaderHeight() {
            return (this.headerHeight + this.headerTop + 20) * 2
        },
        pageStyle() {
            return `padding-top: ${this.customHeaderHeight}rpx; padding-bottom: ${this.datacenterFlag ? '100rpx' : 0};`
        },
        customHeaderStyle() {
            return `height: ${this.customHeaderHeight}rpx;`
        },
        customTitleStyle() {
            return `top: ${this.headerTop * 2}rpx; height: ${this.headerHeight * 2}rpx; line-height: ${this.headerHeight * 2}rpx`
        },
        panelStyle() {
            return `background-position-y: -${this.customHeaderHeight}rpx;`
        },

        startClassDate() {
            return this.detail?.startClassDate ? dayjs(this.detail.startClassDate).format('YYYY年MM月DD日') : '-'
        },
        chapter() {
            return this.detail?.chapter ?? {}
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')

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

        let rect = wx.getMenuButtonBoundingClientRect();

        this.headerHeight = rect.height
        this.headerTop = rect.top

        this.query = option
    },
    onShow() {
        this.init()

        const successBack = uni.getStorageSync('successBack')
        if (successBack) {
            if (['disContinue_immediately', 'continue_immediately', 'refund'].includes(successBack)) {
                this.$refs.student.close()
            } else if (['disContinue', 'continue', 'update'].includes(successBack)) {
                if (this.studentId) this.$refs.student.getStudent()
            }
            uni.removeStorageSync('successBack')
        }
    },
    methods: {
        getExpiryDate,
        getExpiryDateWarning,
        async init(loading = true) {
            if (loading) uni.showLoading({ title: '加载中', mask: true })
            const data = {
                data: this.query
            }
            try {
                const res = await this.$http.post('/mini/courseTimetable/getTimetablePeriodClass', data)
                this.detail = res.data ?? {}
            } finally {
                if (loading) uni.hideLoading();
            }
        },

        // async startClassDateChange(e) {
        //     const data = {
        //         data: {
        //             ...this.query,
        //             startClassDate: e
        //         }
        //     }
        //     try {
        //         await this.$http.post('/mini/courseTimetable/updateTimetablePeriodClassDate', data)
        //         this.$toast({ title: '修改成功！', icon: 'success' })
        //         this.init(false)
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },

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
        background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);

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
        height: 100%;
        .panel {
            background-image: url("https://static.gangqintonghua.com/img/beijing/zhongxin.png?imageView2/0/w/375");
            background-size: 100%;
            background-repeat: no-repeat;
        }
        .banji {
            margin: 0 24rpx;
            height: 340rpx;
            background-image: url("https://static.gangqintonghua.com/img/beijing/banji-new.png");
            background-repeat: no-repeat;
            background-size: 100%;

            padding: 44rpx 40rpx 0;

            .msg {
                font-size: 32rpx;
                font-weight: 600;
                color: #141f33;
                line-height: 44rpx;
                margin-bottom: 50rpx;
                text-align: center;
            }

            .infos {
                .info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    +.info {
                        margin-top: 20rpx;
                    }

                    text {
                        font-size: 28rpx;
                        color: #141f33;
                        line-height: 40rpx;
                    }

                    .label {
                        color: #99a0ad;
                    }

                    .value {
                        flex: 1;
                        text-align: right;
                        padding-left: 20rpx;
                    }
                }
            }
        }

        .students {
            padding: 38rpx 22rpx;
        }

        .student {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            border-radius: 16rpx;
            padding: 16rpx 16rpx 24rpx 16rpx;

            +.student {
                margin-top: 50rpx;
            }

            .cover {
                width: 90rpx;
                height: 90rpx;
                border-radius: 50%;
                margin-right: 8rpx;
            }

            .info {
                flex: 1;
                overflow: hidden;

                .msg {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16rpx;

                    .studentName {
                        font-size: 28rpx;
                        font-weight: 600;
                        color: #141f33;
                        line-height: 40rpx;
                        margin-right: 16rpx;
                    }

                    .gender {
                        width: 24rpx;
                        height: 24rpx;
                        margin-right: 8rpx;
                    }

                    .age,
                    .packageName,
                    .trainTicketNum {
                        font-size: 12px;
                        color: #525666;
                    }

                    .age {
                        margin-right: 12rpx;
                    }

                    .packageName {
                        margin-right: 40rpx;
                    }
                }

                .main {
                    border-bottom: 2rpx solid #f5f7fa;
                    padding-bottom: 14rpx;

                    .course {
                        font-size: 12px;
                        color: #141f33;
                        line-height: 34rpx;

                        +.course {
                            margin-top: 16rpx;
                        }

                        text+text {
                            margin-left: 10rpx;
                        }

                        &.warning {
                            font-weight: 600;
                            color: #f15e5e;
                        }
                    }
                }

                .operation {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 14rpx;

                    .left {
                        flex: 1;
                    }

                    .btn {
                        border-radius: 26rpx;
                        border: 2rpx solid #62bbec;
                        background: #fff;

                        padding: 8rpx 24rpx;
                        font-size: 24rpx;
                        color: #62bbec;
                        line-height: 34rpx;
                        margin-left: 20rpx;

                        &::after {
                            display: none;
                        }
                    }
                }
            }
        }
    }
}
</style>
