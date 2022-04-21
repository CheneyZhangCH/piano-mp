<template>
    <view class="page">
        <view class="page-search">
            <view class="sorts">
                <text
                    v-for="s in sorts"
                    :key="s.name"
                    class="sort"
                    :class="{ active: sortForm.sortBy === s.name }"
                    @click="sortChange(s.name)"
                >{{ s.title }}</text>
            </view>
            <view class="btn" :class="{ filtrateNotEmpty }" @click="filtrate">
                <text>筛选</text>
                <image :src="`/static/images/audition/filtrate${filtrateNotEmpty ? '-blue' : ''}.png`" />
            </view>
        </view>
        <view class="page-content">
            <view v-for="item in list" :key="item.student.studentId" class="student">
                <image class="cover" :src="getStudentCoverUrl(item.student)" />
                <view class="info">
                    <view class="msg">
                        <text class="studentName">{{ item.student.studentName }}</text>
                        <image
                            class="gender"
                            :src="`/static/images/student/${item.student.gender || 'male'}-selected.png`"
                        />
                        <text v-if="item.student.age" class="age">{{ item.student.age + '岁' }}</text>
                        <text class="packageName">{{ item.coursePackage.packageName }}</text>
                        <text class="trainTicketNum">{{ '课程陪练券' + item.trainTicketNum + '张' }}</text>
                    </view>
                    <view class="main">
                        <view
                            v-for="course in item.coursePackage.courses"
                            :key="course.id"
                            class="course"
                            :class="{ 'warning': course.remainCourseNum <= 6 }"
                        >
                            <text>{{ course.courseName }}({{ course.teacherName }})</text>
                            <text>周{{ WEEK_DAY[course.dayOfWeek] }}</text>
                            <text>{{ course.timetablePeriodName }}</text>
                            <text>剩余{{ course.remainCourseNum }}节</text>
                        </view>
                        <view
                            class="course expiryDate"
                            :class="{ 'warning': getExpiryDateWarning(item.student.expiryDate) }"
                        >账号有效期剩余：{{ getExpiryDate(item.student.expiryDate) }}</view>
                    </view>
                    <view class="operation">
                        <view class="left">
                            <Remark :student="item.student" @confirm="handleSearch" />
                        </view>
                        <button class="btn" @click="studentId = item.student.studentId">查看详情</button>
                    </view>
                </view>
            </view>
        </view>

        <customTabbar :active="2" />

        <Student ref="student" :student-id="studentId" @close="studentId = 0" @del="handleSearch" />
        <Filtrate ref="filtrate" :dicts="dicts" @confirm="filtrateConfirm" />
    </view>
</template>

<script>
import Student from "@/components/Student"
import Remark from "@/components/Remark"
import Filtrate from './components/Filtrate.vue'
import { WEEK_DAY, getExpiryDate, getExpiryDateWarning } from '@/utils/format'

export default {
    components: {
        Student,
        Remark,
        Filtrate
    },
    data() {
        return {
            dicts: {},
            WEEK_DAY,
            pageNum: 1,
            pageSize: 10,
            sortForm: {
                sortBy: 'course_num',
                desc: 'asc'
            },
            sorts: [
                { title: '剩余课时-由少到多', name: 'course_num' },
                { title: '账号有效期-由少到多', name: 'expiry_date' },
            ],
            filtrateForm: {
                packageIds: [],
                teacherIds: []
            },

            studentId: 0,

            list: []
        }
    },
    computed: {
        filtrateNotEmpty() {
            return this.filtrateForm.packageIds.length || this.filtrateForm.teacherIds.length
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }

        this.init()
        this.handleSearch()
    },
    onShow() {
        if (this.studentId) {
            this.handleSearch()
            this.$refs.student.getStudent()
        }
    },
    methods: {
        getExpiryDate,
        getExpiryDateWarning,
        async init() {
            try {
                const [teacherRes, packageRes] = await Promise.all([
                    this.$http.get('/mini/teacher/listActive'),
                    this.$http.get('/mini/coursePackage/listActive'),
                ])
                Object.assign(this.dicts, {
                    teachers: teacherRes.data ?? [],
                    packages: packageRes.data ?? []
                })
            } catch (error) {

            }
        },

        sortChange(name) {
            this.sortForm.sortBy = name
            this.pageNum = 1
            this.handleSearch()
        },

        filtrate() {
            this.$refs.filtrate.open()
        },

        filtrateConfirm(form) {
            this.filtrateForm = form
            this.pageNum = 1
            this.handleSearch()
        },

        async handleSearch() {
            const param = {
                page: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    ...this.sortForm
                },
                param: this.filtrateForm
            }
            uni.showLoading({ title: '加载中', mask: true })
            try {
                const res = await this.$http.post('/mini/student/listNeedContinueStudent', param)
                this.list = res.data ?? []
            } finally {
                uni.hideLoading()
                uni.stopPullDownRefresh()
            }
        }
    },
    onPullDownRefresh() {
        this.handleSearch()
    },
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    padding-top: 80rpx;
    padding-bottom: 100rpx;
    &-search {
        position: fixed;
        top: 0;
        width: 100%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        padding: 0 64rpx 0 40rpx;
        .sorts {
            flex: 1;
            display: flex;
            justify-content: space-between;
            margin-right: 64rpx;
            .sort {
                font-size: 24rpx;
                color: #525666;
                &.active {
                    color: #62bbec;
                }
            }
        }
        .btn {
            font-size: 24rpx;
            color: #525666;
            image {
                width: 20rpx;
                height: 22rpx;
                margin-left: 6rpx;
            }
            &.filtrateNotEmpty {
                color: #62bbec;
            }
        }
    }
    &-content {
        padding: 32rpx 24rpx;
        .student {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            border-radius: 16rpx;
            padding: 16rpx 16rpx 24rpx 16rpx;
            + .student {
                margin-top: 50rpx;
            }
            .cover {
                width: 90rpx;
                height: 90rpx;
                border-radius: 50%;
                margin-right: 8rpx;
            }
            .info {
                flex: 1;
                overflow: hidden;
                .msg {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16rpx;
                    .studentName {
                        font-size: 28rpx;
                        font-weight: 500;
                        color: #141f33;
                        line-height: 40rpx;
                        margin-right: 16rpx;
                    }
                    .gender {
                        width: 24rpx;
                        height: 24rpx;
                        margin-right: 8rpx;
                    }
                    .age,
                    .packageName,
                    .trainTicketNum {
                        font-size: 12px;
                        color: #525666;
                    }
                    .age {
                        margin-right: 12rpx;
                    }
                    .packageName {
                        margin-right: 40rpx;
                    }
                }
                .main {
                    border-bottom: 2rpx solid #f5f7fa;
                    padding-bottom: 14rpx;
                    .course {
                        font-size: 12px;
                        color: #141f33;
                        line-height: 34rpx;
                        + .course {
                            margin-top: 16rpx;
                        }
                        text + text {
                            margin-left: 10rpx;
                        }
                        &.warning {
                            font-weight: 500;
                            color: #f15e5e;
                        }
                    }
                }
                .operation {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 14rpx;
                    .left {
                        flex: 1;
                    }
                    .btn {
                        border-radius: 26rpx;
                        border: 2rpx solid #62bbec;
                        background: #fff;

                        padding: 8rpx 24rpx;
                        font-size: 24rpx;
                        color: #62bbec;
                        line-height: 34rpx;
                        margin-left: 20rpx;
                        &::after {
                            display: none;
                        }
                    }
                }
            }
        }
    }
}
</style>
