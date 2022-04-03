<template>
    <view class="page">
        <view class="page-content">
            <template v-if="step === 0">
                <view class="block">
                    <view class="item">
                        <view class="label">学员姓名：</view>
                        <view class="value border-b">
                            <input v-model="form.studentName" placeholder="请输入姓名或昵称 例：茹茹"
                                placeholder-style="color: #99A0AD;font-size: 32rpx;" maxlength="3">
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">性别：</view>
                        <view class="value gender">
                            <view class="gender-selector">
                                <view v-for="(name, key) in gender" :key="key" class="gender-selector-item"
                                    :class="{ 'gender-selector-item-selected': form.gender === key }"
                                    @click="form.gender = key">
                                    <image class="gender-icon"
                                        :src="`/static/images/student/${key}${form.gender === key ? '' : '-selected'}.png`">
                                    </image>
                                    <text>{{ name }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">出生日期：</view>
                        <view class="value border-b birth">
                            <uni-datetime-picker type="date" :value="form.birthday" :end="dayjsFormat()"
                                @change="e => form.birthday = e">
                                <view class="birth-box">
                                    <text>
                                        <text class="day" :class="{ placeholder: !form.birthday }">
                                            {{
                                                form.birthday ? dayjsFormat(form.birthday, 'YYYY年M月D日') : '例：1994年 6月25日'
                                            }}
                                        </text>
                                        <text v-if="form.birthday" class="age">
                                            {{ form.age }}岁
                                        </text>
                                    </text>
                                    <image class="arrow_down" src="/static/images/audition/arrow_down.png"></image>
                                </view>
                            </uni-datetime-picker>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">手机号码：</view>
                        <view class="value border-b">
                            <input v-model="form.phone" type="number" placeholder="手机号码将作为登录账号"
                                placeholder-style="color: #99A0AD;font-size: 32rpx;" maxlength="11">
                        </view>
                    </view>
                </view>
                <view class="block">
                    <view class="item package-container">
                        <view class="label">选择课程：</view>
                        <view class="value package">
                            <picker class="picker" :value="packageIndex" :range="packages" range-key="packageName"
                                @change="packageChange">
                                <text>{{ form.packageName }}</text>
                                <image src="/static/images/audition/arrow_down.png" />
                            </picker>
                        </view>
                    </view>
                    <template v-if="form.courses.length">
                        <view v-for="(course, index) in form.courses" :key="course.courseId" class="course">
                            <view class="label">
                                <text>
                                    {{ course.courseName }}
                                </text>
                                <text>
                                    {{ course.courseNum + ' ' + '节' }}
                                </text>
                                <view class="action" @click="dialogOpen('course', index)">
                                    <text>修改课时</text>
                                    <image src="/static/images/teacher/edit.png" />
                                </view>
                            </view>
                            <view class="value">
                                <picker class="teacher" :class="{ 'placeholder': !course.teacherName }"
                                    :value="course.teacherIndex" :range="course.teachers" :data-index="index"
                                    range-key="teacherName" @change="teacherChange">
                                    <text>{{ course.teacherName || '选择老师' }}</text>
                                    <image src="/static/images/audition/arrow_down.png" />
                                </picker>
                                <view class="timetable" :class="{ 'placeholder': !course.timetablePeriodId }"
                                    @click="timetableChange(index)">
                                    <text>
                                        {{
                                            course.timetablePeriodId ? '周' + WEEK_DAY[course.dayOfWeek] + ' ' +
                                                course.timetablePeriodName : '请选择该课程上课时间'
                                        }}
                                    </text>
                                    <image src="/static/images/audition/arrow_down.png" />
                                </view>
                            </view>
                        </view>
                    </template>
                    <view class="course expiry">
                        <view class="label">
                            <text>账户有效期</text>
                            <template v-if="!studentId">
                                <text>{{ form.expiryMonths + '个月' }}</text>
                                <view class="action" @click="dialogOpen('expiryMonth')">
                                    <text>修改</text>
                                    <image src="/static/images/teacher/edit.png" />
                                </view>
                            </template>
                            <template v-else>
                                <text>剩余{{ form.expiry.expiryMonths }}个月{{ form.expiry.expiryDays }}天</text>
                                <picker class="action" :value="expiryIndex" :range="['月数', '天数']"
                                    @change="expiryChange">
                                    <text>修改</text>
                                    <image src="/static/images/teacher/edit.png" />
                                </picker>
                            </template>
                        </view>
                        <view class="value">
                            <text>账号有效期至：{{ form.expiryDate }}</text>
                        </view>
                    </view>
                </view>
                <template v-if="studentId">
                    <view class="block form">
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
                    <template v-if="trainTickets.length">
                        <view v-for="(item, index) in trainTickets" :key="index" class="block ticket">
                            <image class="del" src="/static/images/student/cha.png" @click="ticketDel(item, index)" />
                            <view v-if="item.id" class="name">{{ item.ticketName }}</view>
                            <picker v-else class="name" :value="ticketIndex" :range="tickets" range-key="ticketName"
                                @change="ticketChange">
                                {{ item.ticketName }}
                                <image src="/static/images/audition/arrow_down.png" />
                            </picker>
                            <view class="action">
                                <image class="btn minus" src="/static/images/audition/minus.png"
                                    @click="ticketNum(index, 'minus')" />
                                <input type="number" v-model.trim="item.num" maxlength="2" placeholder="1~99" />
                                <image class="btn plus" src="/static/images/audition/plus.png"
                                    @click="ticketNum(index, 'plus')" />
                            </view>
                        </view>
                    </template>
                    <view v-else class="empty" @click="addTrainTickets">添加课程陪练券 +</view>
                </template>
            </template>
            <template v-else>
                <view class="block">
                    <view class="item days">
                        <view class="label">当前学习天数：</view>
                        <view class="value border-b ">
                            <text class="text">{{ form.basicStudyDays }}</text>
                            <text class="unit">天</text>
                            <view class="action" @click="dialogOpen('basicStudyDays')">
                                <text>修改</text>
                                <image src="/static/images/teacher/edit.png" />
                            </view>
                        </view>
                    </view>
                    <view class="item days">
                        <view class="label">当前所学曲目：</view>
                        <view class="value border-b">
                            <text class="text">{{ form.basicStudyChapters }}</text>
                            <text class="unit">曲</text>
                            <view class="action" @click="dialogOpen('basicStudyChapters')">
                                <text>修改</text>
                                <image src="/static/images/teacher/edit.png" />
                            </view>
                        </view>
                    </view>
                </view>
            </template>
        </view>
        <view class="page-footer">
            <template v-if="!studentId">
                <button v-if="step === 0" class="btn " :class="{ confirm: !disabled, disabled }" :disabled="disabled"
                    @click="next">
                    下一步
                </button>
                <button v-else class="btn confirm" @click="confirm">
                    生成合同
                </button>
                <view class="link" @click="toRecord">
                    查看账号开通记录
                    <uni-icons type="right" color="#99A0AD" size="12" />
                </view>
            </template>
            <button v-else class="btn confirm" @click="edit">确认修改</button>
        </view>

        <uni-popup v-if="dialogVisible" ref="popup" type="dialog">
            <uni-popup-dialog mode="input" :value="dialogInputValue" placeholder="最多15个字" :maxlength="15"
                :before-close="true" @close="dialogClose" @confirm="dialogConfirm" />
        </uni-popup>

        <uni-popup ref="timetablePopup" type="bottom">
            <view class="bottom-popup flex flex-column">
                <view class="bottom-popup-title flex align-center">
                    <text class="text">正在选择：</text>
                    <text class="tag inline-flex align-center">{{ timetableCourse.courseName }}</text>
                    <text class="tag inline-flex align-center">{{ timetableCourse.teacherName }}</text>
                </view>
                <view class="bottom-popup-content flex">
                    <view class="bottom-popup-content-left inline-flex flex-column">
                        <view v-for="dayOfWeek in dayOfWeekArr" :key="dayOfWeek.value"
                            :class="{ 'active': dayOfWeek.value === timetableDayOfWeek }"
                            class="bottom-popup-content-left-item inline-flex align-center justify-center"
                            @click="toggleDayOfWeek(dayOfWeek.value)">
                            {{ dayOfWeek.label }}
                        </view>
                    </view>

                    <view class="bottom-popup-content-right flex-1">
                        <view v-for="period in timetablePeriods" :key="period.timetablePeriodId"
                            class="bottom-popup-content-right-item flex align-center justify-between"
                            @click="selectPeriod(period)">
                            <text>{{ period.periodName }}</text>
                            <text
                                v-if="period.courseType === 'one' ? period.remainStudentNum > 1 : period.remainStudentNum > 0"
                                class="num">{{
                                    period.studentNum - period.remainStudentNum
                                }}人</text>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>

        <customTabbar v-if="!studentId" :active="1" />
    </view>
</template>

<script lang="js">
import dayjs from 'dayjs'
import { WEEK_DAY, dayjsFormat } from '@/utils/format'
import { gender } from '@/utils/dicts'
export default {
    data() {
        return {
            loading: false,
            WEEK_DAY,
            gender,

            step: 0,

            packages: [],
            packageIndex: 0,

            form: {
                basicStudyChapters: 0,
                basicStudyDays: 1,
                birthday: '',
                'age': '',
                courses: [],
                expiryMonths: 0,
                gender: '',
                packageId: 0,
                'packageName': '',
                phone: '',
                studentName: '',
                expiryDate: 0,
            },
            dayOfWeekArr: [
                { label: '周二', value: 2 },
                { label: '周三', value: 3 },
                { label: '周四', value: 4 },
                { label: '周五', value: 5 },
                { label: '周六', value: 6 },
                { label: '周日', value: 7 },
            ],

            studentUsableTimetablePeriod: [], // 可选择上课时间
            timetablePeriods: [], // 周x可选择课程
            timetableCourse: {},// 课程+老师
            timetableCourseIndex: 0,
            timetableDayOfWeek: 2,// 当前选择周x

            dialogVisible: false,
            dialogMode: '',
            dialogInputValue: '', // 修改课时输入框默认值
            dialogCourseIndex: 0, // 修改课时对应的课程index

            trainTickets: [], // 已有陪练券
            ticketIndex: 0,
            tickets: [], // 可选陪练券
            deleteTicketIds: [],

            studentId: 0,
            student: {},
            expiryIndex: 0,
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
        if (option?.studentId) {
            this.studentId = option.studentId
            uni.setNavigationBarTitle({
                title: '修改信息'
            })
        }
        this.initOptions()
    },
    computed: {
        disabled() {
            const { studentName, gender, birthday, phone, packageId, courses } = this.form
            if (!studentName || !gender || !birthday || !phone || !packageId || !courses.length) return true

            let coursesValid = false
            for (let i = 0; i < courses.length; i++) {
                const { courseId, courseNum, teacherId, timetableId, timetablePeriodId } = courses[i]
                if (!courseId || !courseNum || !teacherId || !timetableId || !timetablePeriodId) {
                    coursesValid = true
                    break
                }
            }
            return coursesValid
        }
    },
    watch: {
        'form.birthday'(newVal) {
            const [birthYear, birthMonth, birthDay] = newVal.split('-')
            const [curYear, curMonth, curDay] = dayjsFormat().split('-')
            let age = curYear - birthYear
            if (curMonth > birthMonth) {
                age += 1
            } else if (curMonth === birthMonth && curDay > birthDay) {
                age += 1
            }
            this.form.age = age
        }
    },
    methods: {
        dayjsFormat,
        async initOptions() {
            uni.showLoading({ title: '加载中', mask: true })
            try {
                const packageRes = await this.$http.get('/mini/coursePackage/listActive')
                this.packages = packageRes.data ?? []
                if (!this.packages.length) {
                    return uni.showToast({
                        title: '没有找到课程包，请联系管理员',
                        icon: 'none'
                    })
                }
                this.init()
            } finally {
                uni.hideLoading()
            }
        },

        async init() {
            uni.showLoading({ title: '加载中', mask: true })
            try {
                if (this.studentId) {
                    const res = await this.$http.get('/mini/student/getStudentCurrentPackageAndTicket?studentId=' + this.studentId)
                    const { student, coursePackage, phone, trainTickets } = res.data
                    this.student = student
                    const {
                        studentName,
                        gender,
                        birthday,
                        expiryDate,
                        grade,
                        examSeason,
                        lastExamTime,
                    } = student
                    const {
                        id,
                        packageId,
                        packageName,
                        courses: currentCourses
                    } = coursePackage
                    this.form.studentName = studentName
                    this.form.gender = gender
                    this.form.birthday = dayjsFormat(birthday)
                    this.form.phone = phone
                    this.form.packageId = packageId
                    this.$set(this.form, 'oldPackageId', packageId)
                    this.$set(this.form, 'studentPackageId', id)

                    this.form.packageName = packageName
                    // this.form.expiryMonths = expiryMonths
                    this.form.expiryDate = dayjs(expiryDate).format('YYYY年 MM月 DD日')
                    // const diff = dayjs(expiryDate).diff(dayjs(),'day')
                    const days = Math.ceil((expiryDate - new Date().getTime()) / (24 * 60 * 60 * 1000)) + 1
                    this.$set(this.form, 'expiry', {
                        expiryDays: days % 30,
                        expiryMonths: Math.floor(days / 30)
                    })
                    this.$set(this.form, 'grade', grade)
                    this.$set(this.form, 'examSeason', examSeason)
                    this.$set(this.form, 'lastExamTime', lastExamTime)

                    const courses = []
                    for (let i = 0; i < currentCourses.length; i++) {
                        const { courseId, remainCourseNum, courseName, teacherId, teacherName, timetableId, timetablePeriodId, timetablePeriodName, dayOfWeek } = currentCourses[i]
                        const teacherRes = await this.$http.get(`/mini/teacher/listByCourseId?courseId=${courseId}`)
                        const teachers = teacherRes.data ?? []
                        const teacherIndex = teachers.findIndex(_ => _.accountId === teacherId)
                        courses.push({
                            courseId, courseNum: remainCourseNum, courseName,
                            teacherIndex, teacherId, teacherName, teachers,
                            dayOfWeek,
                            timetableId, timetablePeriodId, timetablePeriodName
                        })
                    }
                    this.form.courses = courses
                    this.trainTickets = trainTickets ?? []
                } else {
                    this.form.packageId = this.packages[0].id
                    this.getPackage()
                }
            } finally {
                uni.hideLoading()
            }
        },

        async getPackage() {
            try {
                const res = await this.$http.get(`/mini/coursePackage/getCoursePackage?coursePackageId=${this.form.packageId}`)

                const { courses: tempCourses, coursePackage: { packageName, expiryMonths } } = res.data ?? {}
                const currentCourses = tempCourses.filter(course => course.courseActive) ?? []

                this.form.packageName = packageName
                // 账号有效期至：
                // 新增时 - 当天+课程包月份-1
                // 修改时 - 新课程包: 学生有效期上+课程包月份-1 原课程包：学生有效期（还原）
                if (this.studentId) {
                    const { expiryDate } = this.student
                    if (this.form.packageId === this.form.oldPackageId) {
                        const days = Math.ceil((expiryDate - new Date().getTime()) / (24 * 60 * 60 * 1000))
                        this.$set(this.form, 'expiry', {
                            expiryDays: days % 30,
                            expiryMonths: Math.floor(days / 30)
                        })
                        this.form.expiryDate = dayjs(expiryDate).format('YYYY年 MM月 DD日')
                    } else {
                        this.$set(this.form, 'expiry', {
                            expiryDays: 0,
                            expiryMonths
                        })
                        this.form.expiryDate = dayjs(expiryDate).add(expiryMonths, 'month').subtract(1, 'days').format('YYYY年 MM月 DD日')
                    }
                } else {
                    this.form.expiryMonths = expiryMonths
                    this.form.expiryDate = dayjs().add(expiryMonths, 'month').subtract(1, 'days').format('YYYY年 MM月 DD日')
                }


                const courses = []
                for (let i = 0; i < currentCourses.length; i++) {
                    const { courseId, num: courseNum, courseName } = currentCourses[i]
                    const teacherRes = await this.$http.get(`/mini/teacher/listByCourseId?courseId=${courseId}`)
                    courses.push({
                        courseId, courseNum, courseName,
                        teacherIndex: 0, teacherId: null, teacherName: null, teachers: teacherRes.data ?? [],
                        timetableId: null, timetablePeriodId: null, timetablePeriodName: null
                    })
                }
                this.form.courses = courses
            } catch (error) {
                console.log(error)
            }
        },

        packageChange(e) {
            const value = +e.detail.value
            this.packageIndex = value
            if (this.form.packageId === this.packages[value].id) return
            this.form.packageId = this.packages[value].id
            this.getPackage()
        },

        teacherChange(e) {
            const courseIndex = e.target.dataset.index
            const course = this.form.courses[courseIndex]
            const { teacherName, accountId } = course.teachers[+e.detail.value]

            this.$set(course, 'teacherIndex', +e.detail.value)
            this.$set(course, 'teacherName', teacherName)
            this.$set(course, 'teacherId', accountId)
            this.$set(course, 'timetableId', null)
            this.$set(course, 'timetablePeriodId', null)
            this.$set(course, 'timetablePeriodName', null)

            this.studentUsableTimetablePeriod = undefined
        },

        async timetableChange(courseIndex, dayOfWeek = 2) {
            this.timetableCourseIndex = courseIndex
            this.timetableCourse = this.form.courses[courseIndex]
            const teacherId = this.timetableCourse.teacherId
            const courseId = this.timetableCourse.courseId
            if (!teacherId) {
                return uni.showToast({ title: '请先选择老师', icon: 'none' })
            }
            // 每次重新请求
            const data = {
                courseId, teacherId
            }
            if (this.studentId) data.excludeStudentId = this.studentId
            const timetableRes = await this.$http.post('/mini/courseTimetable/listStudentUsableTimetablePeriod', { data })
            this.studentUsableTimetablePeriod = timetableRes.data
            this.toggleDayOfWeek()
            this.$nextTick(() => {
                this.$refs.timetablePopup.open()
            })
        },

        toggleDayOfWeek(dayOfWeek = 2) {
            this.timetableDayOfWeek = dayOfWeek
            this.timetablePeriods = (this.studentUsableTimetablePeriod.find(item => item.dayOfWeek === dayOfWeek) || {}).periods || []
        },

        selectPeriod(period) {
            const target = this.form.courses[this.timetableCourseIndex]
            const { timetableId, timetablePeriodId, dayOfWeek, periodName } = period
            this.$set(target, 'timetableId', timetableId)
            this.$set(target, 'timetablePeriodId', timetablePeriodId)
            this.$set(target, 'timetablePeriodName', periodName)
            this.$set(target, 'dayOfWeek', dayOfWeek)
            this.$refs.timetablePopup.close()
        },

        dialogOpen(mode, index) {
            this.dialogMode = mode
            switch (mode) {
                case 'course':
                    this.dialogCourseIndex = index
                    this.dialogInputValue = this.form.courses[index].courseNum
                    break
                case 'expiryMonth':
                    this.dialogInputValue = this.form.expiryMonths
                    break
                case 'expiryExpiryMonths':
                    this.dialogInputValue = this.form.expiry.expiryMonths
                    break
                case 'expiryDays':
                    this.dialogInputValue = this.form.expiry.expiryDays
                    break
                case 'basicStudyDays':
                    this.dialogInputValue = this.form.basicStudyDays
                    break
                case 'basicStudyChapters':
                    this.dialogInputValue = this.form.basicStudyChapters
                    break
            }
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.popup.open()
            })
        },

        dialogClose() {
            this.dialogVisible = false
            this.$refs.popup.close()
        },

        dialogConfirm(value) {
            let regExp = /^([1-9]{1}\d{0,4})$/
            let errorMessage = '请输入正确的数字！'
            switch (this.dialogMode) {
                case 'basicStudyChapters':
                    regExp = /^(0|[1-9]{1}\d{0,4})$/
                    break;
                // 0~999
                case 'expiryExpiryMonths':
                    regExp = /^(0|[1-9]{1}\d{0,2})$/
                    break;
                // 1~30
                case 'expiryDays':
                    regExp = /^([1-9]{1}|[1-2]{1}\d|30)$/
                    errorMessage = '请输入1~30的数字！'
                    break;
                default:
                    break;
            }
            if (!regExp.test(+value)) return uni.showToast({ title: errorMessage, icon: 'none' })
            switch (this.dialogMode) {
                case 'course':
                    this.form.courses[this.dialogCourseIndex].courseNum = +value
                    break
                case 'expiryMonth':
                    this.form.expiryMonths = +value
                    this.form.expiryDate = dayjs().add(+value, 'month').format('YYYY年 MM月 DD日')
                    break
                case 'expiryExpiryMonths':
                    this.form.expiry.expiryMonths = +value
                    this.form.expiryDate = this.form.packageId === this.form.oldPackageId
                        ? dayjs().add(+value, 'month').add(+this.form.expiry.expiryDays - 1, 'days').format('YYYY年 MM月 DD日')
                        : dayjs(this.student.expiryDate).add(+value, 'month').add(+this.form.expiry.expiryDays - 1, 'days').format('YYYY年 MM月 DD日')
                    break
                case 'expiryDays':
                    this.form.expiry.expiryDays = +value
                    this.form.expiryDate = this.form.packageId === this.form.oldPackageId
                        ? dayjs().add(+this.form.expiry.expiryMonths, 'month').add(+value - 1, 'days').format('YYYY年 MM月 DD日')
                        : dayjs(this.student.expiryDate).add(+this.form.expiry.expiryMonths, 'month').add(+value - 1, 'days').format('YYYY年 MM月 DD日')
                    break
                case 'basicStudyDays':
                    this.form.basicStudyDays = +value
                    break
                case 'basicStudyChapters':
                    this.form.basicStudyChapters = +value
                    break
            }
            this.dialogClose()
        },

        next() {
            const {
                phone
            } = this.form
            if (!/\d{11}/.test(phone)) return uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })

            this.step += 1
        },

        confirm() {
            uni.setStorageSync('contract', JSON.stringify(this.form))
            uni.navigateTo({
                url: '/pages/audition/contract/index'
            })
        },

        toRecord() {
            uni.navigateTo({ url: `/pages/audition/record/index` })
        },

        async addTrainTickets() {
            try {
                const res = await this.$http.post('/mini/trainTicket/listActive')
                if (res.data?.length) {
                    this.tickets = res.data
                    const { id, ticketName } = res.data[0]
                    this.trainTickets = [{
                        trainTicketId: id,
                        ticketName,
                        num: 1
                    }]
                } else {
                    this.$toast({ title: '暂无可用陪练券！' })
                }
            } catch (error) {

            }
        },

        ticketDel(item, index) {
            if (item.id) this.deleteTicketIds.push(item.id)
            this.trainTickets.splice(index, 1)
        },

        ticketChange(e) {
            const value = +e.detail.value
            if (this.ticketIndex === value) return
            const { id, ticketName } = this.tickets[value]
            this.trainTickets = [{
                trainTicketId: id,
                ticketName,
                num: 1
            }]
        },

        ticketNum(index, type) {
            const num = this.trainTickets[index].num
            if (type === 'minus') {
                if (num === 1) return
                this.trainTickets[index].num--
            } else {
                if (num === 99) return
                this.trainTickets[index].num++
            }
        },

        expiryChange(e) {
            const value = +e.detail.value
            this.expiryIndex = value
            this.dialogOpen(value === 0 ? 'expiryExpiryMonths' : 'expiryDays')
        },

        async edit() {
            const {
                birthday,
                courses,
                examSeason,
                expiry,
                gender,
                grade,
                lastExamTime,
                oldPackageId,
                packageId,
                phone,
                studentName,
                studentPackageId
            } = this.form
            const deleteTicketIds = this.deleteTicketIds
            let ticketValid = true
            const trainTickets = []
            for (let i = 0; i < this.trainTickets.length; i++) {
                const item = this.trainTickets[i]
                if (!/^([1-9]{1}\d{0,1})$/.test(item.num)) {
                    ticketValid = false
                    break
                }
                trainTickets.push({
                    num: item.num,
                    trainTicketId: item.trainTicketId ?? item.id
                })
            }
            if (!ticketValid) return this.$toast({ title: '请输入正确的优惠券个数！', icon: 'none' })
            const data = {
                data: {
                    birthday,
                    courses: courses.map(item => ({
                        courseId: item.courseId,
                        courseNum: item.courseNum,
                        teacherId: item.teacherId,
                        timetableId: item.timetableId,
                        timetablePeriodId: item.timetablePeriodId
                    })),
                    deleteTicketIds,
                    examSeason,
                    expiry,
                    gender,
                    grade,
                    lastExamTime,
                    newPackageId: oldPackageId === packageId ? null : packageId,
                    packageId: oldPackageId,
                    phone,
                    studentId: this.studentId,
                    studentName,
                    studentPackageId,
                    trainTickets
                }
            }
            uni.showLoading({ title: '保存中', mask: true })
            try {
                await this.$http.post('/mini/student/updateStudent', data)
                this.$toast({ title: '修改成功！', icon: 'success' })
                uni.redirectTo({ url: '/pages/success/index?from=update' })
            } finally {
                uni.hideLoading()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    padding-bottom: 100rpx;
    &-content {
        padding: 36rpx 32rpx;
        .block {
            background: #ffffff;
            box-shadow: 0px 0px 12rpx 0px #e3e5e9;
            border-radius: 16rpx;
            padding: 32rpx 16rpx;
            + .block {
                margin-top: 36rpx;
            }
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                // height: 76rpx;
                + .item {
                    margin-top: 40rpx;
                }
                .label {
                    flex-basis: 160rpx;
                    font-size: 32rpx;
                    font-weight: 500;
                    color: #141f33;
                    line-height: 44rpx;
                    margin-right: 8rpx;
                }
                .value {
                    flex: 1;
                    overflow: hidden;
                    padding: 16rpx 28rpx;
                    &.border-b {
                        border-bottom: 2rpx solid #f5f7fa;
                    }
                    input {
                        font-size: 32rpx;
                        color: #141f33;
                        line-height: 44rpx;
                    }
                }
                .gender {
                    padding: 0;

                    &-selector {
                        display: inline-flex;
                        align-items: center;
                        border-radius: 12rpx;
                        background: #f5f7fa;
                        &-item {
                            display: flex;
                            align-items: center;
                            font-size: 28rpx;
                            color: #99a0ad;
                            line-height: 40rpx;
                            background: #f5f7fa;
                            line-height: 20px;
                            padding: 8rpx 28rpx;
                            &:first-child {
                                border-radius: 12rpx 0 0 12rpx;
                            }
                            &:last-child {
                                border-radius: 0 12rpx 12rpx 0;
                            }
                            &.gender-selector-item-selected {
                                color: #fff;
                                background: linear-gradient(
                                    90deg,
                                    #61baec 0%,
                                    #84daee 100%
                                );
                            }
                        }
                    }
                    .gender-selector-divider {
                        width: 2rpx;
                        height: 28rpx;
                        border-right: 2rpx solid #c9ced6;
                    }

                    .gender-icon {
                        width: 24rpx;
                        height: 24rpx;
                        margin-right: 12rpx;
                    }
                }
                .birth {
                    padding-right: 64rpx;
                    font-size: 32rpx;
                    color: #141f33;
                    .birth-box {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .day {
                        font-size: 32rpx;
                        color: #141f33;
                        line-height: 44rpx;
                        &.placeholder {
                            color: #99a0ad;
                        }
                    }
                    .age {
                        border-radius: 10rpx;
                        border: 2rpx solid #62bbec;

                        padding: 0 12rpx;
                        font-size: 28rpx;
                        color: #62bbec;
                        line-height: 40rpx;
                        margin-left: 32rpx;
                    }
                    .arrow_down {
                        width: 20rpx;
                        height: 20rpx;
                    }
                }
                &.package-container {
                    margin-bottom: 50rpx;
                }
                .package {
                    padding: 0;
                    .picker {
                        display: inline-flex;
                        border-radius: 8rpx;
                        border: 2rpx solid #c9ced6;
                        padding: 4rpx 12rpx 4rpx 20rpx;

                        font-size: 28rpx;
                        color: #141f33;
                        line-height: 40rpx;
                        image {
                            width: 20rpx;
                            height: 20rpx;
                            margin-left: 12rpx;
                        }
                    }
                }
                &.days {
                    .label {
                        flex-basis: 230rpx;
                    }
                    .value {
                        display: flex;
                        .text {
                            flex: 1;
                            overflow: hidden;
                            text-align: center;
                        }
                        .unit {
                            margin-left: 60rpx;
                        }
                    }
                    .action {
                        color: #62bbec;
                        font-size: 24rpx;
                        margin-left: 32rpx;
                        image {
                            width: 28rpx;
                            height: 20rpx;
                        }
                    }
                }
            }
            .course {
                + .course {
                    margin-top: 34rpx;
                }
                .label {
                    display: flex;
                    align-items: center;

                    font-size: 28rpx;
                    color: #141f33;
                    line-height: 40rpx;
                    margin-bottom: 20rpx;
                    text + text {
                        margin-left: 16rpx;
                    }
                    .action {
                        font-size: 24rpx;
                        color: #62bbec;
                        margin-left: 16rpx;
                        image {
                            width: 28rpx;
                            height: 20rpx;
                        }
                    }
                }
                .value {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    font-size: 28rpx;
                    color: #99a0ad;
                    line-height: 40rpx;
                    .teacher,
                    .timetable {
                        border-bottom: 2rpx solid #f5f7fa;
                        padding: 0 0 14rpx 6rpx;
                        color: #141f33;
                        line-height: 40rpx;
                        &.placeholder {
                            color: #99a0ad;
                        }
                        image {
                            width: 20rpx;
                            height: 20rpx;
                            margin-left: 12rpx;
                        }
                    }
                    .teacher {
                        width: 154rpx;
                    }
                    .timetable {
                        width: 420rpx;
                        text-align: center;
                    }
                }
            }
        }
        .form {
            &-item {
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
        .ticket {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            .del {
                position: absolute;
                width: 28rpx;
                height: 28rpx;
                top: -14rpx;
                right: -14rpx;
            }
            .name,
            .action {
                border-bottom: 2rpx solid #f5f7fa;
                padding: 0 0 14rpx 6rpx;
                color: #141f33;
                line-height: 40rpx;
            }
            .name {
                width: 264rpx;
                font-size: 28rpx;
                image {
                    width: 20rpx;
                    height: 20rpx;
                    margin-left: 12rpx;
                }
            }
            .action {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 300rpx;
                input {
                    width: 100rpx;
                    text-align: center;
                }
                image {
                    width: 28rpx;
                    height: 28rpx;
                    padding: 0 20rpx;
                }
            }
        }
        .empty {
            margin-top: 36rpx;
            border: 1px dashed #c9ced6;
            font-size: 24rpx;
            color: #99a0ad;
            line-height: 34rpx;
            padding: 18rpx 0;
            text-align: center;
        }
    }
    &-footer {
        padding: 0 52rpx;
        margin-bottom: 16rpx;
        .btn {
            height: 84rpx;
            line-height: 84rpx;
            border-radius: 84rpx;
            font-size: 28rpx;
            margin-bottom: 16rpx;
            &::after {
                display: none;
            }
            &.disabled {
                background: #e1e1e1;
                color: #99a0ad;
            }
            &.confirm {
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
                color: #ffffff;
            }
        }
        .link {
            font-size: 24rpx;
            color: #99a0ad;
            line-height: 34rpx;
            text-align: center;
        }
    }
}
</style>

<style lang="scss">
.bottom-popup {
    //height: calc(728rpx + var(--window-bottom));
    height: inherit;
    background-color: #fff;
    border-radius: 8rpx 0 0 8rpx;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}

.bottom-popup-title {
    height: 128rpx;
    padding: 0 52rpx;
}

.tag {
    height: 56rpx;
    background: #e2f3ff;
    border-radius: 28rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #62bbec;
    padding-left: 16rpx;
    padding-right: 16rpx;
    margin-left: 16rpx;

    &:first-child {
        margin-left: 40rpx;
    }
}

.arrow_down {
    height: 20rpx;
    width: 20rpx;
}

.bottom-popup-content {
    height: 600rpx;
}

.bottom-popup-content-left {
    .bottom-popup-content-left-item {
        width: 200rpx;
        height: 100rpx;

        &.active {
            position: relative;
            background: #f5f7fa;

            &::before {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
                content: "";
                display: inline-flex;
                width: 10rpx;
                height: 100rpx;
                background: #d8d8d8
                    linear-gradient(90deg, #61baec 0%, #84daee 100%);
            }
        }
    }
}

.bottom-popup-content-right {
    height: 600px;
    background: #f5f7fa;

    .bottom-popup-content-right-item {
        height: 100rpx;
        padding: 0 120rpx 0 52rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #141f33;

        .num {
            color: #f15e5e;
        }
    }
}
</style>
