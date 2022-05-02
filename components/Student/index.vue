<template>
    <view>
        <uni-popup ref="popup" type="center" @change="onChange">
            <view class="main flex flex-column">
                <view class="title flex">
                    <image class="avatar" :src="getStudentCoverUrl(student)" />
                    <view class="center-popup-title-content">
                        <view class="center-popup-title-main flex align-center justify-between">
                            <view class="flex align-center">
                                <text class="student-name">{{
                                    student.studentName
                                }}</text>
                                <text v-if="coursePackage.packageName" class="package-name">{{
                                    coursePackage.packageName
                                }}</text>
                            </view>
                            <text v-if="!['AUDITION', 'ADMIN', 'SUPER_ADMIN'].includes(accountType)" class="set-grade"
                                @click="setGrade">设置级别</text>
                            <uni-icons v-else type="closeempty" size="14" color="#367AA0" @click="close" />
                        </view>
                        <view class="center-popup-title-sub">
                            <image class="gender-icon"
                                :src="`/static/images/student/${student.gender || 'male'}.png`" />
                            <text class="text">{{ student.age + '岁' }}</text>
                            <text class="text">{{
                                '课程陪练券' + trainTicketNum + '张'
                            }}</text>
                        </view>
                    </view>
                </view>
                <scroll-view scroll-y="true" class="content" :style="contentStyle">
                    <view class="score px-28">
                        <view class="score-item">
                            <view class="inline-flex flex-column">
                                <text class="score-item-num">{{
                                    student.handScore || '-'
                                }}</text>
                                <text class="score-item-desc">手型平均分</text>
                            </view>
                        </view>
                        <view class="score-item inline-flex flex-column">
                            <text class="score-item-num">{{
                                student.musicScore || '-'
                            }}</text>
                            <text class="score-item-desc">识谱平均分</text>
                        </view>
                        <view class="score-item text-right">
                            <view class="inline-flex flex-column">
                                <text class="score-item-num">{{
                                    student.attitudeScore || '-'
                                }}</text>
                                <text class="score-item-desc">学习态度分</text>
                            </view>
                        </view>
                    </view>
                    <view class="score px-28">
                        <view class="score-item">
                            <view class="inline-flex flex-column">
                                <text class="score-item-num">{{
                                    student.finishChapterScore || '-'
                                }}</text>
                                <text class="score-item-desc">回课成绩分</text>
                            </view>
                        </view>
                        <view class="score-item inline-flex flex-column">
                            <text class="score-item-num">{{
                                student.grade ? student.grade + '级' : '-'
                            }}</text>
                            <text class="score-item-desc">当前级别</text>
                        </view>
                        <view class="score-item text-right">
                            <view class="inline-flex flex-column">
                                <text class="score-item-num">{{ lastExamTime }} </text>
                                <text class="score-item-desc">上次考级时间</text>
                            </view>
                        </view>
                    </view>
                    <view class="section-divider"></view>
                    <view v-if="Array.isArray(coursePackage.courses)" class="course px-28">
                        <view v-for="course in coursePackage.courses" :key="course.courseId" class="course-item">
                            <view class="course-item-title" :class="{ warning: course.remainCourseNum <= 6 }">
                                <text class="flex-1 ellipsis">
                                    <text>{{
                                        course.courseName +
                                            '(' +
                                            course.teacherName +
                                            ')'
                                    }}</text>
                                    <text>{{
                                        '周' + WEEK_DAY[course.dayOfWeek] +
                                            ' ' +
                                            course.timetablePeriodName
                                    }}</text>
                                </text>
                                <text v-if="['AUDITION', 'ADMIN', 'SUPER_ADMIN'].includes(accountType)">{{
                                    '剩余' + course.remainCourseNum + '节'
                                }}</text>
                            </view>
                            <view v-if="course.chapters.length" class="course-item-chapter"
                                :class="course.courseType">
                                <view v-for="chapter in course.chapters" :key="chapter.id"
                                    class="course-item-chapter-item ellipsis">
                                    <text class="name">
                                        ({{ chapter.bookName }}){{ chapter.chapterName }}
                                    </text>
                                    <view
                                        v-if="['AUDITION', 'ADMIN', 'SUPER_ADMIN'].includes(accountType) && course.courseType === 'more' && !isBanji"
                                        class="btn" @click="toClass(course)">
                                        班级详情
                                        <uni-icons type="right" color="#99A0AD" size="12" />
                                    </view>
                                </view>
                            </view>
                            <view v-else class="course-item-chapter" :class="course.courseType">
                                <view class="course-item-chapter-item ellipsis">
                                    <text class="name">(暂无消课内容)</text>
                                    <view
                                        v-if="['AUDITION', 'ADMIN', 'SUPER_ADMIN'].includes(accountType) && course.courseType === 'more' && !isBanji"
                                        class="btn" @click="toClass(course)">
                                        班级详情
                                        <uni-icons type="right" color="#99A0AD" size="12" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <!-- 试听端、管理端 -->
                    <template v-if="['AUDITION', 'ADMIN', 'SUPER_ADMIN'].includes(accountType)">
                        <view class="section-divider"></view>
                        <view class="expire-date px-28"
                            :class="{ 'warning': getExpiryDateWarning(student.expiryDate) }">
                            {{ '账户有效期：剩余' + getExpiryDate(student.expiryDate) }}
                        </view>
                        <view class="section-divider" />
                        <Remark :student="student" @confirm="getStudent" :custom-style="'margin: 30rpx 28rpx;'"/>
                    </template>
                </scroll-view>
                <view v-if="['AUDITION', 'ADMIN', 'SUPER_ADMIN'].includes(accountType)" class="action">
                    <view v-if="['finish_course_discontinue', 'finish_course_continue'].includes(student.status)"
                        class="finish_course" :class="student.status">
                        <text class="message">
                            {{ student.status === 'finish_course_discontinue' ? '剩余课时结束后清退账户' : '剩余课时结束后生效课程' }}
                        </text>
                        <view class="undo" @click="undo(student.status)">
                            <text>撤销</text>
                            <image src="/static/images/teacher/refresh-blue.png"></image>
                        </view>
                    </view>
                    <template v-else>
                        <view>
                            <picker class="btn cancel picker" :value="disContinueIndex"
                                :range="['立即清退账户', '剩余课时结束后清退账户']" @change="disContinue">
                                不续课
                            </picker>
                            <button class="btn confirm" @click="doContinue">
                                续课
                            </button>
                        </view>
                        <view v-if="!dropFlag" class="drop" @click="dropFlag = true">
                            <image src="/static/images/student/drop.png" />
                        </view>
                        <template v-else>
                            <view>
                                <button class="text" @click="refund">
                                    操作退费
                                </button>
                                <button class="text" @click="edit">
                                    修改信息
                                </button>
                            </view>
                            <view v-if="['ADMIN', 'SUPER_ADMIN'].includes(accountType)">
                                <button class="danger" @click="del">
                                    删除学员
                                </button>
                            </view>
                        </template>
                    </template>
                </view>
                <view v-else class="footer">
                    <button class="btn confirm" @click="close">
                        我知道了
                    </button>
                </view>
            </view>
        </uni-popup>

        <uni-popup v-if="!['AUDITION', 'ADMIN', 'SUPER_ADMIN'].includes(accountType)" ref="grade" type="bottom"
            class="grade">
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

        <ConflictGroup ref="group" :groups="groups" @confirm="groupConfirm" />
    </view>
</template>

<script>
import Remark from '@/components/Remark'
import ConflictGroup from '@/components/ConflictGroup'
import { WEEK_DAY, getExpiryDate, getExpiryDateWarning } from '@/utils/format'

export default {
    components: {
        Remark,
        ConflictGroup
    },
    props: {
        studentId: [String, Number],
        isBanji: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            accountType: '',
            WEEK_DAY,
            detail: {},
            form: {
                grade: "",
                lastExamTime: "",
                examSeason: "",
            },
            disContinueIndex: 0,
            groupId: null,
            groups: [],
            dropFlag: false
        }
    },
    watch: {
        studentId(newVal) {
            if (newVal) {
                this.dropFlag = false
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
        contentStyle() {
            let h = 60
            // 管理端有删除按钮
            // 试听端有操作
            switch (this.accountType) {
                case 'AUDITION':
                    h = 55
                    break;
                case 'ADMIN':
                case 'SUPER_ADMIN':
                    h = 50
                    break;
                default:
                    break;
            }
            return `max-height: ${h}vh;`
        }
    },
    created() {
        const accountType = uni.getStorageSync("accountType")
        this.accountType = accountType
    },
    methods: {
        getExpiryDate,
        getExpiryDateWarning,
        async getStudent() {
            const res = await this.$http.get(
                `/mini/student/getStudentDetail?studentId=${this.studentId}`
            )
            this.detail = res.data ?? {}
        },

        onChange(e) {
            if(!e.show) this.$emit('close')
        },

        close() {
            this.$refs.popup.close()
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

        async disContinue(e) {
            this.disContinueIndex = +e.detail.value
            try {
                const res = await this.$http.get('/mini/teacherGroup/listByStudentPackageId?studentPackageId=' + this.detail.studentPackageId)
                if (res.data?.length) {
                    if (res.data.length > 1) {
                        this.groups = res.data
                        this.$refs.group.open()
                        return
                    }
                    this.groupId = res.data[0].id
                }
                this.disContinueConfirm()
            } finally {
                this.loading = false
            }
        },

        groupConfirm(groupId) {
            this.groupId = groupId
            this.$refs.group.close()
            this.disContinueConfirm()
        },

        async disContinueConfirm() {
            const immediately = this.disContinueIndex === 0
            const data = {
                data: {
                    groupId: this.groupId,
                    immediately,
                    studentId: this.studentId,
                }
            }
            try {
                await this.$http.post('/mini/student/discontinueStudent', data)
                this.$toast({ title: '不续课成功！', icon: 'success' })
                uni.navigateTo({ url: '/pages/success/index?from=disContinue&immediately=' + immediately })
            } catch (err) {
                console.log(err)
            }
        },

        doContinue() {
            uni.navigateTo({ url: '/pages/audition/continue/index?studentId=' + this.studentId })
        },

        refund() {
            uni.navigateTo({ url: '/pages/audition/refund/index?studentId=' + this.studentId })
        },

        edit() {
            uni.navigateTo({ url: '/pages/audition/account/index?studentId=' + this.studentId })
        },

        del() {
            uni.showModal({
                content: '确认删除？',
                confirmText: '确认',
                success: async res => {
                    if (res.confirm) {
                        await this.$http.post('/mini/student/deleteStudent', {
                            data: this.studentId
                        })
                        uni.showToast({ title: '删除成功！', icon: 'success' })
                        this.close()
                        this.$emit('del')
                    }
                }
            })
        },

        // 撤销
        async undo(type) {
            if (this.loading) return
            this.loading = true
            try {
                const data = {
                    data: this.studentId
                }
                const apiName = type === 'finish_course_discontinue' ? 'cancelDiscontinueStudent' : 'cancelContinueStudent'
                await this.$http.post(`/mini/student/${apiName}`, data)
                this.$toast({ title: '撤销成功！', icon: 'success' })
                this.getStudent()
            } finally {
                this.loading = false
            }
        },

        toClass({ courseId, teacherId, timetablePeriodId }) {
            uni.navigateTo({ url: `/pages/audition/banji/index?courseId=${courseId}&teacherId=${teacherId}&timetablePeriodId=${timetablePeriodId}` })
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;
    .title {
        position: relative;
        height: 220rpx;
        padding: 30rpx 30rpx 0 30rpx;

        background-image: url("https://static.gangqintonghua.com/img/beijing/xueyuan-bg.png");
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
                    font-weight: 600;
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
        margin-top: 16rpx;

        .score {
            display: flex;

            .score-item {
                position: relative;
                width: 33.33%;
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
                    font-weight: 600;
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
                    display: flex;
                    justify-content: space-between;

                    font-size: 24rpx;
                    color: #141f33;
                    line-height: 34rpx;
                    margin-bottom: 14rpx;
                    &.warning {
                        font-weight: 600;
                        color: #f15e5e;
                    }
                    text + text {
                        margin-left: 12rpx;
                    }
                }
                &-chapter {
                    &.more {
                        .course-item-chapter-item {
                            display: flex;
                            justify-content: space-between;
                            .name {
                                flex: 1;
                                padding-right: 20rpx;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                    &-item {
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;
                        + .course-item-chapter-item {
                            margin-top: 12rpx;
                        }
                        .btn {
                            font-size: 24rpx;
                            color: #99a0ad;
                            line-height: 34rpx;
                        }
                    }
                }
            }
        }
        .expire-date {
            padding-top: 20rpx;
            padding-bottom: 20rpx;

            font-size: 24rpx;
            color: #141f33;
            line-height: 34rpx;
            &.warning {
                font-weight: 600;
                color: #f15e5e;
            }
        }
    }

    .footer,
    .action {
        padding: 32rpx 48rpx;
        box-shadow: 0px -4rpx 8rpx 0px rgba(0, 0, 0, 0.05);
        .btn {
            height: 72rpx;
            line-height: 72rpx;
            font-size: 32rpx;
            font-weight: 600;
            color: #616b80;
            background-color: #fff;
            border: 1px solid #d3d7e0;
            border-radius: 44rpx;
            padding: 0;
            box-sizing: border-box;
            &::after {
                display: none;
            }
            &.confirm {
                color: #fff;
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
                border-color: inherit;
            }
            &.disabled {
				color: #FFF;
                background: #e1e1e1;
                border-color: inherit;
            }
        }
        .drop {
            padding-top: 24rpx;
            justify-content: center;
            image {
                width: 20rpx;
                height: 24rpx;
            }
        }
    }
    .footer {
        display: flex;
        column-gap: 48rpx;
        .btn {
            flex: 1;
        }
    }
    .action {
        > view {
            display: flex;
            column-gap: 48rpx;
            button {
                flex: 1;
                &::after {
                    display: none;
                }
            }
            .picker {
                flex: 1;
                text-align: center;
            }
        }
        .text {
            font-size: 28rpx;
            color: #99a0ad;
            line-height: 40rpx;
            background: none;
            margin-top: 24rpx;
        }
        .danger {
            height: 68rpx;
            line-height: 68rpx;
            background: #f15e5e;
            border-radius: 12rpx;

            font-size: 32rpx;
            font-weight: 600;
            color: #fff;
            margin-top: 30rpx;
        }
        .finish_course {
            display: flex;
            align-items: center;
            &.finish_course_discontinue {
                color: #99a0ad;
            }
            &.finish_course_continue {
                color: #44be5e;
            }
            .message {
                flex: 1;
                text-align: right;
                font-size: 32rpx;
                font-weight: 600;
                line-height: 44rpx;
                margin-right: 30rpx;
            }
            .undo {
                display: flex;
                align-items: center;
                font-size: 28rpx;
                color: #62bbec;
                line-height: 40rpx;
                image {
                    width: 24rpx;
                    height: 22rpx;
                    margin-left: 8rpx;
                }
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
