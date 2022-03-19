<template>
    <view class="page">
        <view class="page-content">
            <view class="item" v-for="item in list" :key="item.id">
                <view class="name">{{ item.packageName }}</view>
                <view class="total updown">
                    <text class="num">{{ item.totalNum }}</text>
                    <text class="desc">累计总人数</text>
                </view>
                <view class="infos">
                    <view class="updown">
                        <text
                            class="num"
                            :class="{ continue: item.continueNum > 0 }"
                        >{{ item.continueNum }}</text>
                        <text class="desc">续课人数</text>
                        <view v-if="accountType === 'ADMIN'" class="edit" @click="edit(item, 'continueNum')">
                            <text>修改</text>
                            <image src="/static/images/teacher/edit.png" />
                        </view>
                    </view>
                    <view class="updown">
                        <text class="num">{{ item.discontinueNum }}</text>
                        <text class="desc">未续人数</text>
                        <view v-if="accountType === 'ADMIN'" class="edit" @click="edit(item, 'discontinueNum')">
                            <text>修改</text>
                            <image src="/static/images/teacher/edit.png" />
                        </view>
                    </view>
                    <view class="updown">
                        <text
                            class="num"
                            :class="{ refund: item.refundNum > 0 }"
                        >{{ item.refundNum }}</text>
                        <text class="desc">退费人数</text>
                        <view v-if="accountType === 'ADMIN'" class="edit" @click="edit(item, 'refundNum')">
                            <text>修改</text>
                            <image src="/static/images/teacher/edit.png" />
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            accountType: '',
            groupId: 0,
            list: []
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        const accountType = uni.getStorageSync('accountType')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.accountType = accountType
        this.groupId = option.groupId
        this.init()
    },
    methods: {
        async init() {
            wx.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.get('/mini/teacherGroup/countTeacherGroupPackageStudentNum?groupId=' + this.groupId)
                this.list = res.data ?? []
            } finally {
                wx.hideLoading()
            }
        },

        edit() {

        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background-color: #f5f7fa;
    &-content {
        padding: 32rpx 40rpx;
        .item {
            background-color: #ffffff;
            border-radius: 16rpx;
            padding: 36rpx 40rpx;
            + .item {
                margin-top: 36rpx;
            }
            .name {
                font-size: 32rpx;
                font-weight: 500;
                color: #141f33;
                line-height: 44rpx;
            }
            .updown {
                display: flex;
                align-items: center;
                flex-direction: column;
            }
            .total {
                padding: 50rpx 0;
                border-bottom: 2rpx solid #f5f7fa;
                margin-bottom: 30rpx;
                .num {
                    font-size: 32rpx;
                    font-weight: 500;
                    color: #141f33;
                    line-height: 44rpx;
                    margin-bottom: 8rpx;
                }
                .desc {
                    font-size: 28rpx;
                    color: #99a0ad;
                    line-height: 40rpx;
                }
            }
            .infos {
                display: flex;
                justify-content: space-around;
                .num {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #99a0ad;
                    line-height: 40rpx;
                    margin-bottom: 10rpx;
                }
                .desc {
                    font-size: 24rpx;
                    color: #99a0ad;
                    line-height: 34rpx;
                }
                .continue {
                    color: #f15e5e;
                }
                .refund {
                    color: #44be5e;
                }
                .edit {
                    margin-top: 2rpx;
                    display: flex;
                    align-items: center;
                    text {
                        font-size: 24rpx;
                        color: #62bbec;
                        line-height: 34rpx;
                        margin-right: 4rpx;
                    }
                    image {
                        width: 28rpx;
                        height: 22rpx;
                    }
                }
            }
        }
    }
}
</style>
