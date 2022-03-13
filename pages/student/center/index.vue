<template>
    <view class="page">
        <view class="header">
            <image class="bg" src="/static/images/student/center-bg.png" />

            <view class="user">
                <image class="cover" :src="student.coverUrl || '/static/images/student/unlock.png'"></image>

                <view class="info">
                    <view class="name">
                        <text class="student">{{student.studentName}}</text>
                        <text class="package">{{coursePackage.packageName}}</text>
                    </view>
                    <view class="msg flex justify-between align-center">
                        <view>
                            <image class="gender" :src="`/static/images/student/${student.gender||'male'}.png`"></image>
                            <text class="age">{{age}}</text>
                        </view>
                        <view>
                            123
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="slogan">
            <image src="/static/images/student/slogan.png"/>
        </view>

        <customTabbar :active="2" />
    </view>
</template>

<script lang="js">
import dayjs from "dayjs"
export default {
    data() {
        return {
            coursePackage: null,
            student: null
        }
    },
    computed:{
        age(){
            return dayjs(this.student?.birthday).format('YYYY-MM-DD')
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
        this.init()
    },
    methods: {
        async init(){
            const userId = uni.getStorageSync('userId')
            const res = await this.$http.get(`/mini/student/getStudentDetail?studentId=${userId}`)
            if(res.ok) {
                const {coursePackage,student,trainTicketNum} = res.data
                this.coursePackage = coursePackage
                this.student = student
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    .notify {
        position: fixed;
        right: 20rpx;
        bottom: 200rpx;
        image {
            width: 96rpx;
            height: 96rpx;
        }
        .count {
            position: absolute;
            top: 20rpx;
            right: 20rpx;

            width: 24rpx;
            height: 24rpx;
            background: #F15E5E;
            border: 1px solid #FFFFFF;
            border-radius: 50%;
            text-align: center;

            font-size: 16rpx;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 24rpx;
        }
    }
    .header {
        position: relative;
        width: 100%;
        height: 630rpx;
        padding-top: 208rpx;
        .bg {
            position: absolute;
            top: 0;
            width: 100%;
            filter: blur(2px);
        }
        .user {
            display: flex;
            position: absolute;
            padding: 0 30rpx;
            .cover {
                width: 120rpx;
                height: 120rpx;
                border-radius: 50%;
                margin-right: 24rpx;
            }
            .info {
                .name {
                    margin: 14rpx 0 20rpx;
                    .student {
                        font-size: 32rpx;
                        font-weight: 500;
                        color: #FFF;
                        line-height: 44rpx;
                        margin-right: 16rpx;
                    }
                    .package {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 20rpx;

                        padding: 6rpx 18rpx;
                        font-size: 20rpx;
                        color: #EFF5FF;
                        line-height: 28rpx;
                    }
                }
                .msg {
                    .gender {
                        width: 28rpx;
                        height: 26rpx;
                        margin-right: 12rpx;
                    }
                    .age {
                        font-size: 28rpx;
                        color: #FFFFFF;
                        line-height: 40rpx;
                    }
                }
            }
        }
    }
    .slogan {
        text-align: center;
        image {
            width: 270px;
            height: 27px;
        }
    }
}
</style>
