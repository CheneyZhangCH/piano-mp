<template>
    <view class="page">
        <view class="page-title">
            <text v-for="day in dayOfWeekArr" :key="day.value" class="day-of-week"
                :class="{ active: dayOfWeek === day.value }" @click="handleToggleDayOfWeek(day)">
                {{ day.label }}
            </text>
        </view>
        <view class="page-content">
            <template v-if="periods.length">
                <!-- v-if="['work', 'rest'].includes(period.periodType)" -->
                <view v-for="period in periods" :key="period.timetablePeriodId" class="period-item">
                    <template v-if="period.periodType === 'work'">
                        <!-- 1表示一对一生效,2表示一对多生效,3表示无安排,4表示一对一待生效 -->
                        <view v-if="
                            period.periodStatus === '1' && period.oneCourse
                        " class="period-main">
                            <image class="avatar" :src="
                                period.oneCourse.student.coverUrl ||
                                defaultCover
                            " @click="openStudent(period)" />
                            <view v-if="period.oneCourse.newStudent" class="period-status new">新学员
                            </view>
                            <view
                                v-if="['finish_course_discontinue', 'finish_course_continue'].includes(period.oneCourse.student.status)"
                                class="period-status" :class="period.oneCourse.student.status">
                                {{ period.oneCourse.student.status === 'finish_course_discontinue' ? '即将清退' : '即将生效' }}
                            </view>
                            <view class="period-name">{{ period.periodName }}</view>
                            <view class="period-content">
                                <view class="period-content-title">
                                    <text class="student-name" :class="{
                                        weekHaveFinish:
                                            period.oneCourse.weekHaveFinish,
                                    }">{{ period.oneCourse.student.studentName }}</text>
                                    <image class="gender-icon" :src="`/static/images/student/${period.oneCourse.student.gender ||
                                    'male'
                                    }-selected.png`"></image>
                                    <text class="student-age">{{
                                        period.oneCourse.student.age + "岁"
                                    }}</text>
                                    <text class="packageName">
                                        {{ period.oneCourse.coursePackage.packageName }}
                                    </text>
                                </view>
                                <view v-if="Array.isArray(period.oneCourse.coursePackage.courses)" class="course">
                                    <text v-for="course in period.oneCourse.coursePackage.courses"
                                        :key="course.courseId" class="course-item"
                                        :class="{ 'warning': course.remainCourseNum < 6 }">
                                        {{ course.courseName + '：' + course.remainCourseNum + '节' }}
                                    </text>
                                </view>
                                <view class="expire-date"
                                    :class="{ 'warning': period.oneCourse.student.expiryDateWarning }"
                                    style="margin-bottom: 10rpx;">{{
                                        '账户有效期剩余：' +
                                            period.oneCourse.student.expiryDateStr
                                    }}</view>
                                <view class="remark" :class="{ 'exist': period.oneCourse.student.remark }"
                                    @click="openRemark(period.oneCourse.student)">
                                    <template v-if="period.oneCourse.student.remark">
                                        <text>{{ period.oneCourse.student.remark }} </text>
                                        <uni-icons type="closeempty" size="12"></uni-icons>
                                    </template>
                                    <template v-else>
                                        <text>点击添加备注信息(15字内)</text>
                                        <image src="/static/images/audition/edit.png" />
                                    </template>
                                </view>
                            </view>
                        </view>
                        <view v-else-if="
                            period.periodStatus === '2' && period.moreCourse
                        " class="period-main">
                            <image class="avatar" src="/static/images/teacher/course_type_more.png"
                                @click="openCourse(period)" />
                            <view class="period-name">{{
                                period.periodName
                            }}</view>
                            <view class="period-content">
                                <view class="period-content-title">
                                    <text class="course-name">
                                        {{
                                            period.moreCourse.course
                                                .courseName +
                                                (period.moreCourse.students.length >= period.remainStudentNum
                                                    ? "(满班)"
                                                    : "")
                                        }}
                                    </text>
                                </view>
                                <view v-if="
                                    Array.isArray(
                                        period.moreCourse.students
                                    )
                                " class="student">
                                    <text v-for="student in period.moreCourse
                                    .students" :key="student.studentId" :class="{ warning: student.warn }"
                                        class="student-item">
                                        {{ student.studentName }}
                                    </text>
                                </view>
                                <view v-if="period.moreCourse.chapter" class="chapter">
                                    <view class="chapter-item ellipsis">
                                        ({{
                                            period.moreCourse.chapter.bookName
                                        }}) {{ period.moreCourse.chapter.chapterName }}
                                    </view>
                                </view>
                                <view v-if="period.moreCourse.startClassDate" class="expire-date">{{
                                    '开班日期：' +
                                        period.moreCourse.startClassDateStr
                                }}</view>
                            </view>
                        </view>
                        <view v-else-if="period.periodStatus === '3'" class="period-main">
                            <view class="period-name">{{
                                period.periodName
                            }}</view>
                        </view>
                        <view v-else-if="period.periodStatus === '4'" class="period-main lock">
                            <view class="period-name">{{
                                period.periodName
                            }}</view>
                            <view class="period-content">
                                该时间段已被锁定，请勿做其余安排
                            </view>
                        </view>
                    </template>

                    <view v-if="period.periodType === 'rest'" class="period-rest">
                        <view class="period-rest-divider"></view>
                        <view class="period-rest-name">
                            {{ period.periodName }} 休息
                        </view>
                        <view class="period-rest-divider"></view>
                    </view>
                </view>
            </template>
        </view>

        <!-- 一对多详情（课程）| 对学生详情组件先后顺序有要求 -->
        <Course ref="course" :detail="courseDetail" @student="(id) => (studentId = id)" />

        <!-- 学生详情 -->
        <Student :student-id="studentId" @close="studentId = 0" @del="studentId = 0" />

        <!-- 备注 -->
        <Remark ref="remark" :detail="studentDetail" @confirm="handleSearch" />
    </view>
</template>

<script>
import Student from "@/components/Student";
import Course from "@/components/Course";
import Remark from "@/components/Remark";
import dayjs from "dayjs";
import { getExpiryDate, getExpiryDateWarning } from '@/utils/format'

export default {
    components: {
        Student,
        Course,
        Remark
    },
    data() {
        return {
            defaultCover:
                "https://static.gangqintonghua.com/img/touxiang/pic1.webp",
            userId: 0,
            // teacherId 存在表示具体老师，否则表示老师端-登录人课表
            teacherId: 0,
            dayOfWeek: 2,
            dayOfWeekArr: [
                { label: "周二", value: 2 },
                { label: "周三", value: 3 },
                { label: "周四", value: 4 },
                { label: "周五", value: 5 },
                { label: "周六", value: 6 },
                { label: "周日", value: 7 },
            ],
            periods: [],

            studentId: 0,
            courseDetail: {},
            studentDetail: {}
        };
    },
    onLoad(option) {
        const token = uni.getStorageSync("token");
        const userId = uni.getStorageSync("userId");
        // 权限验证
        if (!token) {
            uni.showToast({ title: "请先登录", icon: "none" });
            return uni.navigateTo({ url: "/pages/login/index" });
        }
        this.userId = userId;

        if (option?.teacherId) {
            this.teacherId = option.teacherId;
            uni.setNavigationBarTitle({
                title: option.teacherName ?? "我的课表",
            });
        }

        const week = new Date().getDay()
        this.dayOfWeek = 2// week === 1 ? 2 : week;
        this.handleSearch();
    },
    methods: {
        handleToggleDayOfWeek(day) {
            this.dayOfWeek = day.value;
            this.handleSearch();
        },

        async handleSearch(loading = true) {
            if (loading) uni.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.post(
                    `/mini/courseTimetable/getTeacherDayTimetable`,
                    {
                        data: {
                            teacherId: this.teacherId || this.userId,
                            dayOfWeek: this.dayOfWeek,
                        },
                    }
                );
                const { periods } = res.data ?? {};
                if (Array.isArray(periods)) {
                    periods.forEach(period => {
                        if (period.periodType === 'work' && period.oneCourse) {
                            const { expiryDate } = period.oneCourse.student || {}
                            period.oneCourse.student.expiryDateStr = getExpiryDate(expiryDate)
                            period.oneCourse.student.expiryDateWarning = getExpiryDateWarning(expiryDate)
                        }
                        if (period.periodType === 'work' && period.moreCourse) {
                            const { startClassDate } = period.moreCourse || {}
                            period.moreCourse.startClassDateStr = startClassDate ? dayjs(startClassDate).format('YYYY-MM-DD') : ''
                        }
                    })
                }
                this.periods = periods || [];
            } finally {
                if (loading) uni.hideLoading()
                uni.stopPullDownRefresh();
            }
        },

        // 学生详情弹窗
        openStudent(period) {
            this.studentId = period.oneCourse.student.accountId;
        },

        // 一对多详情
        openCourse(period) {
            this.courseDetail = period;
            this.$refs.course.open();
        },

        openRemark(student) {
            this.studentDetail = student
            this.$refs.remark.open()
        }
    },
    onPullDownRefresh() {
        this.handleSearch();
    },
};
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    padding-top: 80rpx;
    padding-bottom: 100rpx;
}

.page-title {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;

    width: 100%;
    background: #ffffff;
    padding: 20rpx 30rpx;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .day-of-week {
        font-size: 28rpx;
        color: #99a0ad;
        line-height: 40rpx;

        &.active {
            font-size: 32rpx;
            font-weight: 500;
            color: #141f33;
            position: relative;

            &::after {
                content: " ";
                display: block;
                position: absolute;
                top: 20rpx;
                right: 0;
                opacity: 0.8;
                width: 54rpx;
                height: 22rpx;
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
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
        border-radius: 50%;
        left: 196rpx;
        top: -16rpx;
        z-index: 1;
    }

    .period-main {
        display: flex;
        min-height: 176rpx;
        position: relative;
        background: #ffffff;
        box-shadow: 0px 0px 8px 0px #e3e5e9;
        border-radius: 16rpx;
        &.lock {
            border: 2rpx dashed #979797;
            .period-content {
                display: flex;
                align-items: center;

                padding-left: 20rpx;
                font-size: 28rpx;
                color: #99a0ad;
            }
        }

        .period-status {
            position: absolute;
            top: 0;
            left: 0;
            height: 36rpx;
            line-height: 36rpx;

            border-radius: 16rpx 0 16rpx 0;
            padding: 0 14rpx;

            font-size: 24rpx;
            font-weight: 500;
            color: #ffffff;
            &.new {
                background: #f15e5e;
            }
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
            color: #141f33;

            &::after {
                content: " ";
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
            padding-bottom: 10rpx;
            padding-right: 10rpx;

            .period-content-title {
                display: flex;
                align-items: center;
                margin-top: 10rpx;
                margin-bottom: 24rpx;
                padding-left: 100rpx;

                .student-name {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #141f33;
                    line-height: 40rpx;
                }
                .course-name {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #141f33;
                    line-height: 40rpx;
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
                .packageName {
                    font-size: 24rpx;
                    color: #525666;
                    margin-left: 8rpx;
                }
            }
            .student {
                padding: 0 10rpx 0 20rpx;
                margin-bottom: 10rpx;
                .student-item {
                    font-size: 24rpx;
                    font-weight: 500;
                    color: #525666;
                    line-height: 34rpx;
                    + .student-item {
                        margin-left: 10rpx;
                    }
                    &.warning {
                        color: #f15e5e;
                    }
                }
            }
            .chapter {
                padding: 0 10rpx 0 20rpx;
                margin-bottom: 10rpx;
                .chapter-item {
                    + .chapter-item {
                        margin-top: 10rpx;
                    }
                    font-size: 24rpx;
                    color: #525666;
                    line-height: 34rpx;
                }
            }
            .course {
                padding-left: 12rpx;
                margin-bottom: 10rpx;
                .course-item {
                    font-size: 24rpx;
                    color: #525666;
                    line-height: 34rpx;
                    + .course-item {
                        margin-left: 36rpx;
                    }

                    &.warning {
                        font-weight: 500;
                        color: #f15e5e;
                    }
                }
            }
            .expire-date {
                padding-left: 12rpx;
                font-size: 24rpx;
                color: #525666;
                line-height: 34rpx;

                &.warning {
                    font-weight: 600;
                    color: #f15e5e;
                }
            }
            .remark {
                font-size: 24rpx;
                color: #99a0ad;
                margin-left: 12rpx;
                height: 34rpx;
                line-height: 34rpx;
                &.exist {
                    display: inline-block;
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
