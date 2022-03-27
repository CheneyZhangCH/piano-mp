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
                        <view
                            v-if="['ADMIN', 'SUPER_ADMIN'].includes(accountType)"
                            class="edit"
                            @click="update(item, 'continueNum')"
                        >
                            <text>修改</text>
                            <image src="/static/images/teacher/edit.png" />
                        </view>
                    </view>
                    <view class="updown">
                        <text class="num">{{ item.discontinueNum }}</text>
                        <text class="desc">未续人数</text>
                        <view
                            v-if="['ADMIN', 'SUPER_ADMIN'].includes(accountType)"
                            class="edit"
                            @click="update(item, 'discontinueNum')"
                        >
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
                        <view
                            v-if="['ADMIN', 'SUPER_ADMIN'].includes(accountType)"
                            class="edit"
                            @click="update(item, 'refundNum')"
                        >
                            <text>修改</text>
                            <image src="/static/images/teacher/edit.png" />
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <pianoMessageBox
            ref="update"
            title="修改"
            showInput
            showCancelButton
            @confirm="updateTeacherGroupPackageStudentNum"
        />
    </view>
</template>

<script>
export default {
    data() {
        return {
            accountType: '',
            groupId: 0,
            list: [],
            updateItem: {},
            updateProp: ''
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
            uni.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.get('/mini/teacherGroup/countTeacherGroupPackageStudentNum?groupId=' + this.groupId)
                this.list = res.data ?? []
            } finally {
                uni.hideLoading()
            }
        },

        update(item, type) {
            this.updateItem = item
            this.updateProp = type

            this.$refs.update.open(item[type] || null)
        },

        async updateTeacherGroupPackageStudentNum(value) {
            if (!/^(0|[1-9]{1}\d{0,5})$/.test(value)) {
                this.$toast({ title: '请输入正确的人数！', icon: 'none' })
                this.$refs.update.loading = false
                return
            }
            const { id, groupId } = this.updateItem
            const param = {
                data: {
                    id, groupId
                }
            }
            param.data[this.updateProp] = +value
            try {
                await this.$http.post('/mini/teacherGroup/updateTeacherGroupPackageStudentNum', param)
                this.$toast({ title: '修改成功！', icon: 'success' })
                this.$refs.update.close()
                this.init()
            } finally {
                this.$refs.update.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    &-content {
        padding: 32rpx 40rpx;
        .item {
            padding: 36rpx 40rpx;
            background-color: #fff;
            border-radius: 16rpx;
            + .item {
                margin-top: 36rpx;
            }
            .name {
                font-size: 32rpx;
                font-weight: 500;
                line-height: 44rpx;
                color: #141f33;
            }
            .updown {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .total {
                padding: 50rpx 0;
                margin-bottom: 30rpx;
                border-bottom: 2rpx solid #f5f7fa;
                .num {
                    margin-bottom: 8rpx;
                    font-size: 32rpx;
                    font-weight: 500;
                    line-height: 44rpx;
                    color: #141f33;
                }
                .desc {
                    font-size: 28rpx;
                    line-height: 40rpx;
                    color: #99a0ad;
                }
            }
            .infos {
                display: flex;
                justify-content: space-around;
                .num {
                    margin-bottom: 10rpx;
                    font-size: 28rpx;
                    font-weight: 500;
                    line-height: 40rpx;
                    color: #99a0ad;
                }
                .desc {
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #99a0ad;
                }
                .continue {
                    color: #f15e5e;
                }
                .refund {
                    color: #44be5e;
                }
                .edit {
                    display: flex;
                    align-items: center;
                    margin-top: 2rpx;
                    text {
                        margin-right: 4rpx;
                        font-size: 24rpx;
                        line-height: 34rpx;
                        color: #62bbec;
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
