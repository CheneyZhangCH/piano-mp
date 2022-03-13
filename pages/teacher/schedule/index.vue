<template>
    <view class="page">
        <view class="page-title">
            <text
                v-for="day in dayOfWeekArr"
                :key="day.value"
                class="day-of-week"
                :class="{ active: dayOfWeek === day.value }"
                @click="handleToggleDayOfWeek(day)"
            >
                {{ day.label }}
            </text>
        </view>
        <view class="page-content">
            <template v-if="periods.length">
                <template v-for="period in periods">
                    <view
                        v-if="['work','rest'].includes(period.periodType)"
                        :key="period.timetablePeriodId"
                        class="period-item"
                    >
                        <template v-if="period.periodType === 'work'">
                            <view v-if="period.oneCourse" class="period-main">
                                <image
                                    class="avatar"
                                    :src="period.oneCourse.student.coverUrl || '/static/images/course_type_more.png'"
                                    @click="openStudent(period)"
                                />
                                <view
                                    v-if="
                                        [
                                            'finish_course_discontinue',
                                            'finish_course_continue',
                                        ].includes(period.oneCourse.student.status)
                                    "
                                    class="period-status"
                                    :class="period.oneCourse.student.status"
                                    >即将清退
                                </view>
                                <view class="period-name">{{
                                    period.periodName
                                }}</view>
                                <view class="period-content">
                                    <view class="period-content-title">
                                        <text class="student-name">{{
                                            period.oneCourse.student.studentName
                                        }}</text>
                                        <image
                                            class="gender-icon"
                                            :src="`/static/images/${period.oneCourse.student.gender || 'male'}_selected.png`"
                                        ></image>
                                        <text class="student-age">{{
                                            period.oneCourse.student.age + '岁'
                                        }}</text>
                                    </view>
                                    <view
                                        v-if="
                                            Array.isArray(
                                                period.oneCourse.coursePackage
                                                    .courses
                                            )
                                        "
                                        class="course"
                                    >
                                        <view
                                            v-for="course in period.oneCourse
                                                .coursePackage.courses"
                                            :key="course.courseId"
                                            :class="{
                                                warning: course.remainCourseNum < 6,
                                            }"
                                            class="course-item ellipsis"
                                        >
                                            {{ course.courseName }}
                                        </view>
                                    </view>
                                </view>
                                <view class="finish-lesson" @click="handleFinishLesson(period)">消课</view>
                            </view>
                             <view v-if="period.moreCourse" class="period-main">
                                <image
                                    class="avatar"
                                    src="/static/images/course_type_more.png"
                                    @click="openCourse(period)"
                                />
                                <view class="period-name">{{
                                    period.periodName
                                }}</view>
                                <view class="period-content">
                                    <view class="period-content-title">
                                        <text class="student-name">{{
                                            period.moreCourse.course.courseName +
                                            (period.remainStudentNum === 0
                                                ? '(满班)'
                                                : '')
                                        }}</text>
                                    </view>
                                    <view
                                        v-if="
                                            Array.isArray(
                                                period.moreCourse.students
                                            )
                                        "
                                        class="student ellipsis"
                                    >
                                        <text
                                            v-for="student in period.moreCourse.students"
                                            :key="student.studentId"
                                            :class="{ warning: student.warning }"
                                            class="student-item "
                                        >
                                            {{ student.studentName }}
                                        </text>
                                    </view>
                                    <view
                                        v-if="
                                            Array.isArray(period.moreCourse.chapter)
                                        "
                                        class="chapter"
                                    >
                                        <text
                                            v-for="chapter in period.moreCourse
                                                .chapter"
                                            :key="chapter.chapterId"
                                            class="chapter-item ellipsis"
                                        >
                                            {{ chapter.chapterName }}
                                        </text>
                                    </view>
                                </view>
                                <view class="finish-lesson" @click="handleFinishLesson(period)">消课</view>
                            </view>
                        </template>

                        <view class="period-rest" v-if="period.periodType === 'rest'">
                            <view class="period-rest-divider"></view>
                            <view class="period-rest-name">
                                {{ period.periodName}} 休息
                            </view>
                            <view class="period-rest-divider"></view>
                        </view>
                    </view>
                </template>
            </template>
        </view>

        <customTabbar :active="0" />

        <!-- 学生详情 -->
        <Student ref="studentDialog" :detail="studentDetail" />

        <!-- 一对多详情（课程） -->
        <Course ref="course" />

        <!-- 消课 - 一对一 -->
        <FinishLessonOne ref="finishLessonOne" />
        <!-- 消课 - 一对多 -->
        <FinishLessonMore ref="finishLessonMore" :detail="finishLessonDetail" />
    </view>
</template>

<script>
import Student from './components/Student'
import Course from './components/Course'
import FinishLessonOne from './components/FinishLessonOne'
import FinishLessonMore from './components/FinishLessonMore'

import dayjs from 'dayjs'

export default {
    components: {
        Student,
        Course,
        FinishLessonOne,
        FinishLessonMore
    },
    data() {
        return {
            dayOfWeek: 2,
            dayOfWeekArr: [
                { label: '周二', value: 2 },
                { label: '周三', value: 3 },
                { label: '周四', value: 4 },
                { label: '周五', value: 5 },
                { label: '周六', value: 6 },
                { label: '周日', value: 7 },
            ],
            periods: [],

            studentDialogVisible: false, // 学生详情弹窗
            studentDetail: {}, // 当前学生

            finishLessonDetail: {} // 消课详情
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }

        this.dayOfWeek = 2
        this.handleSearch()
    },
    methods: {
        handleToggleDayOfWeek(day) {
            this.dayOfWeek = day.value
            this.handleSearch()
        },

        async handleSearch() {
            const userId = 16// uni.getStorageSync('userId')
            const res = await this.$http.post(
                `/mini/courseTimetable/getTeacherDayTimetable`,
                { data: { teacherId: userId, dayOfWeek: this.dayOfWeek } }
            )
            const { periods } = res.data ?? {}

            if (periods?.length) {
                periods.forEach((period) => {
                    if (period.periodType === 'work' && period.oneCourse) {
                        const { expiryDate } = period.oneCourse.student || {}
                        period.oneCourse.student.expiryDateStr =
                            this.getExpiryDateStr(expiryDate)
                        period.oneCourse.student.expiryDateWarning =
                            dayjs() - expiryDate < 30 * 24 * 60 * 60 * 1000
                    }
                    if (period.periodType === 'work' && period.moreCourse) {
                        const { startClassDate } = period.moreCourse || {}
                        period.moreCourse.startClassDateStr = startClassDate
                            ? dayjs(startClassDate).format('YYYY-MM-DD')
                            : ''
                    }
                })
            }
            this.periods = periods || []
        },

        // 学生详情弹窗
        async openStudent(period) {
            const studentId = period.oneCourse.student.accountId
            const res = await this.$http.get(
                `/mini/student/getStudentDetail?studentId=${studentId}`
            )

            this.studentDetail = res.data
            this.$refs.studentDialog.$refs.popup.open()
        },

        // 一对多详情
        openCourse(period){
            console.log(period)
        },

        getExpiryDateStr(expiryDate) {
            const [expireYear, expireMonth, expireDay] = dayjs(expiryDate)
                .format('YYYY-MM-DD')
                .split('-')
            const [curYear, curMonth, curDay] = dayjs()
                .format('YYYY-MM-DD')
                .split('-')
            let year = expireYear - curYear
            let month = expireMonth - curMonth
            let day = expireDay - curDay
            if (day < 0) {
                day += 30
                month -= 1
            }
            if (month < 0) {
                month += 12
                year -= 1
            }
            return (
                [
                    year * 2 + month ? year * 2 + month + '月' : '',
                    day ? day + '天' : '',
                ]
                    .filter(Boolean)
                    .join('') || '-'
            )
        },

        // 消课
        handleFinishLesson(item) {
            this.finishLessonDetail = item
            const refName = ({
                'one': 'finishLessonOne',
                'more': 'finishLessonMore',
            })[item.courseType]
            if(!refName) return

            this.$nextTick(() => {
                this.$refs[refName].open()
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    padding-top: 80rpx;
    background: #F5F7FA;
}

.page-title {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;

    width: 100%;
    background: #FFFFFF;
    padding: 20rpx 30rpx;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .day-of-week {
        font-size: 28rpx;
        color: #99A0AD;
        line-height: 40rpx;

        &.active {
            font-size: 32rpx;
            font-weight: 500;
            color: #141f33;
            position: relative;

            &::after {
                content: ' ';
                display: block;
                position: absolute;
                top: 20rpx;
                right: 0;
                opacity: 0.8;
                width: 54rpx;
                height: 22rpx;
                background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
                border-radius: 4rpx;
            }
        }
    }
}

.page-content {
    padding: 0 30rpx;

    padding-bottom: 100rpx;
    padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.period-item {
    position: relative;
    margin-top: 20rpx;
    padding-top: 16rpx;

    .avatar {
        position: absolute;
        width: 76rpx;
        height: 76rpx;
        left: 196rpx;
        top: -16rpx;
        z-index: 1;
    }

    .period-main {
        display: flex;
        min-height: 176rpx;
        position: relative;
        background: #FFFFFF;
        box-shadow: 0px 0px 8px 0px #E3E5E9;
        border-radius: 16rpx;

        .period-status {
            position: absolute;
            top: 0;
            left: 0;
            height: 36rpx;
            line-height: 36rpx;
            padding: 0 14rpx;
            background: #f15e5e;
            border-radius: 16rpx 0 16rpx 0;

            &.finish_course_discontinue {
                background: #99a0ad;
            }

            &.finish_course_continue {
                background: #44be5e;
            }
        }

        .period-name {
            position: relative;
            width: 176rpx;
            padding: 0 8rpx;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 28rpx;
            font-weight: 500;
            color: #141F33;

            &::after {
                content: ' ';
                display: inline-block;
                position: absolute;
                right: 0;

                width: 2rpx;
                height: 40rpx;
                background-color: #c9ced6;
                margin-left: 10rpx;
            }
        }

        .period-content {
            flex: 1;
            overflow: hidden;

            .period-content-title {
                display: flex;
                align-items: center;
                margin-top: 10rpx;
                margin-bottom: 24rpx;
                padding-left: 100rpx;

                .student-name {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #62BBEC;
                    line-height: 20px;
                }

                .gender-icon {
                    width: 24rpx;
                    height: 24rpx;
                    margin-left: 24rpx;
                }

                .student-age {
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #525666;
                    margin-left: 8rpx;
                }
            }

            .course {
                padding: 0 10rpx 20rpx 20rpx;

                .course-item {
                    +.course-item {
                        margin-top: 10rpx;
                    }
                    font-size: 24rpx;
                    color: #525666;
                    line-height: 34rpx;

                    &.warning {
                        font-weight: 500;
                        color: #F15E5E
                    }
                }
            }
            .student {
                padding: 0 10rpx 20rpx 20rpx;
                .student-item {
                    +.student-item {
                        margin-left: 10rpx;
                    }

                    font-size: 24rpx;
                    font-weight: 600;
                    color: #525666;
                    line-height: 34rpx;
                }
            }
        }

        .finish-lesson {
            width: 116rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
            border-radius: 0px 16rpx 16rpx 0px;

            font-size: 28rpx;
            color: #FFFFFF;
        }
    }

    .period-rest {
        display: flex;
        align-items: center;

        .period-rest-name {
            display: inline-flex;
            align-items: center;
            padding-left: 30rpx;
            padding-right: 30rpx;
            height: 36rpx;
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c9ced6;
        }

        .period-rest-divider {
            flex: 1;
            border-bottom: 2rpx solid #e3e5e9;
        }
    }
}
</style>
