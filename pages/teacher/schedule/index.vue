<template>
    <view class="page" @touchstart="touchstart" @touchend="touchend">
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
                            <image class="avatar" :src="getStudentCoverUrl(period.oneCourse.student)" @click="openStudent(period)" />
                            <view v-if="period.oneCourse.newStudent" class="period-status new">新学员
                            </view>
                            <view class="period-name">{{
                                period.periodName
                            }}</view>
                            <view class="period-content">
                                <view class="period-content-title">
                                    <text class="student-name" :class="{
                                        weekHaveFinish:
                                            period.oneCourse.weekHaveFinish
                                    }">{{ period.oneCourse.student.studentName }}</text>
                                    <image class="gender-icon" :src="`/static/images/student/${period.oneCourse.student.gender ||
                                    'male'
                                    }-selected.png`"></image>
                                    <text class="student-age">{{
                                        period.oneCourse.student.age + "岁"
                                    }}</text>
                                </view>
                                <view v-if="period.oneCourse.chapters.length" class="chapter">
                                    <view v-for="chapter in period.oneCourse
                                    .chapters" :key="chapter.id" class="chapter-item ellipsis">
                                        ({{ chapter.bookName }}){{ chapter.chapterName }}
                                    </view>
                                </view>
                            </view>
                            <view v-if="!teacherId" class="finish-lesson" @click="handleFinishLesson(period)">消课</view>
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
                                                .courseName
                                        }}
                                    </text>
                                </view>
                                <view v-if="
                                    Array.isArray(
                                        period.moreCourse.students
                                    )
                                " class="student ellipsis">
                                    <text v-for="student in period.moreCourse
                                    .students" :key="student.studentId"
                                        :class="{ weekHaveFinish: student.weekHaveFinish }" class="student-item">
                                        {{ student.studentName }}
                                    </text>
                                </view>
                                <view v-if="period.moreCourse.chapter" class="chapter">
                                    <view class="chapter-item ellipsis">
                                        ({{
                                            period.moreCourse.chapter.bookName
                                        }}){{ period.moreCourse.chapter.chapterName }}
                                    </view>
                                </view>
                            </view>
                            <view v-if="!teacherId" class="finish-lesson" @click="handleFinishLesson(period)">消课</view>
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

        <customTabbar v-if="!teacherId" :active="0" />

        <!-- 一对多详情（课程）| 对学生详情组件先后顺序有要求 -->
        <Course ref="course" :detail="courseDetail" @student="(id) => (studentId = id)" />

        <!-- 学生详情 -->
        <Student :student-id="studentId" @close="studentId = 0" />

        <!-- 消课 - 一对一 -->
        <FinishLessonOne ref="finishLessonOne" :detail="finishLessonDetail" @success="handleSearch" />
        <!-- 消课 - 一对多 -->
        <FinishLessonMore ref="finishLessonMore" :detail="finishLessonDetail" @success="handleSearch" />
    </view>
</template>

<script>
import Student from "@/components/Student";
import Course from "@/components/Course";
import FinishLessonOne from "./components/FinishLessonOne";
import FinishLessonMore from "./components/FinishLessonMore";

export default {
    components: {
        Student,
        Course,
        FinishLessonOne,
        FinishLessonMore,
    },
    data() {
        return {
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
            finishLessonDetail: {}, // 消课详情
            courseDetail: {},

            startX: 0
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

        const week = new Date().getDay();
        this.dayOfWeek = week === 1 ? 2 : (week === 0 ? 7 : week);
        this.handleSearch();
    },
    methods: {
        touchstart(e) {
            this.startX = e.changedTouches[0].pageX
        },

        touchend(e) {
            const moveX = e.changedTouches[0].pageX - this.startX
            if (Math.abs(moveX) < 50) return
            if (moveX > 0) {
                if (this.dayOfWeek === 2) return
                this.dayOfWeek--
            } else {
                if (this.dayOfWeek === 7) return
                this.dayOfWeek++
            }
            this.handleSearch();
        },

        handleToggleDayOfWeek(day) {
            this.dayOfWeek = day.value;
            this.handleSearch();
        },

        async handleSearch(loading = true) {
            if (loading) uni.showLoading({ title: "加载中" });
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
                this.periods = periods || [];
            } finally {
                if (loading) uni.hideLoading();
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

        // 消课
        handleFinishLesson(item) {
            this.finishLessonDetail = item;
            const refName = {
                one: "finishLessonOne",
                more: "finishLessonMore",
            }[item.courseType];
            if (!refName) return;

            this.$nextTick(() => {
                this.$refs[refName].open();
            });
        },
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
            background: #f15e5e;
            border-radius: 16rpx 0 16rpx 0;
            padding: 0 14rpx;

            font-size: 24rpx;
            font-weight: 500;
            color: #ffffff;
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
                    &.weekHaveFinish {
                        color: #62bbec;
                    }
                }
                .course-name {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #62bbec;
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
            }
            .student {
                padding: 0 10rpx 20rpx 20rpx;
                .student-item {
                    font-size: 24rpx;
                    font-weight: 600;
                    color: #525666;
                    line-height: 34rpx;
                    + .student-item {
                        margin-left: 10rpx;
                    }
                    &.weekHaveFinish {
                        color: #62bbec;
                    }
                }
            }
            .chapter {
                padding: 0 10rpx 20rpx 20rpx;

                .chapter-item {
                    + .chapter-item {
                        margin-top: 10rpx;
                    }
                    font-size: 24rpx;
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

            background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
            border-radius: 0px 16rpx 16rpx 0px;

            font-size: 28rpx;
            color: #ffffff;
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
