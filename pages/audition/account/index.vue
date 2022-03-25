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
                            <text>
                                {{ form.expiryMonths + '个月' }}
                            </text>
                            <view class="action" @click="dialogOpen('expiryMonth')">
                                <text>修改</text>
                                <image src="/static/images/teacher/edit.png" />
                            </view>
                        </view>
                        <view class="value">
                            <text>账号有效期至：{{ form.expiryDate }}</text>
                        </view>
                    </view>
                </view>
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
        </view>

        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog mode="input" :title="dialogTitle" :value="dialogInputValue" placeholder="最多15个字"
                :maxlength="15" :before-close="true" @close="dialogClose" @confirm="dialogConfirm" />
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
                            :class="{ 'active': dayOfWeek.value === timetableForm.dayOfWeek }"
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
                            <text v-if="period.remainStudentNum > 1" class="num">{{
                                period.remainStudentNum + '人'
                            }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>

        <customTabbar :active="1" />
    </view>
</template>

<script lang="js">
import dayjs from 'dayjs'
import { WEEK_DAY, dayjsFormat } from '@/utils/format'
import { gender } from '@/utils/dicts'
export default {
    data() {
        return {
            WEEK_DAY,
            gender,

            step: 0,

            packages: [],
            packageIndex: 0,
            currentPackage: {},
            currentCourses: [],

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
            timetablePeriods: [],
            timetableCourse: {},
            timetableCourseIndex: 0,

            timetableForm: {
                dayOfWeek: 2,
                timetablePeriodId: 1
            },
            studentUsableTimetablePeriod: [], // 可选择上课时间

            dialogTitle: '',
            dialogMode: '',
            dialogInputValue: '', // 修改课时输入框默认值
            dialogCourseIndex: 0, // 修改课时对应的课程index
        }
    },
    onLoad() {
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
            } else if (curMonth === birthMonth && curDay >= birthDay) {
                age += 1
            }
            this.form.age = age
        }
    },
    methods: {
        dayjsFormat,
        async initOptions() {
            try {
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
            } catch (error) {
                console.log(error)
            }
        },

        async getPackage() {
            try {
                const res = await this.$http.get(`/mini/coursePackage/getCoursePackage?coursePackageId=${this.form.packageId}`)
                this.currentPackage = res.data ?? {}

                const { courses, coursePackage } = this.currentPackage
                this.currentCourses = courses.filter(course => course.courseActive) ?? []
                const teacherRes = await Promise.all(this.currentCourses.map(course => this.$http.get(`/mini/teacher/listByCourseId?courseId=${course.courseId}`)))
                this.form.courses = this.currentCourses.map((course, index) => ({
                    courseId: course.courseId,
                    courseNum: course.num,
                    courseName: course.courseName, // 后台不需要
                    teacherIndex: undefined, // 后台不需要
                    teacherId: '',
                    teacherName: '',
                    // "timetableId": 0,
                    // "timetablePeriodId": 0
                    teachers: teacherRes[index].data
                }))

                this.form.packageName = coursePackage.packageName
                this.form.expiryMonths = coursePackage.expiryMonths
                // 账号有效期至：当天+课程包月份-1
                this.form.expiryDate = dayjs().add(coursePackage.expiryMonths, 'month').subtract(1, 'days').format('YYYY年 MM月 DD日')

            } catch (error) {
                console.log(error)
            }
        },

        packageChange(e) {
            const value = +e.detail.value
            this.packageIndex = value
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
            this.$set(course, 'timetableId', '')
            this.$set(course, 'timetablePeriodId', '')
            this.$set(course, 'timetablePeriodName', '')

            this.studentUsableTimetablePeriod = undefined
        },

        async timetableChange(courseIndex, dayOfWeek = 2) {
            console.log('this.form.courses', this.form.courses)
            console.log('courseIndex', courseIndex)
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
            this.$set(target, 'dayOfWeek', dayOfWeek)
            this.$set(target, 'timetablePeriodName', periodName)
            this.$refs.timetablePopup.close()
        },

        dialogOpen(mode, index) {
            this.dialogMode = mode

            if (mode === 'course') {
                this.dialogCourseIndex = index
                this.dialogInputValue = this.form.courses[index].courseNum
            }
            switch (mode) {
                case 'course':
                    this.dialogCourseIndex = index
                    this.dialogInputValue = this.form.courses[index].courseNum
                    break
                case 'expiryMonth':
                    this.dialogInputValue = this.form.expiryMonths
                    break
                case 'basicStudyDays':
                    this.dialogInputValue = this.form.basicStudyDays
                    break
                case 'basicStudyChapters':
                    this.dialogInputValue = this.form.basicStudyChapters
                    break
            }
            this.$nextTick(() => {
                this.$refs.popup.open()
            })
        },

        dialogClose() {
            this.$refs.popup.close()
        },

        dialogConfirm(value) {
            const regExp = this.dialogMode === 'basicStudyChapters'
                ? /^(0|[1-9]{1}\d{0,4})$/
                : /^([1-9]{1}\d{0,4})$/
            if (!regExp.test(+value)) return uni.showToast({ title: '请输入正确的数字！', icon: 'none' })
            switch (this.dialogMode) {
                case 'course':
                    this.form.courses[this.dialogCourseIndex].courseNum = +value
                    break
                case 'expiryMonth':
                    this.form.expiryMonths = +value
                    this.form.expiryDate = dayjs().add(+value, 'month').format('YYYY年 MM月 DD日')
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
                        border-bottom: 1px solid #f5f7fa;
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
