<template>
  <view class="page">
    <view class="page-title">
      <text
        v-for="day in dayOfWeekArr"
        :key="day.value"
        class="day-of-week"
        :class="{'active': dayOfWeek === day.value}"
        @click="handleToggleDayOfWeek(day)"
      >
        {{ day.label }}
      </text>
    </view>
    <view class="page-content">
      <template v-if="Array.isArray(periods) && periods.length > 0">
        <view v-for="period in periods" :key="period.timetablePeriodId" :class="{'work': period.periodType === 'work'}" class="period-item">
          <template v-if="period.periodType === 'work' && period.oneCourse">
            <image
              class="avatar"
              :src="period.oneCourse.student.coverUrl || '/static/images/course_type_more.png'"
              @click="openStudentDetailDialog(period)"
            ></image>
            <view class="period-main">
              <view
                v-if="['finish_course_discontinue', 'finish_course_continue'].includes(period.oneCourse.student.status)"
                class="period-status"
                :class="period.oneCourse.student.status">即将清退
              </view>
              <view class="period-name">{{ period.periodName }}</view>
              <view class="period-divider"></view>
              <view class="period-content">
                <view class="period-content-title">
                  <text class="student-name">{{ period.oneCourse.student.studentName }}</text>
                  <image v-if="period.oneCourse.student.gender === 'male'" class="gender-icon" src="/static/images/male_selected.png"></image>
                  <image v-if="period.oneCourse.student.gender === 'female'" class="gender-icon" src="/static/images/female_selected.png"></image>
                  <text class="student-age">{{ period.oneCourse.student.age + '岁' }}</text>
                  <text class="student-package-name">{{ period.oneCourse.coursePackage.packageName }}</text>
                </view>
                <view v-if="Array.isArray(period.oneCourse.coursePackage.courses)" class="course ellipsis">
                  <text
                    v-for="course in period.oneCourse.coursePackage.courses"
                    :key="course.courseId"
                    :class="{'warning': course.remainCourseNum < 6}"
                    class="course-item"
                  >
                    {{ course.courseName + '：' + course.remainCourseNum + '节' }}
                  </text>
                </view>
                <view class="expire-date">{{ '账户有效期剩余：' + period.oneCourse.student.expiryDateStr }}</view>
                <view v-if="period.oneCourse.student.remark" class="note px-10" @click="dialogOpen(period.oneCourse.student)">
                  <text>{{ period.oneCourse.student.remark }}</text>
                  <text class="del ml-10"> X</text>
                </view>
                <view v-else class="note-empty" @click="dialogOpen(period.oneCourse.student)">
                  <text>点击添加备注信息(15字内)</text>
                  <image class="edit" src="/static/images/account/edit.png"></image>
                </view>
              </view>
            </view>
          </template>
          <template v-if="period.periodType === 'work' && period.moreCourse">
            <image class="avatar" src="/static/images/course_type_more.png" @click="openBanJiDetailDialog(period)"></image>
            <view class="period-main">
              <view class="period-name">{{ period.periodName }}</view>
              <view class="period-divider"></view>
              <view class="period-content">
                <view class="period-content-title">
                  <text class="student-name">{{ period.moreCourse.course.courseName + (period.remainStudentNum === 0 ? '(满班)' : '') }}</text>
                </view>
                <view v-if="Array.isArray(period.moreCourse.students)" class="course">
                  <text
                    v-for="student in period.moreCourse.students"
                    :key="student.studentId"
                    :class="{ 'warning': student.warning }"
                    class="course-item"
                  >
                    {{ student.studentName }}
                  </text>
                </view>
                <view v-if="Array.isArray(period.moreCourse.chapter)" class="chapter ellipsis">
                  <text
                    v-for="chapter in period.moreCourse.chapter"
                    :key="chapter.chapterId"
                    class="chapter-item"
                  >
                    {{ chapter.chapterName }}
                  </text>
                </view>
                <view v-if="period.moreCourse.startClassDate" class="expire-date">{{ '开班日期：' + period.moreCourse.startClassDateStr }}</view>
              </view>
            </view>
          </template>
          <template v-if="period.periodType === 'rest'">
            <view class="period-rest">
              <view class="period-rest-divider"></view>
              <view class="period-rest-name">{{ period.periodName }}</view>
              <view class="period-rest-divider"></view>
            </view>
          </template>
        </view>
      </template>

      <!--      <view v-show="step === 0" class="form-wrap">-->
      <!--        <form class="form">-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">-->
      <!--                学员姓名：-->
      <!--              </text>-->
      <!--            </view>-->
      <!--            <view class="form-item-value flex-1 border-bottom">-->
      <!--              <input-->
      <!--                v-model="basicForm.studentName"-->
      <!--                placeholder-style="color: #99A0AD;font-size: 16px;line-height: 22px;font-weight: 400;"-->
      <!--                placeholder="请输入姓名或昵称 例：茹茹"-->
      <!--              >-->
      <!--            </view>-->
      <!--          </view>-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">-->
      <!--                性别：-->
      <!--              </text>-->
      <!--            </view>-->
      <!--            <view class="form-item-value flex-1 border-bottom">-->
      <!--              <view class="gender-selector">-->
      <!--                <view-->
      <!--                  class="gender-selector-text inline-flex align-center justify-center"-->
      <!--                  :class="{'gender-selector-text-selected': basicForm.gender === 'male'}"-->
      <!--                  @click="() => handleSelectGender('male')"-->
      <!--                >-->
      <!--                  <image v-if="basicForm.gender === 'male'" class="gender-icon" src="/static/images/male.png"></image>-->
      <!--                  <image v-else class="gender-icon" src="/static/images/male_selected.png"></image>-->
      <!--                  <text>男</text>-->
      <!--                </view>-->

      <!--                <text-->
      <!--                  v-if="!basicForm.gender"-->
      <!--                  class="gender-selector-divider"-->
      <!--                />-->
      <!--                <view-->
      <!--                  class="gender-selector-text inline-flex align-center justify-center"-->
      <!--                  :class="{'gender-selector-text-selected': basicForm.gender === 'female'}"-->
      <!--                  @click="() => handleSelectGender('female')"-->
      <!--                >-->
      <!--                  <image v-if="basicForm.gender === 'female'" class="gender-icon" src="/static/images/female.png"></image>-->
      <!--                  <image v-else class="gender-icon" src="/static/images/female_selected.png"></image>-->
      <!--                  <text>女</text>-->
      <!--                </view>-->
      <!--              </view>-->
      <!--            </view>-->
      <!--          </view>-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">-->
      <!--                出生日期：-->
      <!--              </text>-->
      <!--            </view>-->
      <!--            <view class="form-item-value flex-1 border-bottom pr-60">-->
      <!--              <view class="flex-1">-->
      <!--                <uni-datetime-picker-->
      <!--                  type="date"-->
      <!--                  placeholder="例：1994年 6月25日"-->
      <!--                  :border="false"-->
      <!--                  :clear-icon="false"-->
      <!--                  :value="basicForm.birthday"-->
      <!--                  @change="handleBirthdayChange"-->
      <!--                />-->
      <!--              </view>-->

      <!--              <text-->
      <!--                v-if="basicForm.birthday"-->
      <!--                class="age mr-20"-->
      <!--              >-->
      <!--                {{ basicForm.age }}岁-->
      <!--              </text>-->
      <!--              <image class="arrow_down" src="/static/images/arrow_down.png"></image>-->
      <!--            </view>-->
      <!--          </view>-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">-->
      <!--                手机号码：-->
      <!--              </text>-->
      <!--            </view>-->
      <!--            <view class="form-item-value  flex-1 border-bottom">-->
      <!--              <input-->
      <!--                v-model="basicForm.phone"-->
      <!--                placeholder-style="color: #99A0AD;font-size: 16px;line-height: 22px;font-weight: 400;"-->
      <!--                placeholder="手机号码将作为登录号码"-->
      <!--              >-->
      <!--            </view>-->
      <!--          </view>-->
      <!--        </form>-->
      <!--      </view>-->

      <!--      <view v-show="step === 0" class="form-wrap">-->
      <!--        <form class="form">-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">-->
      <!--                选择课程：-->
      <!--              </text>-->
      <!--            </view>-->
      <!--            <view class="form-item-value border border-radius-8">-->
      <!--              <picker-->
      <!--                :value="basicForm.packageIndex"-->
      <!--                :range="packages"-->
      <!--                range-key="packageName"-->
      <!--                @change="packagePicker"-->
      <!--              >-->
      <!--                <view class="uni-input">-->
      <!--                  {{ packages[basicForm.packageIndex].packageName }}-->
      <!--                  <image class="arrow_down ml-16" src="/static/images/arrow_down.png"></image>-->
      <!--                </view>-->
      <!--              </picker>-->

      <!--            </view>-->
      <!--          </view>-->
      <!--          <template v-if="Array.isArray(basicForm.courses) && basicForm.courses.length > 0">-->
      <!--            <template v-for="(course, courseIndex) in basicForm.courses">-->
      <!--              <view class="form-item">-->
      <!--                <view class="form-item-label sub-label">-->
      <!--                  <text class="form-item-label-content">-->
      <!--                    {{ course.courseName }}-->
      <!--                  </text>-->
      <!--                  <text class="form-item-label-content ml-16">-->
      <!--                    {{ course.courseNum + ' ' + '节' }}-->
      <!--                  </text>-->
      <!--                  <view-->
      <!--                    class="form-item-action ml-16"-->
      <!--                    :data-index="courseIndex"-->
      <!--                    @click="dialogOpen('course', courseIndex)"-->
      <!--                  >-->
      <!--                    <text class="form-item-action-text">-->
      <!--                      修改课时-->
      <!--                    </text>-->
      <!--                    <image-->
      <!--                      class="form-item-action-icon"-->
      <!--                      src="/static/images/account/edit.png"-->
      <!--                    />-->
      <!--                  </view>-->
      <!--                </view>-->
      <!--              </view>-->
      <!--              <view class="form-item">-->
      <!--                <view class="form-item-value border-bottom pick-teacher">-->
      <!--                  <picker-->
      <!--                    :value="course.teacherIndex"-->
      <!--                    :range="course.teachers"-->
      <!--                    :data-index="courseIndex"-->
      <!--                    range-key="teacherName"-->
      <!--                    @change="teacherPicker"-->
      <!--                  >-->
      <!--                    <view-->
      <!--                      class="uni-input px-4"-->
      <!--                      :class="{'place-holder': !(course.teacherName) }"-->
      <!--                    >-->
      <!--                      {{ course.teacherName || '选择老师' }}-->
      <!--                      <image class="arrow_down ml-16" src="/static/images/arrow_down.png"></image>-->
      <!--                    </view>-->
      <!--                  </picker>-->
      <!--                </view>-->
      <!--                <view class="form-item-value border-bottom pick-timetable">-->
      <!--                  <text :class="{'place-holder': !(course.timetablePeriodName ) }" @click="timetablePicker(courseIndex)">-->
      <!--                    {{ course.timetablePeriodName ? dayOfWeekOBj[course.dayOfWeek] + ' ' + course.timetablePeriodName : '请选择该课程上课时间' }}-->
      <!--                  </text>-->
      <!--                  <image class="arrow_down ml-16" src="/static/images/arrow_down.png"></image>-->
      <!--                </view>-->
      <!--              </view>-->
      <!--            </template>-->
      <!--          </template>-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">账号有效期</text>-->
      <!--              <text class="form-item-label-content ml-16">-->
      <!--                {{ basicForm.expiryMonths + '个月' }}-->
      <!--              </text>-->
      <!--              <view-->
      <!--                class="form-item-action ml-16"-->
      <!--                @click="dialogOpen('expiryMonth')"-->
      <!--              >-->
      <!--                <text class="form-item-action-text">-->
      <!--                  修改-->
      <!--                </text>-->
      <!--                <image-->
      <!--                  class="form-item-action-icon"-->
      <!--                  src="/static/images/account/edit.png"-->
      <!--                />-->
      <!--              </view>-->
      <!--            </view>-->
      <!--          </view>-->
      <!--          <view class="form-item place-holder mt-0">-->
      <!--            <text class="form-item-label-content">账号有效期至：</text>-->
      <!--            <text>{{ basicForm.expiryDate }}</text>-->
      <!--          </view>-->
      <!--        </form>-->
      <!--      </view>-->

      <!--      <view v-show="step === 1" class="form-wrap">-->
      <!--        <form class="form">-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">当前学习天数：</text>-->
      <!--            </view>-->
      <!--            <view class="form-item-value flex-1 border-bottom">-->
      <!--              <text class="value flex-1 inline-flex justify-end">{{ basicForm.basicStudyDays }}</text>-->
      <!--              <text class="unit ml-60">天</text>-->
      <!--              <view class="form-item-action ml-32 mr-40" @click="dialogOpen('basicStudyDays')">-->
      <!--                <text class="form-item-action-text">修改</text>-->
      <!--                <image class="form-item-action-icon" src="/static/images/account/edit.png"/>-->
      <!--              </view>-->
      <!--            </view>-->
      <!--          </view>-->
      <!--          <view class="form-item">-->
      <!--            <view class="form-item-label">-->
      <!--              <text class="form-item-label-content">当前所学曲目：</text>-->
      <!--            </view>-->
      <!--            <view class="form-item-value flex-1 border-bottom">-->
      <!--              <text class="value flex-1 inline-flex justify-end">{{ basicForm.basicStudyChapters }}</text>-->
      <!--              <text class="unit ml-60">曲</text>-->
      <!--              <view class="form-item-action ml-32 mr-40" @click="dialogOpen('basicStudyChapters')">-->
      <!--                <text class="form-item-action-text">修改</text>-->
      <!--                <image class="form-item-action-icon" src="/static/images/account/edit.png"/>-->
      <!--              </view>-->
      <!--            </view>-->
      <!--          </view>-->
      <!--        </form>-->
      <!--      </view>-->


      <!--      <view v-show="step === 0" class="mt-40">-->
      <!--        <button-->
      <!--          class="btn-primary"-->
      <!--          type="primary"-->
      <!--          @click="handleNextStep"-->
      <!--        >-->
      <!--          下一步-->
      <!--        </button>-->
      <!--      </view>-->

      <!--      <view v-show="step === 1" class="mt-40">-->
      <!--        <button-->
      <!--          class="btn-primary"-->
      <!--          type="primary"-->
      <!--          @click="handleSubmit"-->
      <!--        >-->
      <!--          生成合同-->
      <!--        </button>-->
      <!--      </view>-->

      <!--      <view class="footer-link" @click="navToRecord">-->
      <!--        <text>查看账号开通记录 ></text>-->
      <!--      </view>-->

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

    <!--  班级详情弹窗  -->
    <uni-popup
      v-if="banJiDetailDialogVisible"
      ref="banJiDetailDialog"
      type="center"
    >
      <view class="center-popup flex flex-column">
        <view class="banji-center-popup-title flex align-center justify-center">
          <text class="text">{{ dayOfWeekOBj[currentBanJi.dayOfWeek] + ' ' + currentBanJi.periodName }}</text>
        </view>
        <view class="banji-center-popup-content px-28">
          <view v-for="student in currentBanJi.moreCourse.students" class="student-item flex align-center">
            <view class="student-name">{{ student.studentName }}</view>
            <view class="student-center inline-flex flex-1 align-center">
              <image v-if="student.gender === 'male'" class="gender-icon mr-8" src="/static/images/male_selected.png"></image>
              <image v-if="student.gender === 'female'" class="gender-icon  mr-8" src="/static/images/female_selected.png"></image>
              <text class="text mr-10">{{ student.age + '岁' }}</text>
              <text class="text">{{ student.packageName }}</text>
            </view>
            <view>
              <button class="student-action inline-flex align-center justify-center p-0" @click="openStudentDetailDialog(student, 'banJi')">查看详情
              </button>
            </view>
          </view>

        </view>
        <view class="center-popup-footer py-30 px-48">
          <button class="btn-primary" type="primary" @click="banJiDetailDialogVisible = false">我知道了</button>
        </view>
      </view>
    </uni-popup>

    <!--  学生详情弹窗  -->
    <uni-popup
      v-if="studentDetailDialogVisible"
      ref="studentDetailDialog"
      type="center"
    >
      <view class="center-popup flex flex-column">
        <view class="center-popup-title flex">
          <image class="avatar" :src="currentStudentDetail.student.coverUrl || '/static/images/course_type_more.png'"></image>
          <view class="center-popup-title-content">
            <view class="center-popup-title-main">
              <text class="student-name">{{ currentStudentDetail.student.studentName }}</text>
              <text class="package-name">{{ currentStudentDetail.coursePackage.packageName }}</text>
            </view>
            <view class="center-popup-title-sub">
              <image v-if="currentStudentDetail.student.gender === 'male'" class="gender-icon" src="/static/images/male_selected.png"></image>
              <image v-if="currentStudentDetail.student.gender === 'female'" class="gender-icon" src="/static/images/female_selected.png"></image>
              <text class="text">{{ currentStudentDetail.student.age + '岁' }}</text>
              <text class="text">{{ '课程陪练券' + currentStudentDetail.trainTicketNum + '张' }}</text>
            </view>
            <text class="close" @click="studentDetailDialogVisible = false">X</text>
          </view>
        </view>
        <view class="center-popup-content">
          <view class="score px-28">
            <view class="score-item">
              <text class="score-item-num">{{ currentStudentDetail.student.handScore || '-' }}</text>
              <text class="score-item-desc">手型平均分</text>
            </view>
            <view class="score-item">
              <text class="score-item-num">{{ currentStudentDetail.student.musicScore || '-' }}</text>
              <text class="score-item-desc">识谱平均分</text>
            </view>
            <view class="score-item">
              <text class="score-item-num">{{ currentStudentDetail.student.attitudeScore || '-' }}</text>
              <text class="score-item-desc">学习态度分</text>
            </view>
          </view>
          <view class="score px-28">
            <view class="score-item">
              <text class="score-item-num">{{ currentStudentDetail.student.finishChapterScore || '-' }}</text>
              <text class="score-item-desc">回课成绩分</text>
            </view>
            <view class="score-item">
              <text class="score-item-num">{{ currentStudentDetail.student.grade ? currentStudentDetail.student.grade + '级' : '-' }}</text>
              <text class="score-item-desc">当前级别</text>
            </view>
            <view class="score-item">
              <text class="score-item-num">{{ currentStudentDetail.student.lastExamTime || '-' }}</text>
              <text class="score-item-desc">上次考级时间</text>
            </view>
          </view>
          <view class="section-divider"></view>
          <view v-if="Array.isArray(currentStudentDetail.coursePackage.courses)" class="chapters px-28">
            <view v-for="course in currentStudentDetail.coursePackage.courses" :key="course.courseId" class="chapter-item">
              <view class="chapter-item-title ellipsis" :class="{'warning': course.remainCourseNum < 6 }">
                <text class="text">{{ course.courseName + '(' + course.teacherName + ')' }}</text>
                <text class="text">{{ dayOfWeekOBj[course.dayOfWeek] + ' ' + course.timetablePeriodName }}</text>
                <text class="text">{{ '剩余' + course.remainCourseNum + '节' }}</text>
              </view>
              <template v-if="Array.isArray(course.chapters)">
                <view v-for="chapter in course.chapters" :key="chapter.id" class="chapter-item-book ellipsis">
                  <text class="chapter-item-book-text">{{ '(' + chapter.bookName + ')' }}</text>
                  <text class="chapter-item-book-text">{{ chapter.chapterName }}</text>
                </view>
              </template>
            </view>
          </view>
          <view class="section-divider"></view>
          <view class="expire-date px-28" :class="{'warning': currentStudentDetail.student.warning }">
            {{ '账户有效期：剩余' + currentStudentDetail.student.expiryDateStr + '天' }}
          </view>
          <view class="section-divider"></view>
          <view class="my-36 px-28">
            <view v-if="currentStudentDetail.student.remark" class="note" @click="dialogOpen(currentStudentDetail)">
              <text>{{ currentStudentDetail.student.remark }}</text>
              <text class="ml-10"> X</text>
            </view>
            <view v-else class="note-empty my-36 px-28" @click="dialogOpen(currentStudentDetail)">
              <text>点击添加备注信息(15字内)</text>
              <image class="edit ml-10" src="/static/images/account/edit.png"></image>
            </view>
          </view>
        </view>
        <view class="center-popup-footer py-30 px-48">
          <button class="popup-footer-btn popup-footer-btn-second" @click="openDiscontinueDialog">不续课</button>
          <button class="popup-footer-btn popup-footer-btn-primary" type="primary" @click="handleSubmit">续课</button>
        </view>
      </view>
    </uni-popup>

    <!--  不续课弹窗  -->
    <uni-popup
      v-if="studentDiscontinueDialogVisible"
      ref="studentDiscontinueDialog"
      type="bottom"
    >
      <view class="flex flex-column discontinue-items">
        <view v-for="reason in discontinueReasons" :key="reason.value" class="discontinue-item" @click="chooseDiscontinueReason(reason)">
          {{ reason.label }}
        </view>
      </view>
    </uni-popup>

    <!--  修改学生备注弹窗  -->
    <uni-popup
      v-if="dialogVisible"
      ref="popup"
      type="dialog"
    >
      <uni-popup-dialog
        mode="input"
        message="成功消息"
        placeholder="最多15个字"
        :duration="2000"
        :value="dialogInputValue"
        :before-close="true"
        @close="dialogClose"
        @confirm="dialogConfirm"
      />
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
      dialogVisible: false, // 弹窗输入框
      dialogInputValue: '', // 弹窗输入框默认值
      dialogStudent: {},

      studentDetailDialogVisible: false, // 学生详情弹窗
      currentStudentDetail: {}, // 当前学生

      banJiDetailDialogVisible: false, // 班级详情弹窗
      currentBanJi: {}, // 当前班级

      studentDiscontinueDialogVisible: false,
      discontinueReasons: [
        { label: '剩余课时结束后清退账户', value: 'after' },
        { label: '立即清退账户', value: 'immediately' },
        { label: '取消', value: 'cancel' },
      ],

      // expiryMonthDialogVisible: false,
      // expiryMonthDialogInputValue: '',

      // timetablePickerVisible: false, // 选择上课时间
      // studentUsableTimetablePeriod: [], // 可选择上课时间

      // basicForm: {
      //   studentName: '',
      //   phone: '',
      //   gender: '', // female,male
      //   birthday: '',
      //   age: '',
      //
      //   packageIndex: 0, // 选中的课程包index
      //   packageId: '',
      //   packageName: '',
      //   expiryMonths: 0,
      //   expiryDate: 0,
      //   courses: [],
      //
      //   basicStudyDays: 1,
      //   basicStudyChapters: 0,
      // },

      dayOfWeekOBj: { 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 7: '周日', },
      dayOfWeekArr: [
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
        { label: '周日', value: 7 },
      ],

      dayOfWeek: 2,
      periods: [],
      teacherId: '',
      teacherName: '',

      timetablePeriods: [],
      timetableCourse: {},
      timetableCourseIndex: 0,
      timetableForm: {
        dayOfWeek: 2,
        timetablePeriodId: 1
      }
    }
  },
  onLoad(options) {
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

    console.log('options', options);
    const { id, name } = (options || {})
    this.teacherId = id
    this.teacherName = name

    // const day = dayjs().day()
    // this.dayOfWeek = day === 1 ? 2 : day
    this.dayOfWeek = 2
    uni.setNavigationBarTitle({ title: name })
    // this.initOptions()
    this.handleSearch()
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
    handleToggleDayOfWeek(day) {
      this.dayOfWeek = day.value
      this.handleSearch()
    },
    async handleSearch() {
      const teacherTimetableRes = await this.$http.post(
        `/mini/courseTimetable/getTeacherDayTimetable`,
        { data: { teacherId: this.teacherId, dayOfWeek: this.dayOfWeek } }
      )
      console.log('teacherTimetableRes', teacherTimetableRes);
      const { periods, dayOfWeek } = (teacherTimetableRes.data || {})
      this.dayOfWeek = dayOfWeek
      if (Array.isArray(periods)) {
        periods.forEach(period => {
          if (period.periodType === 'work' && period.oneCourse) {
            const { expiryDate } = period.oneCourse.student || {}
            period.oneCourse.student.expiryDateStr = this.getExpiryDateStr(expiryDate)
            period.oneCourse.student.expiryDateWarning = dayjs() - expiryDate < 30 * 24 * 60 * 60 * 1000
          }
          if (period.periodType === 'work' && period.moreCourse) {
            const { startClassDate } = period.moreCourse || {}
            period.moreCourse.startClassDateStr = startClassDate ? dayjs(startClassDate).format('YYYY-MM-DD') : ''
          }
        })
      }
      this.periods = periods || []
    },
    getExpiryDateStr(expiryDate) {
      const [expireYear, expireMonth, expireDay] = dayjs(expiryDate).format('YYYY-MM-DD').split('-')
      const [curYear, curMonth, curDay] = dayjs().format('YYYY-MM-DD').split('-')
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
      return [(year * 2 + month) ? (year * 2 + month) + '月' : '', day ? day + '天' : ''].filter(Boolean).join('') || '-'
    },
    handleNav(tab) {
      console.log('handleNav', tab)
      uni.navigateTo({ url: tab.pagePath })
    },

    navToRecord() {
      uni.navigateTo({ url: `/pages/audition/record/index` })
    },
    // formSubmit(e) {
    //   console.log('formSubmit', e)
    // },
    // formReset(e) {
    //   console.log('formReset', e)
    // },
    // handleSelectGender(gender) {
    //   this.basicForm.gender = gender
    // },
    // handleBirthdayChange(e) {
    //   console.log('handleBirthdayChange', e)
    //   this.basicForm.birthday = e
    //   const [birthYear, birthMonth, birthDay] = e.split('-')
    //   const [curYear, curMonth, curDay] = dayjs().format('YYYY-MM-DD').split('-')
    //   let age = curYear - birthYear
    //   if (curMonth > birthMonth) {
    //     age += 1
    //   } else if (curMonth === birthMonth && curDay >= birthDay) {
    //     age += 1
    //   }
    //   this.basicForm.age = age
    // },
    // packagePicker(e) {
    //   console.log('packagePicker', e)
    //   this.basicForm.packageIndex = +e.detail.value
    //   this.initOptions(this.packages[this.basicForm.packageIndex].id)
    // },
    // teacherPicker(e) {
    //   console.log('teacherPicker e.detail.value', e.detail.value)
    //   console.log('teacherPicker e.target.dataset.index', e.target.dataset.index)
    //   const courseIndex = e.target.dataset.index
    //   const course = this.basicForm.courses[courseIndex]
    //   const teacher = course.teachers[+e.detail.value]
    //   this.basicForm.courses[courseIndex].teacherIndex = +e.detail.value
    //   this.basicForm.courses[courseIndex].teacherName = teacher.teacherName
    //   this.basicForm.courses[courseIndex].teacherId = teacher.accountId
    //
    //   this.basicForm.courses[this.timetableCourseIndex].timetableId = ''
    //   this.basicForm.courses[this.timetableCourseIndex].timetablePeriodId = ''
    //   this.basicForm.courses[this.timetableCourseIndex].timetablePeriodName = ''
    //   this.studentUsableTimetablePeriod = undefined
    //   console.log('this.basicForm.courses', this.basicForm.courses)
    // },

    dialogOpen(student) {
      // this.dialogMode = mode
      // console.log('period', period);
      // const { oneCourse } = period
      this.dialogInputValue = student.remark
      this.dialogVisible = true
      this.dialogStudent = student
      console.log('this.dialogInputValue', this.dialogInputValue)
      console.log('this.dialogVisible', this.dialogVisible)
      this.$nextTick(() => {
        this.$refs.popup.open()
      })
    },
    dialogClose() {
      // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
      this.$refs.popup.close()
      this.dialogVisible = false
    },
    async dialogConfirm(value) {
      console.log('dialogConfirm', value)
      if (!value || value.length > 15) {
        return uni.showToast({ title: '备注不能超过15个字', icon: 'none' })
      }
      const studentId = this.dialogStudent.accountId
      await this.$http.post('/mini/student/updateStudentRemark', { data: { remark: value, studentId } })
      this.dialogClose()
      this.handleSearch()
    },

    async openStudentDetailDialog(period, from) {
      console.log('period', period);
      console.log('from', from);
      const studentId = from === 'banJi' ? period.studentId : period.oneCourse.student.accountId
      const studentDetailRes = await this.$http.get(`/mini/student/getStudentDetail?studentId=${ studentId }`)
      console.log('studentDetailRes', studentDetailRes);
      this.studentDetailDialogVisible = true
      this.currentStudentDetail = studentDetailRes.data
      const { expiryDate } = studentDetailRes.data
      this.currentStudentDetail.student.expiryDateStr = this.getExpiryDateStr(expiryDate)
      this.currentStudentDetail.student.expiryDateWarning = dayjs() - expiryDate < 30 * 24 * 60 * 60 * 1000
      this.$nextTick(() => {
        this.$refs.studentDetailDialog.open()
      })
    },

    openBanJiDetailDialog(period) {
      console.log('period', period);
      this.currentBanJi = period
      this.banJiDetailDialogVisible = true
      this.$nextTick(() => {
        this.$refs.banJiDetailDialog.open()
      })
    },

    openDiscontinueDialog() {
      this.studentDiscontinueDialogVisible = true
      this.$nextTick(() => {
        this.$refs.studentDiscontinueDialog.open()
      })
    },
    closeDiscontinueDialog() {
      this.$refs.studentDiscontinueDialog.close()
      this.studentDiscontinueDialogVisible = false
    },
    async chooseDiscontinueReason(reason) {
      if (reason.value === 'cancel') return this.closeDiscontinueDialog()

      const params = { studentId: this.currentStudentDetail.student.accountId }
      params.immediately = reason.value === 'immediately'
      await this.$http.post(`/mini/student/discontinueStudent`, { data: params })
      uni.showToast({ title: '操作成功', icon: 'none' })
      this.closeDiscontinueDialog()
    },


    // async timetablePicker(courseIndex, dayOfWeek = 2) {
    //   console.log('this.basicForm.courses', this.basicForm.courses)
    //   console.log('courseIndex', courseIndex);
    //   this.timetableCourseIndex = courseIndex
    //   this.timetableCourse = this.basicForm.courses[courseIndex]
    //   const teacherId = this.timetableCourse.teacherId
    //   const courseId = this.timetableCourse.courseId
    //   if (!teacherId) {
    //     return uni.showToast({ title: '请先选择老师', icon: 'none' })
    //   }
    //   if (!Array.isArray(this.studentUsableTimetablePeriod) || this.studentUsableTimetablePeriod.length === 0) {
    //     const timetableRes = await this.$http.post('/mini/courseTimetable/listStudentUsableTimetablePeriod', { data: { courseId, teacherId } })
    //     console.log('timetableRes ---------', timetableRes);
    //     this.studentUsableTimetablePeriod = timetableRes.data
    //   }
    //   console.log('this.studentUsableTimetablePeriod ---------', this.studentUsableTimetablePeriod);
    //   this.timetablePickerVisible = true
    //   this.timetablePeriods = (this.studentUsableTimetablePeriod.find(item => item.dayOfWeek === dayOfWeek) || {}).periods || []
    //   console.log('this.timetablePeriods', this.timetablePeriods);
    //   this.$nextTick(() => {
    //     this.$refs.timetablePopup.open()
    //   })
    // },
    // async toggleDayOfWeek(dayOfWeek) {
    //   this.timetableForm.dayOfWeek = dayOfWeek
    //   // const teacherId = this.timetableCourse.teacherId
    //   // const timetableRes = await this.$http.post('/mini/courseTimetable/getTeacherDayTimetable', { data: { dayOfWeek, teacherId } })
    //   this.timetablePeriods = (this.studentUsableTimetablePeriod.find(item => item.dayOfWeek === dayOfWeek) || {}).periods || []
    //   console.log('this.timetablePeriods', this.timetablePeriods);
    // },
    // selectPeriod(period) {
    //   this.basicForm.courses[this.timetableCourseIndex].timetableId = period.timetableId
    //   this.basicForm.courses[this.timetableCourseIndex].timetablePeriodId = period.timetablePeriodId
    //   this.basicForm.courses[this.timetableCourseIndex].timetablePeriodName = period.periodName
    //   this.basicForm.courses[this.timetableCourseIndex].dayOfWeek = this.timetableForm.dayOfWeek
    //   this.$refs.timetablePopup.close()
    //   this.timetablePickerVisible = false
    //
    // },
    // handleNextStep() {
    //   console.log('this.basicForm', this.basicForm);
    //   const {
    //     studentName,
    //     phone,
    //     gender, // female,male
    //     birthday,
    //     age,
    //
    //     packageIndex, // 选中的课程包index
    //     packageId,
    //     packageName,
    //     expiryMonths,
    //     expiryDate,
    //     courses,
    //
    //     basicStudyDays,
    //     basicStudyChapters,
    //   } = this.basicForm
    //   if (!studentName) return uni.showToast({ title: '请输入姓名', icon: 'none' })
    //   if (!gender) return uni.showToast({ title: '请选择性别', icon: 'none' })
    //   if (!birthday) return uni.showToast({ title: '请选择出生年月', icon: 'none' })
    //   if (!phone || !/\d{11}/.test(phone)) return uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    //
    //   let errorMsg = ''
    //   courses.forEach(course => {
    //     if (!course.timetablePeriodId) errorMsg = '请选择上课时间'
    //     if (!course.teacherId) errorMsg = '请选择老师'
    //     if (!course.courseNum) errorMsg = '请输入课时'
    //   })
    //   if (errorMsg) return uni.showToast({ title: errorMsg, icon: 'none' })
    //   if (!expiryMonths) return uni.showToast({ title: '请选择期限', icon: 'none' })
    //   this.step += 1
    // },
    //
    // handleSubmit() {
    //   console.log('this.basicForm', this.basicForm);
    //   const {
    //     studentName,
    //     phone,
    //     gender, // female,male
    //     birthday,
    //     age,
    //
    //     packageIndex, // 选中的课程包index
    //     packageId,
    //     packageName,
    //     expiryMonths,
    //     expiryDate,
    //     courses,
    //
    //     basicStudyDays,
    //     basicStudyChapters,
    //   } = this.basicForm
    //   let errorMsg = ''
    //   if (!studentName) errorMsg = '请输入姓名'
    //   if (!gender) errorMsg = '请选择性别'
    //   if (!birthday) errorMsg = '请选择出生年月'
    //   if (!phone || !/\d{11}/.test(phone)) errorMsg = '请输入正确的手机号码'
    //   courses.forEach(course => {
    //     if (!course.timetablePeriodId) errorMsg = '请选择上课时间'
    //     if (!course.teacherId) errorMsg = '请选择老师'
    //     if (!course.courseNum) errorMsg = '请输入课时'
    //   })
    //   if (!expiryMonths) errorMsg = '请选择期限'
    //   if (!basicStudyDays) errorMsg = '当前学习天数'
    //   if (basicStudyChapters === undefined || basicStudyChapters === null) errorMsg = '当前所学曲目'
    //   if (errorMsg) {
    //     return uni.showToast({ title: errorMsg, icon: 'none' })
    //   }
    //
    //   uni.setStorageSync('contract', JSON.stringify(this.basicForm))
    //   uni.navigateTo({
    //     url: '/pages/audition/contract/index'
    //   })
    // }

  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding-top: 110rpx;
  background: #F5F7FA;
}

.page-title {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  background: #FFFFFF;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #99A0AD;

  .day-of-week {
    &.active {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #141F33;
    }
  }
}

.page-content {
  height: 100vh;
  //height: calc(100vh - 100rpx -  constant(safe-area-inset-bottom));
  //height: calc(100vh - 100rpx - env(safe-area-inset-bottom));
  padding-bottom: 100rpx;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.period-item {
  position: relative;
  margin: 20rpx 30rpx 0 30rpx;
  padding-top: 16rpx;

  .avatar {
    position: absolute;
    width: 76rpx;
    height: 76rpx;
    left: 196rpx;
    top: 0;
    z-index: 1;
  }

  .period-main {
    position: relative;
    display: flex;
    align-items: center;
    background: #FFFFFF;
    box-shadow: 0 0 8rpx 0 #E3E5E9;
    border-radius: 16rpx;
    padding: 10rpx;

    .period-status {
      position: absolute;
      top: 0;
      left: 0;
      height: 36rpx;
      display: inline-flex;
      align-items: center;
      padding-left: 14rpx;
      padding-right: 14rpx;
      background: #F15E5E;
      border-radius: 16rpx 0 16rpx 0;

      &.finish_course_discontinue {
        background: #99A0AD;
      }

      &.finish_course_continue {
        background: #44BE5E;;
      }
    }

    .period-name {
      width: 156rpx;
      line-height: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #141F33;
    }

    .period-divider {
      width: 2rpx;
      height: 40rpx;
      border-right: 2rpx solid #C9CED6;
      margin-left: 10rpx;
    }

    .period-content {
      width: 500rpx;
      padding-left: 12rpx;

      .period-content-title {
        display: flex;
        align-items: center;
        height: 40rpx;
        padding-left: 100rpx;

        .student-name {
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #141F33;
        }

        .gender-icon {
          width: 24rpx;
          height: 24rpx;
          margin-left: 24rpx;
        }

        .student-age, .student-package-name {
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #525666;
          margin-left: 8rpx;
        }
      }

      .course {
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 36rpx;
        margin-top: 28rpx;

        .course-item {
          font-size: 24rpx;
          color: #525666;

          &.warning {
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #F15E5E
          }

          & + .course-item {
            margin-left: 36rpx;
          }
        }
      }

      .expire-date {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #525666;
        line-height: 36rpx;
        margin-top: 10rpx;

        &.warning {
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #F15E5E;
        }
      }

      .note, .note-empty {
        margin-top: 10rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 36rpx;
      }

      .note {
        display: inline-flex;
        color: #367AA0;
        background-color: rgba(226, 243, 255, 0.58);

        .del {
          //width: 10rpx;
          //height: 20rpx;

          //&:first-child {
          //  margin-left: 14rpx;
          //}
        }
      }

      .note-empty {
        color: #99A0AD;

        .edit {
          width: 20rpx;
          height: 20rpx;
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
      color: #C9CED6;
    }

    .period-rest-divider {
      flex: 1;
      border-bottom: 2rpx solid #E3E5E9;
    }
  }
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
.timetable-popup {
  //height: calc(728rpx + var(--window-bottom));
  height: inherit;
  background-color: #fff;
  border-radius: 8rpx 0 0 8rpx;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.timetable-popup-title {
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

.timetable-popup-content {
  height: 600rpx;
}

.timetable-popup-content-left {
  .timetable-popup-content-left-item {
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

.timetable-popup-content-right {
  height: 600px;
  background: #F5F7FA;

  .timetable-popup-content-right-item {
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

<!-- center-popup样式 -->
<style lang="scss">
.center-popup {
  width: 650rpx;
  background: #FFFFFF;
  border-radius: 32rpx;;
}

.center-popup-title {
  height: 200rpx;
  padding: 30rpx 30rpx 0 30rpx;
  position: relative;

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
        color: #EFF5FF;
        line-height: 36rpx;
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

.center-popup-content {
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
        content: '';
        display: inline-block;
        width: 2rpx;
        height: 20rpx;
        border-right: 2rpx solid #C9CED6;
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
        color: #141F33;
        line-height: 40rpx;
        text-align: center;
      }

      .score-item-desc {
        height: 36rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #99A0AD;
        line-height: 36rpx;
        text-align: center;
      }
    }
  }

  .section-divider {
    width: 600rpx;
    height: 2rpx;
    border-top: 2rpx dashed #E3E5E9;
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
        color: #141F33;
        line-height: 36rpx;

        &.warning {
          font-weight: 500;
          color: #F15E5E;
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
        color: #99A0AD;
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
    color: #141F33;;
    line-height: 36rpx;

    &.warning {
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #F15E5E;
    }
  }

  .note, .note-empty {
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 36rpx;
  }

  .note {
    display: inline-flex;
    color: #367AA0;
    background-color: rgba(226, 243, 255, 0.58);

    .del {
    }
  }

  .note-empty {
    color: #99A0AD;

    .edit {
      width: 20rpx;
      height: 20rpx;
    }
  }
}

.center-popup-footer {
  display: flex;
  justify-content: space-between;
}

.banji-center-popup-title {
  height: 88rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #141F33;
}

.banji-center-popup-content {
  padding-top: 32rpx;
  padding-bottom: 68rpx;

  .student-item {
    display: flex;
    align-items: center;

    & + .student-item {
      margin-top: 32rpx;
    }

    .student-name {
      width: 144rpx;
      height: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #141F33;
      line-height: 40rpx;
    }

    .student-center {
      .gender-icon {
        width: 24rpx;
        height: 24rpx;
      }

      .text {
        height: 36rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #525666;
        line-height: 36rpx;
      }
    }

    .student-action {
      width: 128rpx;
      height: 44rpx;
      border-radius: 8rpx;
      border: 1px solid #62BBEC;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #62BBEC;
      background-color: #FFF;
    }
  }


}

.banji-center-popup-footer {
  display: flex;
  justify-content: space-between;
}

</style>

<!-- 不续费弹窗样式 -->
<style lang="scss">
.discontinue-items {
  background-color: #FFF;
  border-radius: 8px 8px 0px 0px;;

  .discontinue-item {
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #525666;
    border-bottom: 2rpx solid #F3F3F3;

    &:last-child {
      border-bottom: none;
    }
  }
}


</style>
