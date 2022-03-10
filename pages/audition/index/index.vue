<template>
  <view class="page">
    <view class="page-content">

      <view v-show="step === 0" class="form-wrap">
        <form class="form">
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">
                学员姓名：
              </text>
            </view>
            <view class="form-item-value flex-1 border-bottom">
              <input
                v-model="basicForm.studentName"
                placeholder-style="color: #99A0AD;font-size: 16px;line-height: 22px;font-weight: 400;"
                placeholder="请输入姓名或昵称 例：茹茹"
              >
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">
                性别：
              </text>
            </view>
            <view class="form-item-value flex-1 border-bottom">
              <view class="gender-selector">
                <view
                  class="gender-selector-text inline-flex align-center justify-center"
                  :class="{'gender-selector-text-selected': basicForm.gender === 'male'}"
                  @click="() => handleSelectGender('male')"
                >
                  <image v-if="basicForm.gender === 'male'" class="gender-icon" src="/static/images/male.png"></image>
                  <image v-else class="gender-icon" src="/static/images/male_selected.png"></image>
                  <text>男</text>
                </view>

                <text
                  v-if="!basicForm.gender"
                  class="gender-selector-divider"
                />
                <view
                  class="gender-selector-text inline-flex align-center justify-center"
                  :class="{'gender-selector-text-selected': basicForm.gender === 'female'}"
                  @click="() => handleSelectGender('female')"
                >
                  <image v-if="basicForm.gender === 'female'" class="gender-icon" src="/static/images/female.png"></image>
                  <image v-else class="gender-icon" src="/static/images/female_selected.png"></image>
                  <text>女</text>
                </view>
              </view>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">
                出生日期：
              </text>
            </view>
            <view class="form-item-value flex-1 border-bottom pr-60">
              <view class="flex-1">
                <uni-datetime-picker
                  type="date"
                  placeholder="例：1994年 6月25日"
                  :border="false"
                  :clear-icon="false"
                  :value="basicForm.birthday"
                  @change="handleBirthdayChange"
                />
              </view>

              <text
                v-if="basicForm.birthday"
                class="age mr-20"
              >
                {{ basicForm.age }}岁
              </text>
              <image class="arrow_down" src="/static/images/arrow_down.png"></image>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">
                手机号码：
              </text>
            </view>
            <view class="form-item-value  flex-1 border-bottom">
              <input
                v-model="basicForm.phone"
                placeholder-style="color: #99A0AD;font-size: 16px;line-height: 22px;font-weight: 400;"
                placeholder="手机号码将作为登录号码"
              >
            </view>
          </view>
        </form>
      </view>

      <view v-show="step === 0" class="form-wrap">
        <form class="form">
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">
                选择课程：
              </text>
            </view>
            <view class="form-item-value border border-radius-8">
              <picker
                :value="basicForm.packageIndex"
                :range="packages"
                range-key="packageName"
                @change="packagePicker"
              >
                <view class="uni-input">
                  {{ packages[basicForm.packageIndex].packageName }}
                  <image class="arrow_down ml-16" src="/static/images/arrow_down.png"></image>
                </view>
              </picker>

            </view>
          </view>
          <template v-if="Array.isArray(basicForm.courses) && basicForm.courses.length > 0">
            <template v-for="(course, courseIndex) in basicForm.courses">
              <view class="form-item">
                <view class="form-item-label sub-label">
                  <text class="form-item-label-content">
                    {{ course.courseName }}
                  </text>
                  <text class="form-item-label-content ml-16">
                    {{ course.courseNum + ' ' + '节' }}
                  </text>
                  <view
                    class="form-item-action ml-16"
                    :data-index="courseIndex"
                    @click="dialogOpen('course', courseIndex)"
                  >
                    <text class="form-item-action-text">
                      修改课时
                    </text>
                    <image
                      class="form-item-action-icon"
                      src="/static/images/account/edit.png"
                    />
                  </view>
                </view>
              </view>
              <view class="form-item">
                <view class="form-item-value border-bottom pick-teacher">
                  <picker
                    :value="course.teacherIndex"
                    :range="course.teachers"
                    :data-index="courseIndex"
                    range-key="teacherName"
                    @change="teacherPicker"
                  >
                    <view
                      class="uni-input px-4"
                      :class="{'place-holder': !(course.teacherName) }"
                    >
                      {{ course.teacherName || '选择老师' }}
                      <image class="arrow_down ml-16" src="/static/images/arrow_down.png"></image>
                    </view>
                  </picker>
                </view>
                <view class="form-item-value border-bottom pick-timetable">
                  <text :class="{'place-holder': !(course.timetablePeriodName ) }" @click="timetablePicker(courseIndex)">
                    {{ course.timetablePeriodName ? dayOfWeekOBj[course.dayOfWeek] + ' ' + course.timetablePeriodName : '请选择该课程上课时间' }}
                  </text>
                  <image class="arrow_down ml-16" src="/static/images/arrow_down.png"></image>
                </view>
              </view>
            </template>
          </template>
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">账号有效期</text>
              <text class="form-item-label-content ml-16">
                {{ basicForm.expiryMonths + '个月' }}
              </text>
              <view
                class="form-item-action ml-16"
                @click="dialogOpen('expiryMonth')"
              >
                <text class="form-item-action-text">
                  修改
                </text>
                <image
                  class="form-item-action-icon"
                  src="/static/images/account/edit.png"
                />
              </view>
            </view>
          </view>
          <view class="form-item place-holder mt-0">
            <text class="form-item-label-content">账号有效期至：</text>
            <text>{{ basicForm.expiryDate }}</text>
          </view>
        </form>
      </view>

      <view v-show="step === 1" class="form-wrap">
        <form class="form">
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">当前学习天数：</text>
            </view>
            <view class="form-item-value flex-1 border-bottom">
              <text class="value flex-1 inline-flex justify-end">{{ basicForm.basicStudyDays }}</text>
              <text class="unit ml-60">天</text>
              <view class="form-item-action ml-32 mr-40" @click="dialogOpen('basicStudyDays')">
                <text class="form-item-action-text">修改</text>
                <image class="form-item-action-icon" src="/static/images/account/edit.png"/>
              </view>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">
              <text class="form-item-label-content">当前所学曲目：</text>
            </view>
            <view class="form-item-value flex-1 border-bottom">
              <text class="value flex-1 inline-flex justify-end">{{ basicForm.basicStudyChapters }}</text>
              <text class="unit ml-60">曲</text>
              <view class="form-item-action ml-32 mr-40" @click="dialogOpen('basicStudyChapters')">
                <text class="form-item-action-text">修改</text>
                <image class="form-item-action-icon" src="/static/images/account/edit.png"/>
              </view>
            </view>
          </view>
        </form>
      </view>


      <view v-show="step === 0" class="mt-40">
        <button
          class="btn-primary"
          type="primary"
          @click="handleNextStep"
        >
          下一步
        </button>
      </view>

      <view v-show="step === 1" class="mt-40">
        <button
          class="btn-primary"
          type="primary"
          @click="handleSubmit"
        >
          生成合同
        </button>
      </view>

      <view class="footer-link" @click="navToRecord">
        <text>查看账号开通记录 ></text>
      </view>

    </view>
    <view class="tab-bar">
      <view
        v-for="tab in tabBars"
        :key="tab.text"
        class="tab-bar-item"
        @click="() => handleNav(tab)"
      >
        <image
          class="tab-bar-item-icon"
          :src="currentTab.text === tab.text ? tab.selectedIconPath : tab.iconPath"
        />
        <text
          class="tab-bar-item-text"
          :class="currentTab.text === tab.text ? 'selected' : ''"
        >
          {{ tab.text }}
        </text>
      </view>
    </view>

    <uni-popup
      v-if="dialogVisible"
      ref="popup"
      type="dialog"
    >
      <uni-popup-dialog
        mode="input"
        message="成功消息"
        :duration="2000"
        :value="dialogInputValue"
        :before-close="true"
        @close="dialogClose"
        @confirm="dialogConfirm"
      />
    </uni-popup>

    <uni-popup
      v-if="timetablePickerVisible"
      ref="timetablePopup"
      type="bottom"
    >
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
              :class="{'active': dayOfWeek.value === timetableForm.dayOfWeek }"
              class="bottom-popup-content-left-item inline-flex align-center justify-center"
              @click="toggleDayOfWeek(dayOfWeek.value)"
            >
              {{ dayOfWeek.label }}
            </view>
          </view>

          <view class="bottom-popup-content-right flex-1">
            <view
              v-for="period in timetablePeriods"
              :key="period.timetablePeriodId"
              class="bottom-popup-content-right-item flex align-center justify-between"
              @click="selectPeriod(period)"
            >
              <text>{{ period.periodName }}</text>
              <text v-if="period.remainStudentNum > 1" class="num">{{ period.remainStudentNum + '人' }}</text>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      tabBars: [
        {
          pagePath: '/pages/audition/group/index',
          text: '老师课表',
          iconPath: '/static/images/tabBar/kebiao.png',
          selectedIconPath: '/static/images/tabBar/kebiao_selected.png'
        },
        {
          pagePath: '/pages/audition/index/index',
          text: '账号开通',
          iconPath: '/static/images/tabBar/kaitong.png',
          selectedIconPath: '/static/images/tabBar/kaitong_selected.png'
        },
        {
          pagePath: '/pages/audition/index/index',
          text: '学员续费',
          iconPath: '/static/images/tabBar/xufei.png',
          selectedIconPath: '/static/images/tabBar/xufei_selected.png'
        },
      ],
      currentTab: {},
      packages: [],
      selectedPackage: {},
      selectedCourses: [],

      step: 0,

      dialogMode: '',
      dialogVisible: false, // 修改课时输入框
      dialogInputValue: '', // 修改课时输入框默认值
      dialogCourseIndex: 0, // 修改课时对应的课程index

      expiryMonthDialogVisible: false,
      expiryMonthDialogInputValue: '',

      timetablePickerVisible: false, // 选择上课时间
      studentUsableTimetablePeriod: [], // 可选择上课时间

      basicForm: {
        studentName: '',
        phone: '',
        gender: '', // female,male
        birthday: '',
        age: '',

        packageIndex: 0, // 选中的课程包index
        packageId: '',
        packageName: '',
        expiryMonths: 0,
        expiryDate: 0,
        courses: [],

        basicStudyDays: 1,
        basicStudyChapters: 0,
      },

      dayOfWeekOBj: {
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日',
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
      }
    }
  },
  onLoad() {
    const token = uni.getStorageSync('token')
    const accountType = uni.getStorageSync('accountType')
    // const phone = uni.getStorageSync('phone')
    // const userId = uni.getStorageSync('userId')
    console.log('token', token)
    console.log('accountType', accountType)
    // console.log('phone', phone)
    // console.log('userId', userId)

    // 权限验证
    if (!token) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return uni.navigateTo({ url: '/pages/login/index' })
    }

    this.currentTab = this.tabBars[1]
    uni.setNavigationBarTitle({ title: this.tabBars[1].text })
    this.initOptions()
  }
  ,
  methods: {
    async initOptions(initPackageId) {
      if (!initPackageId) {
        const packageRes = await this.$http.get('/mini/coursePackage/listActive', { data: this.phone })
        console.log('packageRes', packageRes)
        this.packages = packageRes.data
        if (!Array.isArray(this.packages) || this.packages.length === 0) {
          return uni.showToast({ title: '没有找到课程包，请联系管理员', icon: 'none' })
        }
      }

      const packageId = initPackageId || this.packages[0].id
      const packageDetailRes = await this.$http.get(`/mini/coursePackage/getCoursePackage?coursePackageId=${ packageId }`)
      console.log('packageDetailRes', packageDetailRes)
      this.selectedPackage = packageDetailRes.data
      const { courses, coursePackage } = this.selectedPackage
      this.selectedCourses = courses.filter(course => course.courseActive)
      const teacherRes = await Promise.all(this.selectedCourses.map(course => this.$http.get(`/mini/teacher/listByCourseId?courseId=${ course.courseId }`)))
      console.log('teacherRes', teacherRes)
      this.basicForm.courses = this.selectedCourses.map((course, index) => ({
        courseId: course.courseId,
        courseName: course.courseName,
        courseNum: course.num,
        teacherIndex: undefined,
        teacherId: '',
        teacherName: '',
        teachers: teacherRes[index].data
      }))
      this.basicForm.packageId = initPackageId || this.packages[0].id
      this.basicForm.packageName = (initPackageId ? this.packages.find(p => p.id === initPackageId) : this.packages[0]).packageName
      this.basicForm.expiryMonths = coursePackage.expiryMonths
      this.basicForm.expiryDate = dayjs().add(coursePackage.expiryMonths, 'month').format('YYYY年 MM月 DD日')
      console.log('this.basicForm', this.basicForm)
    },
    handleNav(tab) {
      console.log('handleNav', tab)
      uni.navigateTo({ url: tab.pagePath })
    },
    navToRecord() {
      uni.navigateTo({ url: `/pages/audition/record/index` })
    },
    formSubmit(e) {
      console.log('formSubmit', e)
    },
    formReset(e) {
      console.log('formReset', e)
    },
    handleSelectGender(gender) {
      this.basicForm.gender = gender
    },
    handleBirthdayChange(e) {
      console.log('handleBirthdayChange', e)
      this.basicForm.birthday = e
      const [birthYear, birthMonth, birthDay] = e.split('-')
      const [curYear, curMonth, curDay] = dayjs().format('YYYY-MM-DD').split('-')
      let age = curYear - birthYear
      if (curMonth > birthMonth) {
        age += 1
      } else if (curMonth === birthMonth && curDay >= birthDay) {
        age += 1
      }
      this.basicForm.age = age
    },
    packagePicker(e) {
      console.log('packagePicker', e)
      this.basicForm.packageIndex = +e.detail.value
      this.initOptions(this.packages[this.basicForm.packageIndex].id)
    },
    teacherPicker(e) {
      console.log('teacherPicker e.detail.value', e.detail.value)
      console.log('teacherPicker e.target.dataset.index', e.target.dataset.index)
      const courseIndex = e.target.dataset.index
      const course = this.basicForm.courses[courseIndex]
      const teacher = course.teachers[+e.detail.value]
      this.basicForm.courses[courseIndex].teacherIndex = +e.detail.value
      this.basicForm.courses[courseIndex].teacherName = teacher.teacherName
      this.basicForm.courses[courseIndex].teacherId = teacher.accountId

      this.basicForm.courses[courseIndex].timetableId = ''
      this.basicForm.courses[courseIndex].timetablePeriodId = ''
      this.basicForm.courses[courseIndex].timetablePeriodName = ''
      this.studentUsableTimetablePeriod = undefined
      console.log('this.basicForm.courses', this.basicForm.courses)
    },

    dialogOpen(mode, index) {
      console.log('index', index);
      console.log('this.basicForm.courses', this.basicForm.courses)
      this.dialogMode = mode
      this.dialogVisible = true

      if (mode === 'course') {
        this.dialogCourseIndex = index
        this.dialogInputValue = this.basicForm.courses[index].courseNum
      }

      switch (mode) {
        case 'course':
          this.dialogCourseIndex = index
          this.dialogInputValue = this.basicForm.courses[index].courseNum
          break
        case 'expiryMonth':
          this.dialogInputValue = this.basicForm.expiryMonths
          break
        case 'basicStudyDays':
          this.dialogInputValue = this.basicForm.basicStudyDays
          break
        case 'basicStudyChapters':
          this.dialogInputValue = this.basicForm.basicStudyChapters
          break
      }

      console.log('this.dialogInputValue', this.dialogInputValue);
      this.$nextTick(() => {
        this.$refs.popup.open()
      })
    },
    dialogClose() {
      // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
      this.$refs.popup.close()
      this.dialogVisible = false
    },
    dialogConfirm(value) {
      console.log(value)
      switch (this.dialogMode) {
        case 'course':
          this.basicForm.courses[this.dialogCourseIndex].courseNum = +value
          break
        case 'expiryMonth':
          this.basicForm.expiryMonths = +value
          this.basicForm.expiryDate = dayjs().add(+value, 'month').format('YYYY年 MM月 DD日')
          break
        case 'basicStudyDays':
          this.basicForm.basicStudyDays = +value
          break
        case 'basicStudyChapters':
          this.basicForm.basicStudyChapters = +value
          break
      }

      this.dialogClose()
    },

    async timetablePicker(courseIndex, dayOfWeek = 2) {
      console.log('this.basicForm.courses', this.basicForm.courses)
      console.log('courseIndex', courseIndex);
      this.timetableCourseIndex = courseIndex
      this.timetableCourse = this.basicForm.courses[courseIndex]
      const teacherId = this.timetableCourse.teacherId
      const courseId = this.timetableCourse.courseId
      if (!teacherId) {
        return uni.showToast({ title: '请先选择老师', icon: 'none' })
      }
      if (!Array.isArray(this.studentUsableTimetablePeriod) || this.studentUsableTimetablePeriod.length === 0) {
        const timetableRes = await this.$http.post('/mini/courseTimetable/listStudentUsableTimetablePeriod', { data: { courseId, teacherId } })
        console.log('timetableRes ---------', timetableRes);
        this.studentUsableTimetablePeriod = timetableRes.data
      }
      console.log('this.studentUsableTimetablePeriod ---------', this.studentUsableTimetablePeriod);
      this.timetablePickerVisible = true
      this.timetablePeriods = (this.studentUsableTimetablePeriod.find(item => item.dayOfWeek === dayOfWeek) || {}).periods || []
      console.log('this.timetablePeriods', this.timetablePeriods);
      this.$nextTick(() => {
        this.$refs.timetablePopup.open()
      })
    },
    async toggleDayOfWeek(dayOfWeek) {
      this.timetableForm.dayOfWeek = dayOfWeek
      // const teacherId = this.timetableCourse.teacherId
      // const timetableRes = await this.$http.post('/mini/courseTimetable/getTeacherDayTimetable', { data: { dayOfWeek, teacherId } })
      this.timetablePeriods = (this.studentUsableTimetablePeriod.find(item => item.dayOfWeek === dayOfWeek)|| {}).periods || []
      console.log('this.timetablePeriods', this.timetablePeriods);
    },
    selectPeriod(period) {
      this.basicForm.courses[this.timetableCourseIndex].timetableId = period.timetableId
      this.basicForm.courses[this.timetableCourseIndex].timetablePeriodId = period.timetablePeriodId
      this.basicForm.courses[this.timetableCourseIndex].timetablePeriodName = period.periodName
      this.basicForm.courses[this.timetableCourseIndex].dayOfWeek = this.timetableForm.dayOfWeek
      this.$refs.timetablePopup.close()
      this.timetablePickerVisible = false

    },
    handleNextStep() {
      console.log('this.basicForm', this.basicForm);
      const {
        studentName,
        phone,
        gender, // female,male
        birthday,
        age,

        packageIndex, // 选中的课程包index
        packageId,
        packageName,
        expiryMonths,
        expiryDate,
        courses,

        basicStudyDays,
        basicStudyChapters,
      } = this.basicForm
      if (!studentName) return uni.showToast({ title: '请输入姓名', icon: 'none' })
      if (!gender) return uni.showToast({ title: '请选择性别', icon: 'none' })
      if (!birthday) return uni.showToast({ title: '请选择出生年月', icon: 'none' })
      if (!phone || !/\d{11}/.test(phone)) return uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })

      let errorMsg = ''
      courses.forEach(course => {
        if (!course.timetablePeriodId) errorMsg = '请选择上课时间'
        if (!course.teacherId) errorMsg = '请选择老师'
        if (!course.courseNum) errorMsg = '请输入课时'
      })
      if (errorMsg) return uni.showToast({ title: errorMsg, icon: 'none' })
      if (!expiryMonths) return uni.showToast({ title: '请选择期限', icon: 'none' })
      this.step += 1
    },

    handleSubmit() {
      console.log('this.basicForm', this.basicForm);
      const {
        studentName,
        phone,
        gender, // female,male
        birthday,
        age,

        packageIndex, // 选中的课程包index
        packageId,
        packageName,
        expiryMonths,
        expiryDate,
        courses,

        basicStudyDays,
        basicStudyChapters,
      } = this.basicForm
      let errorMsg = ''
      if (!studentName) errorMsg = '请输入姓名'
      if (!gender) errorMsg = '请选择性别'
      if (!birthday) errorMsg = '请选择出生年月'
      if (!phone || !/\d{11}/.test(phone)) errorMsg = '请输入正确的手机号码'
      courses.forEach(course => {
        if (!course.timetablePeriodId) errorMsg = '请选择上课时间'
        if (!course.teacherId) errorMsg = '请选择老师'
        if (!course.courseNum) errorMsg = '请输入课时'
      })
      if (!expiryMonths) errorMsg = '请选择期限'
      if (!basicStudyDays) errorMsg = '当前学习天数'
      if (basicStudyChapters === undefined || basicStudyChapters === null) errorMsg = '当前所学曲目'
      if (errorMsg) {
        return uni.showToast({ title: errorMsg, icon: 'none' })
      }

      uni.setStorageSync('contract', JSON.stringify(this.basicForm))
      uni.navigateTo({
        url: '/pages/audition/contract/index'
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding-top: 36rpx;
  background: #F5F7FA;
}

.page-content {
  height: 100vh;
  //height: calc(100vh - 100rpx -  constant(safe-area-inset-bottom));
  //height: calc(100vh - 100rpx - env(safe-area-inset-bottom));
  padding-bottom: 100rpx;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.footer-link {
  height: 70rpx;
  padding-top: 16rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #99A0AD;
  line-height: 36rpx;
  text-align: center;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  background: #F5F7FA;
}
</style>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  z-index: 9;
  bottom: 0;
  display: flex;
  width: 100vw;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 2rpx 0 0 0 rgba(0, 0, 0, 0.1);
  background-color: #FFF;

  image {
    will-change: transform;
  }

  .tab-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //width: 33.33%;
    width: 100%;
    height: 100rpx;

    .tab-bar-item-icon {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 10rpx;
    }

    .tab-bar-item-text {
      width: 100%;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 24rpx;
      font-weight: 400;
      line-height: 36rpx;
      color: #616B80;
      text-align: center;

      &.selected {
        font-weight: 500;
        color: #62BBEC;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.form-wrap {
  width: 686rpx;
  padding-top: 20rpx;
  padding-bottom: 36rpx;
  margin: 0 auto;
  background-color: #FFF;
  border-radius: 16rpx;

  & + .form-wrap {
    margin-top: 36rpx;
  }

  .form-item {
    display: flex;
    align-items: center;
    height: 76rpx;
    padding: 0 20rpx;
    margin-top: 40rpx;

    &:first-child {
      margin-top: 0;
    }

    .form-item-label {
      display: inline-flex;
      align-items: center;
      min-width: 160rpx;
      height: 76rpx;
      margin-right: 8rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 44rpx;
      color: #141F33;

      &.sub-label {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #141F33;
      }
    }

    .form-item-value {
      display: inline-flex;
      //flex: 1;
      align-items: center;
      height: 76rpx;

      input {
        width: 100%;
        padding-left: 35rpx;
      }
    }

    .form-item-action {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #62BBEC;

      .form-item-action-icon {
        width: 28rpx;
        height: 20rpx;
      }
    }
  }
}

.gender-selector {
  display: inline-flex;
  align-items: center;
  height: 56rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-size: 28rpx;
  font-weight: 400;
  color: #99A0AD;
  background: #F5F7FA;
  border-radius: 12rpx;

  .gender-selector-text {
    width: 120rpx;
    background: #F5F7FA;

    &:first-child {
      border-radius: 6px 0 0 6px;
    }

    &:last-child {
      border-radius: 0 6px 6px 0;
    }

    &.gender-selector-text-selected {
      height: 100%;
      color: #FFF;
      background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
    }

  }

  .gender-selector-divider {
    width: 2rpx;
    height: 28rpx;
    border-right: 2rpx solid #C9CED6;
  }

  .gender-icon {
    width: 24rpx;
    height: 24rpx;
    margin-right: 12rpx;
  }
}


.age {
  display: inline-flex;
  align-items: center;
  height: 36rpx;
  border-radius: 10rpx;
  border: 2rpx solid #62BBEC;
  padding: 0 12rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #62BBEC;
}

.pick-teacher {
  width: 288rpx;
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
  background: #E2F3FF;
  border-radius: 28rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #62BBEC;
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
      background: #F5F7FA;

      &::before {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        content: '';
        display: inline-flex;
        width: 10rpx;
        height: 100rpx;
        background: #D8D8D8 linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
      }
    }
  }
}

.bottom-popup-content-right {
  height: 600px;
  background: #F5F7FA;

  .bottom-popup-content-right-item {
    height: 100rpx;
    padding: 0 120rpx 0 52rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #141F33;

    .num {
      color: #F15E5E;
    }
  }
}
</style>
