<template>
    <view>
        <uni-popup ref="popup" :is-mask-click="false" type="center">
            <view class="center-popup main flex flex-column">
                <view class="center-popup-title flex">
                    <image class="avatar" :src="
                        student.coverUrl ||
                        '/static/images/course_type_more.png'
                    "></image>
                    <view class="center-popup-title-content">
                        <view class="center-popup-title-main flex align-center justify-between">
                            <text>
                                <text class="student-name">{{
                                    student.studentName
                                }}</text>
                                <text class="package-name">{{
                                    coursePackage.packageName
                                }}</text>
                            </text>
                            <text class="set-grade" @click="setGrade">设置级别</text>
                        </view>
                        <view class="center-popup-title-sub">
                            <image v-if="student.gender === 'male'" class="gender-icon" src="/static/images/male_selected.png"></image>
                            <image v-if="student.gender === 'female'" class="gender-icon" src="/static/images/female_selected.png"></image>
                            <text class="text">{{ student.age + '岁' }}</text>
                            <text class="text">{{
                                '课程陪练券' + trainTicketNum + '张'
                            }}</text>
                        </view>
                    </view>
                </view>
                <view class="center-popup-content">
                    <view class="score px-28">
                        <view class="score-item">
                            <text class="score-item-num">{{
                                student.handScore || '-'
                            }}</text>
                            <text class="score-item-desc">手型平均分</text>
                        </view>
                        <view class="score-item">
                            <text class="score-item-num">{{
                                student.musicScore || '-'
                            }}</text>
                            <text class="score-item-desc">识谱平均分</text>
                        </view>
                        <view class="score-item">
                            <text class="score-item-num">{{
                                student.attitudeScore || '-'
                            }}</text>
                            <text class="score-item-desc">学习态度分</text>
                        </view>
                    </view>
                    <view class="score px-28">
                        <view class="score-item">
                            <text class="score-item-num">{{
                                student.finishChapterScore || '-'
                            }}</text>
                            <text class="score-item-desc">回课成绩分</text>
                        </view>
                        <view class="score-item">
                            <text class="score-item-num">{{
                                student.grade ? student.grade + '级' : '-'
                            }}</text>
                            <text class="score-item-desc">当前级别</text>
                        </view>
                        <view class="score-item">
                            <text class="score-item-num">{{  student | lastExamTime }} </text>
                            <text class="score-item-desc">上次考级时间</text>
                        </view>
                    </view>
                    <view class="section-divider"></view>
                    <view v-if="Array.isArray(coursePackage.courses)" class="chapters px-28">
                        <view v-for="course in coursePackage.courses" :key="course.courseId" class="chapter-item">
                            <view class="chapter-item-title ellipsis" :class="{ warning: course.remainCourseNum < 6 }">
                                <text class="text">{{
                                    course.courseName +
                                        '(' +
                                        course.teacherName +
                                        ')'
                                }}</text>
                                <text class="text">{{
                                    dayOfWeekOBj[course.dayOfWeek] +
                                        ' ' +
                                        course.timetablePeriodName
                                }}</text>
                                <text class="text">{{
                                    '剩余' + course.remainCourseNum + '节'
                                }}</text>
                            </view>
                            <template v-if="Array.isArray(course.chapters)">
                                <view v-for="chapter in course.chapters" :key="chapter.id" class="chapter-item-book ellipsis">
                                    <text v-if="chapter.bookName" class="chapter-item-book-text">{{
                                        '(' + chapter.bookName + ')'
                                    }}</text>
                                    <text v-if="chapter.chapterName" class="chapter-item-book-text">{{
                                        chapter.chapterName
                                    }}</text>
                                </view>
                            </template>
                        </view>
                    </view>
                </view>
                <view class="footer">
                    <button class="btn confirm" @click="()=> { $refs.popup.close(); $emit('close') }">
                        我知道了
                    </button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="grade" type="bottom" class="grade">
            <view class="grade-main">
                <view class="grade-main-title">
                    <text class="btn" @click="$refs.grade.close()">取消</text>
                    <text class="btn" :class="{ confirm: !disabled }" @click="setGradeConfirm">确认</text>
                </view>
                <view class="grade-main-form">
                    <view class="form-item">
                        <view class="label">当前级别</view>
                        <view class="value">
                            <input v-model.trim="form.grade" maxlength="2" placeholder="例“2”" />
                            <text class="unit">级</text>
                        </view>
                    </view>
                    <view class="form-item">
                        <view class="label">上次考试时间</view>
                        <view class="value">
                            <input v-model.trim="form.lastExamTime" maxlength="4" placeholder="输入年份 例“2020”" />
                        </view>
                    </view>
                    <view class="form-item">
                        <view class="label">请选择考季</view>
                        <view class="value">
                            <van-radio-group v-model="form.examSeason" @change="(e) => (form.examSeason = e.detail)" direction="horizontal">
                                <van-radio use-icon-slot name="夏季">
                                    <image slot="icon" :src="`/static/images/student/icon-radio${form.examSeason === '夏季'
                                    ? '-active'
                                    : ''
                                    }.png`" style="width: 28rpx; height: 28rpx" />
                                    夏季
                                </van-radio>
                                <van-radio use-icon-slot name="冬季">
                                    <image slot="icon" :src="`/static/images/student/icon-radio${form.examSeason === '冬季'
                                    ? '-active'
                                    : ''
                                    }.png`" style="width: 28rpx; height: 28rpx" />
                                    冬季
                                </van-radio>
                            </van-radio-group>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
export default {
    props: {
        studentId: [String, Number]
    },
    filters: {
        lastExamTime(student) {
            return [student.lastExamTime,student.examSeason].filter(Boolean).join(' | ') || '-'
        }
    },
    data() {
        return {
            detail: {},
            dayOfWeekOBj: {
                2: "周二",
                3: "周三",
                4: "周四",
                5: "周五",
                6: "周六",
                7: "周日",
            },
            form: {
                grade: "",
                lastExamTime: "",
                examSeason: "",
            },
        }
    },
    watch: {
        studentId(newVal) {
            if (newVal) {
                this.getStudent()
                this.$refs.popup.open()
            }
        }
    },
    computed: {
        student() {
            return this.detail?.student ?? {};
        },
        coursePackage() {
            return this.detail?.coursePackage ?? {};
        },
        trainTicketNum() {
            return this.detail?.trainTicketNum ?? 0;
        },
        disabled() {
            const { grade, lastExamTime, examSeason } = this.form;
            return !(grade && lastExamTime && examSeason);
        },
    },
    methods: {
        async getStudent() {
            const res = await this.$http.get(
                `/mini/student/getStudentDetail?studentId=${this.studentId}`
            )
            this.detail = res.data ?? {}
        },

        setGrade() {
            this.$refs.grade.open();
            const {
                grade = '',
                lastExamTime = '',
                examSeason = '',
            } = this.student;
            this.form = {
                grade,
                lastExamTime,
                examSeason,
            }
        },

        async setGradeConfirm() {
            if (this.disabled) return

            const { grade, lastExamTime, examSeason } = this.form
            const param = {
                data: {
                    grade,
                    lastExamTime,
                    examSeason,
                    studentId: this.studentId
                }
            }
            const res = await this.$http.post(
                "/mini/student/updateStudentGrade",
                param
            )
            if (res.ok) {
                uni.showToast({
                    title: "设置成功！",
                    icon: "success",
                })
                this.$refs.grade.close()
                this.getStudent()
            }
        }
    }
}
</script>

<style lang="scss" scoped src="../styles/popup.scss"></style>
<style lang="scss" scoped>
.center-popup {
    &-title {
        position: relative;
        height: 200rpx;
        padding: 30rpx 30rpx 0 30rpx;

        .avatar {
            width: 108rpx;
            height: 108rpx;
            border-radius: 50%;
            margin-right: 24rpx;
        }

        .center-popup-title-content {
            flex: 1;

            .center-popup-title-main {
                .student-name {
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    //color: #FFFFFF;
                    margin-right: 10rpx;
                    line-height: 40rpx;
                }

                .package-name {
                    display: inline-flex;
                    align-items: center;
                    padding-left: 10rpx;
                    padding-right: 10rpx;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 18rpx;
                    height: 36rpx;
                    font-size: 20rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #eff5ff;
                    line-height: 36rpx;
                }
                .set-grade {
                    font-size: 24rpx;
                }
            }

            .center-popup-title-sub {
                display: flex;
                align-items: center;
                height: 36rpx;
                margin-top: 12rpx;

                .gender-icon {
                    width: 24rpx;
                    height: 24rpx;
                }

                .text {
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    //color: #FFFFFF;
                    margin-left: 20rpx;
                }
            }

            .close {
                position: absolute;
                top: 48rpx;
                right: 30rpx;
                font-size: 24rpx;
            }
        }
    }
    &-content {
        margin-top: 20rpx;

        .score {
            display: flex;

            .score-item {
                position: relative;
                width: 33.33%;
                display: inline-flex;
                flex-direction: column;
                margin-bottom: 36rpx;

                &:after {
                    content: "";
                    display: inline-block;
                    width: 2rpx;
                    height: 20rpx;
                    border-right: 2rpx solid #c9ced6;
                    position: absolute;
                    right: 0;
                    top: 20rpx;
                }

                &:last-child {
                    &:after {
                        display: none;
                    }
                }

                .score-item-num {
                    height: 40rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #141f33;
                    line-height: 40rpx;
                    text-align: center;
                }

                .score-item-desc {
                    height: 36rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #99a0ad;
                    line-height: 36rpx;
                    text-align: center;
                }
            }
        }
        .section-divider {
            width: 600rpx;
            height: 2rpx;
            border-top: 2rpx dashed #e3e5e9;
            margin: 0 auto;
        }
        .chapters {
            padding-top: 36rpx;

            .chapter-item {
                margin-bottom: 36rpx;

                .chapter-item-title {
                    height: 36rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #141f33;
                    line-height: 36rpx;

                    &.warning {
                        font-weight: 500;
                        color: #f15e5e;
                    }

                    .text {
                        margin-left: 12rpx;

                        &:first-child {
                            margin-left: 0;
                        }
                    }
                }

                .chapter-item-book {
                    margin-top: 12rpx;
                    height: 36rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #99a0ad;
                    line-height: 36rpx;
                }
            }
        }
        .expire-date {
            padding-top: 20rpx;
            padding-bottom: 20rpx;
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #141f33;
            line-height: 36rpx;

            &.warning {
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #f15e5e;
            }
        }
        .note,
        .note-empty {
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 36rpx;
        }
        .note {
            display: inline-flex;
            color: #367aa0;
            background-color: rgba(226, 243, 255, 0.58);
        }
        .note-empty {
            color: #99a0ad;

            .edit {
                width: 20rpx;
                height: 20rpx;
            }
        }
    }
}

.grade-main {
    height: 360rpx;
    background-color: #fff;
    border-radius: 10px 10px 0px 0px;
    &-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24rpx 44rpx;
        .btn {
            font-size: 28rpx;
            color: #99a0ad;
        }
        .confirm {
            color: #62bbec;
        }
    }
    &-form {
        background-color: #fff;
        padding: 0 32rpx;
        .form-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            + .form-item {
                margin-top: 32rpx;
            }
            .label {
                font-size: 28rpx;
                color: #99a0ad;
                line-height: 40rpx;
            }
            .value {
                position: relative;
                input {
                    border-bottom: 1px solid #f3f3f3;
                    text-align: center;

                    font-size: 28rpx;
                    color: #141f33;
                    line-height: 20px;
                }
                .unit {
                    position: absolute;
                    right: 0;
                    top: 6rpx;

                    color: #525666;
                    line-height: 20px;
                }
            }
        }
    }
}
</style>
