<template>
    <view>
        <uni-popup ref="popup" :is-mask-click="false" type="center">
            <view class="main flex flex-column">
                <view class="title flex">
                    <image class="avatar" :src="
                        student.coverUrl || defaultCover
                    "></image>
                    <view class="center-popup-title-content">
                        <view class="center-popup-title-main flex align-center justify-between">
                            <view class="flex align-center">
                                <text class="student-name">{{
                                    student.studentName
                                }}</text>
                                <text class="package-name">{{
                                    coursePackage.packageName
                                }}</text>
                            </view>
                            <text v-if="accountType !== 'AUDITION'" class="set-grade" @click="setGrade">设置级别</text>
                            <uni-icons v-else type="closeempty" size="14" @click="close" />
                        </view>
                        <view class="center-popup-title-sub">
                            <image v-if="student.gender === 'male'" class="gender-icon"
                                src="/static/images/male_selected.png"></image>
                            <image v-if="student.gender === 'female'" class="gender-icon"
                                src="/static/images/female_selected.png"></image>
                            <text class="text">{{ student.age + '岁' }}</text>
                            <text class="text">{{
                                '课程陪练券' + trainTicketNum + '张'
                            }}</text>
                        </view>
                    </view>
                </view>
                <view class="content">
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
                            <text class="score-item-num">{{ lastExamTime }} </text>
                            <text class="score-item-desc">上次考级时间</text>
                        </view>
                    </view>
                    <view class="section-divider"></view>
                    <view v-if="Array.isArray(coursePackage.courses)" class="course px-28">
                        <view v-for="course in coursePackage.courses" :key="course.courseId" class="course-item">
                            <view class="course-item-title ellipsis" :class="{ warning: course.remainCourseNum < 6 }">
                                <text>{{
                                    course.courseName +
                                        '(' +
                                        course.teacherName +
                                        ')'
                                }}</text>
                                <text>{{
                                    dayOfWeekOBj[course.dayOfWeek] +
                                        ' ' +
                                        course.timetablePeriodName
                                }}</text>
                                <text>{{
                                    '剩余' + course.remainCourseNum + '节'
                                }}</text>
                            </view>
                            <view v-if="Array.isArray(course.chapters)" class="course-item-chapter">
                                <view v-for="chapter in course.chapters" :key="chapter.id"
                                    class="course-item-chapter-item ellipsis">
                                    <text v-if="chapter.bookName">{{
                                        '(' + chapter.bookName + ')'
                                    }}</text>
                                    <text v-if="chapter.chapterName">{{
                                        chapter.chapterName
                                    }}</text>
                                </view>
                            </view>
                            <view v-if="accountType === 'AUDITION'" class="course-item-btn" @click="toClass(course)">
                                班级详情
                                <uni-icons type="right" color="#99A0AD" size="12" />
                            </view>
                        </view>
                    </view>
                    <!-- 试听端 -->
                    <template v-if="accountType === 'AUDITION'">
                        <view class="section-divider"></view>
                        <view class="expire-date px-28" :class="{ 'warning': expiryDateWarning }">
                            {{ '账户有效期：剩余' + expiryDate }}
                        </view>
                        <view class="section-divider"></view>
                        <view class="remark" :class="{ 'exist': student.remark }" @click="openRemark(student)">
                            <template v-if="student.remark">
                                <text>{{ student.remark }} </text>
                                <uni-icons type="closeempty" size="12"></uni-icons>
                            </template>
                            <template v-else>
                                <text>点击添加备注信息(15字内)</text>
                                <image src="/static/images/audition/edit.png" />
                            </template>
                        </view>
                    </template>
                </view>
                <view class="footer">
                    <!-- <button class="btn cancel" @click="disContinue">
                        不续课
                    </button>
                    <button class="btn confirm" @click="doContinue">
                        续课
                    </button> -->
                    <button class="btn confirm" @click="close">
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
                            <van-radio-group v-model="form.examSeason" @change="(e) => (form.examSeason = e.detail)"
                                direction="horizontal">
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

        <!-- 备注 -->
        <Remark ref="remark" :detail="student" @confirm="getStudent" />
    </view>
</template>

<script>
import Remark from "@/components/Remark";
import { getExpiryDate } from '@/utils/format'
import dayjs from 'dayjs'
export default {
    components: {
        Remark
    },
    props: {
        studentId: [String, Number],
        accountType: {
            type: String,
            default: 'TEACHER'
        }
    },
    data() {
        return {
            defaultCover: "https://static.gangqintonghua.com/img/touxiang/pic1.webp",
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
        lastExamTime() {
            return [this.student.lastExamTime, this.student.examSeason].filter(Boolean).join(' | ') || '-'
        },
        expiryDate() {
            return getExpiryDate(this.student.expiryDate)
        },
        expiryDateWarning() {
            return this.student.expiryDate - dayjs() < 30 * 24 * 60 * 60 * 1000
        }
    },
    methods: {
        async getStudent() {
            const res = await this.$http.get(
                `/mini/student/getStudentDetail?studentId=${this.studentId}`
            )
            this.detail = res.data ?? {}
        },

        close() {
            this.$refs.popup.close()
            this.$emit('close')
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
        },

        openRemark() {
            this.$refs.remark.open()
        },

        disContinue() {

        },

        doContinue() {

        },

        toClass({ courseId, teacherId, timetablePeriodId }) {
            uni.navigateTo({ url: `/pages/audition/banji/index?courseId=${courseId}&teacherId=${teacherId}&timetablePeriodId=${timetablePeriodId}` })
        }
    }
}
</script>

<style lang="scss" scoped src="./popup.scss"></style>
<style lang="scss" scoped>
.main {
    .title {
        position: relative;
        height: 200rpx;
        padding: 30rpx 30rpx 0 30rpx;

        background-image: url("https://static.gangqintonghua.com/img/beijing/xueyuan.png");
        background-repeat: no-repeat;
        background-size: 100%;

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
                    color: #ffffff;
                    margin-right: 10rpx;
                    line-height: 40rpx;
                }

                .package-name {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 20rpx;

                    padding: 6rpx 12rpx 4rpx 12rpx;
                    font-size: 16rpx;
                    color: #eff5ff;
                    line-height: 22rpx;
                }
                .set-grade {
                    font-size: 24rpx;
                    color: #fff;
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
                    color: #ffffff;
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
    .content {
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
        .course {
            padding-top: 36rpx;
            &-item {
                margin-bottom: 36rpx;
                &-title {
                    font-size: 24rpx;
                    color: #141f33;
                    line-height: 34rpx;
                    margin-bottom: 14rpx;
                    &.warning {
                        font-weight: 500;
                        color: #f15e5e;
                    }
                    text + text {
                        margin-left: 12rpx;
                    }
                }
                &-chapter {
                    &-item {
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;
                        + .course-item-chapter-item {
                            margin-top: 12rpx;
                        }
                    }
                }
                &-btn {
                    font-size: 24rpx;
                    color: #99a0ad;
                    line-height: 34rpx;
                    text-align: right;
                }
            }
        }
        .expire-date {
            padding-top: 20rpx;
            padding-bottom: 20rpx;

            font-size: 24rpx;
            font-weight: 500;
            color: #141f33;
            line-height: 34rpx;
            &.warning {
                color: #f15e5e;
            }
        }
        .remark {
            font-size: 24rpx;
            color: #99a0ad;
            height: 34rpx;
            line-height: 34rpx;
            margin: 30rpx 28rpx;
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
