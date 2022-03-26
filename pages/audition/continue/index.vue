<template>
    <view class="page common">
        <view class="page-header">
            <view class="student">
                <image class="cover" :src="student.coverUrl || defaultCover" />
                <text class="name">{{ student.studentName }}</text>
                <image
                    class="gender-icon"
                    :src="`/static/images/student/${student.gender || 'male'}-selected.png`"
                />
                <text v-if="student.age" class="age">{{ student.age + '岁' }}</text>
            </view>
            <view class="btn" @click="dialogStudentId = studentId">
                学员详情
                <uni-icons type="right" color="#99A0AD" size="12" />
            </view>
        </view>
        <view class="page-content">
            <view class="package">
                <text>
                    <text class="title">当前课程：</text>
                    <text class="name">{{ coursePackage.packageName }}</text>
                </text>
            </view>
            <view class="main">
                <view v-for="course in coursePackage.courses" :key="course.id" class="course">
                    <view>{{ course.courseName }}</view>
                    <view>
                        <text>{{ course.teacherName }}</text>
                        <text>周{{ WEEK_DAY[course.dayOfWeek] }} {{ course.timetablePeriodName }}</text>
                        <text>剩余{{ course.courseNum }}节</text>
                    </view>
                </view>
                <view class="expiryDate">账户有效期至： {{ dayjsFormat(student.expiryDate) }}</view>
            </view>

            <view class="package">
                <text class="title">选择课程：</text>
                <picker
                    class="picker"
                    :value="packageIndex"
                    :range="packages"
                    range-key="packageName"
                    @change="packageChange"
                >
                    <text>{{ form.packageName }}</text>
                    <image src="/static/images/audition/arrow_down.png" />
                </picker>
            </view>
            <view class="package-info">
                <template v-if="form.courses.length">
                    <view
                        v-for="(course, index) in form.courses"
                        :key="course.courseId"
                        class="course"
                    >
                        <view class="label">
                            <text>{{ course.courseName }}</text>
                            <text>{{ course.courseNum + ' ' + '节' }}</text>
                            <view class="action" @click="dialogOpen('course', index)">
                                <text>修改课时</text>
                                <image src="/static/images/teacher/edit.png" />
                            </view>
                        </view>
                        <view class="value">
                            <picker
                                class="teacher"
                                :class="{ 'placeholder': !course.teacherName }"
                                :value="course.teacherIndex"
                                :range="course.teachers"
                                :data-index="index"
                                range-key="teacherName"
                                @change="teacherChange"
                            >
                                <text>{{ course.teacherName || '选择老师' }}</text>
                                <image src="/static/images/audition/arrow_down.png" />
                            </picker>
                            <view
                                class="timetable"
                                :class="{ 'placeholder': !course.timetablePeriodId }"
                                @click="timetableChange(index)"
                            >
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
                        <text>{{ form.expiryMonths + '个月' }}</text>
                        <view class="action" @click="dialogOpen('expiryMonths')">
                            <text>修改</text>
                            <image src="/static/images/teacher/edit.png" />
                        </view>
                    </view>
                    <view class="value">
                        <text>账号有效期至：{{ form.expiryDate }}</text>
                    </view>
                </view>
            </view>

            <template v-if="trainTickets.length">
                <view v-for="(item, index) in trainTickets" :key="index" class="block ticket">
                    <image
                        class="del"
                        src="/static/images/student/cha.png"
                        @click="ticketDel(index)"
                    />
                    <picker
                        class="name"
                        :value="ticketIndex"
                        :range="tickets"
                        range-key="ticketName"
                        @change="ticketChange"
                    >
                        {{ item.ticketName }}
                        <image src="/static/images/audition/arrow_down.png" />
                    </picker>
                    <view class="action">
                        <image
                            class="btn minus"
                            src="/static/images/audition/minus.png"
                            @click="ticketNum(index, 'minus')"
                        />
                        <input
                            type="number"
                            v-model.trim="item.num"
                            maxlength="2"
                            placeholder="1~99"
                        />
                        <image
                            class="btn plus"
                            src="/static/images/audition/plus.png"
                            @click="ticketNum(index, 'plus')"
                        />
                    </view>
                </view>
            </template>
            <view v-else class="empty" @click="addTrainTickets">添加课程陪练券 +</view>
        </view>
        <view class="page-footer">
            <picker
                v-if="!immediatelyConfirm && !disabled"
                class="btn confirm text-center"
                :value="effectiveWayIndex"
                :range="['剩余课时结束后生效课程', '立即生效']"
                @change="effectiveWayChange"
            >生成合同</picker>
            <button
                v-else
                class="btn"
                :class="{ confirm: !disabled, disabled }"
                :disabled="disabled"
                @click="valid"
            >生成合同</button>
        </view>

        <uni-popup v-if="dialogVisible" ref="popup" type="dialog">
            <uni-popup-dialog
                mode="input"
                :value="dialogInputValue"
                placeholder="最多15个字"
                :maxlength="15"
                :before-close="true"
                @close="dialogClose"
                @confirm="dialogConfirm"
            />
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
                        <view
                            v-for="dayOfWeek in dayOfWeekArr"
                            :key="dayOfWeek.value"
                            :class="{ 'active': dayOfWeek.value === timetableForm.dayOfWeek }"
                            class="bottom-popup-content-left-item inline-flex align-center justify-center"
                            @click="toggleDayOfWeek(dayOfWeek.value)"
                        >{{ dayOfWeek.label }}</view>
                    </view>

                    <view class="bottom-popup-content-right flex-1">
                        <view
                            v-for="period in timetablePeriods"
                            :key="period.timetablePeriodId"
                            class="bottom-popup-content-right-item flex align-center justify-between"
                            @click="selectPeriod(period)"
                        >
                            <text>{{ period.periodName }}</text>
                            <text v-if="period.remainStudentNum > 1" class="num">
                                {{
                                    period.remainStudentNum + '人'
                                }}
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>

        <!-- 学生详情 -->
        <Student :student-id="dialogStudentId" @close="dialogStudentId = 0" />

        <ConflictGroup ref="group" :groups="groups" @confirm="groupConfirm" />
    </view>
</template>

<script>
import Student from '@/components/Student'
import ConflictGroup from '@/components/ConflictGroup'
import { WEEK_DAY, dayjsFormat } from '@/utils/format'
import dayjs from 'dayjs'
export default {
    components: {
        Student,
        ConflictGroup
    },
    data() {
        return {
            loading: false,
            WEEK_DAY,
            defaultCover: 'https://static.gangqintonghua.com/img/touxiang/pic1.webp',
            detail: {},
            studentId: 0,
            dialogStudentId: 0,

            packages: [],
            packageIndex: 0,

            form: {
                courses: [],
                packageId: 0,
                packageName: '',
                expiryMonths: 0
            },
            dayOfWeekArr: [
                { label: '周二', value: 2 },
                { label: '周三', value: 3 },
                { label: '周四', value: 4 },
                { label: '周五', value: 5 },
                { label: '周六', value: 6 },
                { label: '周日', value: 7 },
            ],

            timetablePeriods: [],
            timetableCourse: {},
            timetableCourseIndex: 0,

            timetableForm: {
                dayOfWeek: 2,
                timetablePeriodId: 1
            },
            studentUsableTimetablePeriod: [], // 可选择上课时间

            dialogVisible: false,
            dialogMode: '',
            dialogInputValue: '', // 修改课时输入框默认值
            dialogCourseIndex: 0, // 修改课时对应的课程index

            trainTickets: [], // 已有陪练券
            ticketIndex: 0,
            tickets: [], // 可选陪练券

            groupId: null,
            groups: [],

            immediately: true,
            effectiveWayIndex: 0
        }
    },
    computed: {
        student() {
            return this.detail?.student ?? {}
        },
        coursePackage() {
            return this.detail?.coursePackage ?? {}
        },
        disabled() {
            const { packageId, courses } = this.form
            if (!packageId || !courses.length) return true

            let coursesValid = false
            for (let i = 0; i < courses.length; i++) {
                const { courseId, courseNum, teacherId, timetableId, timetablePeriodId } = courses[i]
                if (!courseId || !courseNum || !teacherId || !timetableId || !timetablePeriodId) {
                    coursesValid = true
                    break
                }
            }
            return coursesValid
        },

        immediatelyConfirm() {
            return !this.coursePackage?.packageId || this.coursePackage?.packageId === this.form.packageId
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.studentId = option.studentId
        this.init()
    },
    methods: {
        dayjsFormat,
        async init() {
            uni.showLoading({ title: '加载中', mask: true })
            try {
                const res = await this.$http.get('/mini/student/getStudentCurrentPackageAndTicket?studentId=' + this.studentId)

                this.detail = res.data ?? {}
                this.trainTickets = res.data?.trainTickets ?? []

                const packageRes = await this.$http.get('/mini/coursePackage/listActive')
                this.packages = packageRes.data ?? []
                if (!this.packages.length) {
                    return uni.showToast({
                        title: '没有找到课程包，请联系管理员',
                        icon: 'none'
                    })
                }
                this.form.packageId = this.packages[0].id
                this.getPackage()
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
                this.form.expiryMonths = expiryMonths
                // 账号有效期至：当天+课程包月份-1
                this.form.expiryDate = dayjs().add(expiryMonths, 'month').subtract(1, 'days').format('YYYY年 MM月 DD日')

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
            if (!Array.isArray(this.studentUsableTimetablePeriod) || this.studentUsableTimetablePeriod.length === 0) {
                const timetableRes = await this.$http.post('/mini/courseTimetable/listStudentUsableTimetablePeriod', { data: { courseId, teacherId } })
                this.studentUsableTimetablePeriod = timetableRes.data
            }
            this.timetablePeriods = (this.studentUsableTimetablePeriod.find(item => item.dayOfWeek === dayOfWeek) || {}).periods || []
            this.$nextTick(() => {
                this.$refs.timetablePopup.open()
            })
        },

        toggleDayOfWeek(dayOfWeek) {
            this.timetableForm.dayOfWeek = dayOfWeek
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
                case 'expiryMonths':
                    this.dialogInputValue = this.form.expiryMonths
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
            if (!regExp.test(+value)) return uni.showToast({ title: '请输入正确的数字！', icon: 'none' })
            switch (this.dialogMode) {
                case 'course':
                    this.form.courses[this.dialogCourseIndex].courseNum = +value
                    break
                case 'expiryMonths':
                    this.form.expiryMonths = +value
                    this.form.expiryDate = dayjs().add(+value, 'month').format('YYYY年 MM月 DD日')
                    break
            }
            this.dialogClose()
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

        ticketDel(index) {
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

        effectiveWayChange(e) {
            const value = +e.detail.value
            this.effectiveWayIndex = value
            this.immediately = value === 1
            this.valid()
        },

        // 校验组
        async valid() {
            if (this.loading) return
            this.loading = true
            try {
                const res = await this.$http.get('/mini/teacherGroup/listByStudentPackageId?studentPackageId=' + this.coursePackage.id)
                if (res.data?.length) {
                    this.groups = res.data
                    this.$refs.group.open()
                    return
                }
                this.confirm()
            } finally {
                this.loading = false
            }
        },

        groupConfirm(groupId) {
            this.groupId = groupId
            this.$refs.group.close()
            this.confirm()
        },

        async confirm() {
            const {
                courses,
                expiryMonths,
                packageId,
                packageName
            } = this.form
            let ticketValid = true
            const trainTickets = []
            for (let i = 0; i < this.trainTickets.length; i++) {
                const item = this.trainTickets[i]
                if (!/^([1-9]{1}\d{0,1})$/.test(item.num)) {
                    ticketValid = false
                    break
                }
                trainTickets.push(item)
            }
            if (!ticketValid) return this.$toast({ title: '请输入正确的优惠券个数！', icon: 'none' })
            const { phone } = this.detail
            const { studentId, studentName } = this.student
            const { id: studentPackageId } = this.coursePackage
            const data = {
                studentName,
                phone,
                packageName,

                courses,
                expiryMonths,
                groupId: this.groupId,
                immediately: this.immediately,
                packageId,
                studentId,
                studentPackageId,
                trainTicket: trainTickets[0] ?? null
            }
            uni.setStorageSync('contract', JSON.stringify(data))
            uni.redirectTo({ url: '/pages/audition/contract/index?from=continue' })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background-color: #ffffff;
    padding-bottom: 148rpx;
    &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        box-shadow: 0px -4rpx 8rpx 0px rgba(0, 0, 0, 0.05);
        padding: 26rpx 48rpx 26rpx 32rpx;
        .student {
            display: flex;
            align-items: center;
            .cover {
                width: 60rpx;
                height: 60rpx;
                border-radius: 50%;
                margin-right: 16rpx;
            }
            .name {
                font-size: 32rpx;
                color: #141f33;
                margin-right: 14rpx;
            }
            .gender-icon {
                width: 30rpx;
                height: 28rpx;
                margin-right: 8rpx;
            }
            .age {
                font-size: 28rpx;
                color: #525666;
            }
        }
        .btn {
            font-size: 24rpx;
            color: #99a0ad;
        }
    }
    &-content {
        .package {
            padding: 32rpx 40rpx 16rpx;
            .title {
                font-size: 32rpx;
                font-weight: 500;
                color: #141f33;
                line-height: 44rpx;
            }
            .name {
                background: #f5f7fa;
                border-radius: 4rpx;
                padding: 2rpx 10rpx;
                font-size: 24rpx;
                color: #99a0ad;
                line-height: 40rpx;
            }
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
        .main {
            margin: 0 32rpx;
            background: #f5f7fa;
            border-radius: 16rpx;
            padding: 16rpx 32rpx;
            .course,
            .expiryDate {
                font-size: 28rpx;
                color: #99a0ad;
                line-height: 40rpx;
                text + text {
                    margin-left: 16rpx;
                }
            }
            .course {
                margin-bottom: 32rpx;
                view + view {
                    margin-top: 8rpx;
                }
            }
        }

        .package-info {
            background: #ffffff;
            box-shadow: 0px 0px 12rpx 0px #e3e5e9;
            border-radius: 16rpx;
            margin: 0 32rpx;
            margin-bottom: 36rpx;
            padding: 32rpx 0 32rpx 32rpx;
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
        .ticket {
            background: #ffffff;
            box-shadow: 0px 0px 12rpx 0px #e3e5e9;
            border-radius: 16rpx;
            padding: 32rpx 16rpx;
            margin: 0 32rpx 36rpx;

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
            margin: 0 32rpx 36rpx;
            border: 1px dashed #c9ced6;
            font-size: 24rpx;
            color: #99a0ad;
            line-height: 34rpx;
            padding: 18rpx 0;
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
