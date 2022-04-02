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
                <view class="btn" @click="toContract">
                    合同详情
                    <uni-icons type="right" color="#99A0AD" size="12" />
                </view>
            </view>
            <view class="main">
                <view v-for="course in coursePackage.courses" :key="course.id" class="course">
                    <view>{{ course.courseName }}</view>
                    <view>
                        <text>{{ course.teacherName }}</text>
                        <text>周{{ WEEK_DAY[course.dayOfWeek] }} {{ course.timetablePeriodName }}</text>
                        <text>剩余{{ course.remainCourseNum }}节</text>
                    </view>
                </view>
                <view
                    class="expiryDate"
                >账户有效期至： {{ dayjsFormat(student.expiryDate, 'YYYY年 MM月 DD日') }}</view>
            </view>
            <view class="refund">
                <text class="title">退费金额：</text>
                <view class="amount">
                    <input
                        v-model="refundAmount"
                        type="number"
                        @input="e => refundAmount = e.detail.value"
                    />
                    <text>元</text>
                </view>
            </view>
        </view>
        <view class="page-footer">
            <button
                class="btn"
                :class="{ confirm: !disabled, disabled }"
                :disabled="disabled"
                @click="valid"
            >确认</button>
        </view>

        <Student :student-id="dialogStudentId" @close="dialogStudentId = 0" />
        <ConflictGroup ref="group" :groups="groups" @confirm="groupConfirm" />
    </view>
</template>

<script>
import Student from '@/components/Student'
import ConflictGroup from '@/components/ConflictGroup'
import { WEEK_DAY, dayjsFormat } from '@/utils/format'
export default {
    components: {
        Student,
        ConflictGroup
    },
    data() {
        return {
            WEEK_DAY,
            defaultCover: 'https://static.gangqintonghua.com/img/touxiang/pic1.webp',
            detail: {},
            studentId: 0,
            dialogStudentId: 0,
            refundAmount: null,
            loading: false,

            groupId: null,
            groups: []
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
            return !/^([1-9]{1}\d{0,6})(\.\d{1,2})?$/.test(this.refundAmount)
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
            } finally {
                uni.hideLoading()
            }
        },

        toContract() {
            const { packageName, courses } = this.coursePackage
            const { studentName, expiryDate } = this.student
            const { phone } = this.detail
            const days = Math.ceil((expiryDate - new Date().getTime()) / (24 * 60 * 60 * 1000))
            const data = {
                packageName,
                courses,
                expiryMonths: Math.floor(days / 30),
                studentName,
                phone
            }
            uni.setStorageSync('contract', JSON.stringify(data))
            uni.navigateTo({ url: '/pages/audition/contract/index?from=refund' })
        },

        async valid() {
            try {
                const res = await this.$http.get('/mini/teacherGroup/listByStudentPackageId?studentPackageId=' + this.coursePackage.id)
                if (res.data?.length) {
                    if (res.data.length > 1) {
                        this.groups = res.data
                        this.$refs.group.open()
                        return
                    }
                    this.groupId = res.data[0].id
                }
                this.confirm()
            } catch (err) {
                console.log(err)
            }
        },

        groupConfirm(groupId) {
            this.groupId = groupId
            this.$refs.group.close()
            this.confirm()
        },

        async confirm() {
            if (this.loading) return
            this.loading = true
            const data = {
                data: {
                    groupId: this.groupId,
                    studentId: this.studentId,
                    refundAmount: this.refundAmount,
                    studentPackageId: this.coursePackage.id
                }
            }
            try {
                await this.$http.post('/mini/student/studentRefund', data)
                this.$toast({ title: '退费成功！', icon: 'success' })
                uni.redirectTo({ url: '/pages/success/index?from=refund' })
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.mb-16 {
    margin-bottom: 16rpx;
}
.page {
    min-height: 100vh;
    background-color: #ffffff;
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
        .package,
        .refund {
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
                text + text {
                    margin-left: 16rpx;
                }
            }
            .course {
                margin-bottom: 32rpx;
                view {
                    line-height: 40rpx;
                    + view {
                        margin-top: 8rpx;
                    }
                }
            }
            .expiryDate {
                line-height: 40rpx;
            }
        }
        .package {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .btn {
                font-size: 24rpx;
                color: #99a0ad;
            }
        }
        .refund {
            display: flex;
            align-items: center;
            .amount {
                display: flex;
                align-items: center;

                border-radius: 8rpx;
                border: 2rpx solid #c9ced6;
                padding: 8rpx 16rpx;

                font-size: 28rpx;
                color: #141f33;
                line-height: 40rpx;

                input {
                    width: 160rpx;
                }
            }
        }
    }
}
</style>
