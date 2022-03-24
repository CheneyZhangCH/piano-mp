<template>
    <view class="page" :style="pageStyle">
        <view class="custom-header">
            <view class="title" :style="customTitleStyle">
                <uni-icons
                    type="left"
                    color="#FFF"
                    size="16"
                    @click="back"
                    style="float: left; padding: 0 30rpx"
                />班级详情
            </view>
        </view>
        <scroll-view scroll-y="true" class="page-content">
            <view class="banji">
                <view class="msg ellipsis">
                    <text>周{{ WEEK_DAY[detail.dayOfWeek] }}</text>
                    <text>{{ detail.periodName }}</text>
                    <text>{{ detail.courseName }}({{ detail.teacherName }})</text>
                </view>
                <view class="infos">
                    <view class="info">
                        <view class="edit-wrap">
                            <text>开班日期</text>
                            <view class="edit">
                                修改
                                <image src="/static/images/account/edit.png" />
                            </view>
                        </view>
                        <text class="value">{{ startClassDate }}</text>
                    </view>
                    <view class="info">
                        <text>班级人数</text>
                        <text class="value">{{ detail.studentNum }}</text>
                    </view>
                    <view class="info">
                        <text>当前进度</text>
                        <text class="value">
                            <text v-if="chapter.bookName">({{ chapter.bookName }})</text>
                            <text v-if="chapter.chapterName">{{ chapter.chapterName }}</text>
                        </text>
                    </view>
                </view>
            </view>
            <view class="students">
                <view v-for="item in detail.students" :key="item.student.studentId" class="student">
                    <image
                        class="cover"
                        :src="item.student.coverUrl || defaultCover"
                        @click="studentId = item.student.studentId"
                    />
                    <view class="info">
                        <view class="msg">
                            <text class="studentName">{{ item.student.studentName }}</text>
                            <image
                                class="gender"
                                :src="`/static/images/${item.student.gender || 'male'}_selected.png`"
                            />
                            <text v-if="item.student.age" class="age">{{ item.student.age + '岁' }}</text>
                            <text class="packageName">{{ item.coursePackage.packageName }}</text>
                            <text class="trainTicketNum">{{ '课程陪练券' + item.trainTicketNum + '张' }}</text>
                        </view>
                        <view class="main">
                            <view
                                v-for="course in item.coursePackage.courses"
                                :key="course.id"
                                class="course"
                                :class="{ 'warning': course.remainCourseNum <= 6 }"
                            >
                                <text>{{ course.courseName }}({{ course.teacherName }})</text>
                                <text>周{{ WEEK_DAY[course.dayOfWeek] }}</text>
                                <text>{{ course.timetablePeriodName }}</text>
                                <text>剩余{{ course.remainCourseNum }}节</text>
                            </view>
                            <view
                                class="course expiryDate"
                                :class="{ 'warning': getExpiryDateWarning(item.student.expiryDate) }"
                            >账号有效期剩余：{{ getExpiryDate(item.student.expiryDate) }}</view>
                        </view>
                        <view class="operation">
                            <view class="left">
                                <view
                                    class="remark"
                                    :class="{ 'exist': item.student.remark }"
                                    @click="openRemark(item.student)"
                                >
                                    <template v-if="item.student.remark">
                                        <text>{{ item.student.remark }}</text>
                                        <uni-icons type="closeempty" size="12"></uni-icons>
                                    </template>
                                    <template v-else>
                                        <text>点击添加备注信息(15字内)</text>
                                        <image src="/static/images/audition/edit.png" />
                                    </template>
                                </view>
                            </view>
                            <button class="btn" @click="toStudent(item.student)">查看详情</button>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <Student :student-id="studentId" @close="studentId = 0" />
        <Remark ref="remark" :detail="studentDetail" @confirm="init" />
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
            defaultCover: 'https://static.gangqintonghua.com/img/touxiang/pic1.webp',

            headerHeight: 0,
            headerTop: 0,
            WEEK_DAY,
            detail: {},

            studentId: 0,
            studentDetail: {},

            query: {}
        }
    },
    computed: {
        pageStyle() {
            return `padding-top: ${(this.headerHeight + this.headerTop + 20) * 2}rpx; padding-bottom: ${this.datacenterFlag ? '100rpx' : 0};`
        },
        customTitleStyle() {
            return `top: ${this.headerTop * 2}rpx; height: ${this.headerHeight * 2}rpx; line-height: ${this.headerHeight * 2}rpx`
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
        this.init()
    },
    methods: {
        getExpiryDate,
        getExpiryDateWarning,
        async init() {
            const data = {
                data: this.query
            }
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            try {
                const res = await this.$http.post('/mini/courseTimetable/getTimetablePeriodClass', data)
                this.detail = res.data ?? {}
            } finally {
                uni.hideLoading();
            }
        },

        openRemark(student) {
            this.studentDetail = student
            this.$refs.remark.open()
        },

        toStudent({ studentId }) {
            uni.navigateTo({ url: '/pages/student/center/index?studentId=' + studentId })
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
        .banji {
            margin: 0 24rpx;
            height: 340rpx;
            background-image: url("https://static.gangqintonghua.com/img/beijing/banji.png");
            background-repeat: no-repeat;
            background-size: 100%;

            padding: 44rpx 40rpx 0;
            .msg {
                font-size: 32rpx;
                font-weight: 600;
                color: #141f33;
                line-height: 44rpx;
                margin-bottom: 50rpx;
            }
            .infos {
                .info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    + .info {
                        margin-top: 20rpx;
                    }
                    .edit-wrap {
                        display: flex;
                        align-items: baseline;
                        .edit {
                            color: #62bbec;
                            margin-left: 16rpx;
                            image {
                                width: 28rpx;
                                height: 20rpx;
                                margin-left: 4rpx;
                            }
                        }
                    }
                    text {
                        font-size: 28rpx;
                        color: #99a0ad;
                        line-height: 40rpx;
                    }
                    .value {
                        color: #141f33;
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
            + .student {
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
                        font-weight: 500;
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
                        + .course {
                            margin-top: 16rpx;
                        }
                        text + text {
                            margin-left: 10rpx;
                        }
                        &.warning {
                            font-weight: 500;
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
                        .remark {
                            font-size: 24rpx;
                            color: #99a0ad;
                            &.exist {
                                display: inline-block;
                                height: 34rpx;
                                line-height: 34rpx;
                                background: #e2f3ff;
                                border-radius: 4rpx;
                                opacity: 0.58;
                                padding-left: 10rpx;
                                padding-right: 14rpx;
                                color: #367aa0;
                                text {
                                    margin-right: 14rpx;
                                }
                            }
                            image {
                                width: 20rpx;
                                height: 20rpx;
                                margin-left: 8rpx;
                            }
                        }
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
