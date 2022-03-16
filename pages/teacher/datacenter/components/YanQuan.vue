<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="main">
            <view class="content">
                <template v-if="step === 0">
                    <van-field
                        class="input"
                        :value="code"
                        placeholder="请输入10位课程陪练券码"
                        placeholder-style="color: #99A0AD;font-size: 32rpx;"
                        maxlength="10"
                        border="false"
                        clearable
                        @input="e => code = e.detail"
                        @clear="code = ''"
                    />
                </template>
                <template v-else>
                    <view v-if="!ticketInfo" class="tip" @click="close">核销失败！请输入正确的券码！</view>
                    <template v-else>
                        <view class="tip">请确认当前所核销的课程券信息</view>
                        <view v-if="ticketInfo.ticketName" class="name">{{ ticketInfo.ticketName }}</view>
                    </template>
                </template>
            </view>
            <view class="footer">
                <template v-if="step === 0">
                    <view class="btn" @click="close">取消</view>
                    <view
                        class="btn"
                        :class="{ confirm: code.length === 10, disabled: code.length < 10 }"
                        @click="confirm"
                    >确认</view>
                </template>
                <template v-else>
                    <view v-if="!ticketInfo" class="btn confirm" @click="close">我知道了</view>
                    <template v-else>
                        <view class="btn" @click="close">取消</view>
                        <view class="btn confirm" @click="checkConfirm">确认核销</view>
                    </template>
                </template>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    options: {
        styleIsolation: 'shared'
    },
    data() {
        return {
            step: 0,
            code: '',
            ticketInfo: null,

            loading: false
        }
    },
    methods: {
        open() {
            this.step = 0
            // AFAADKSLIJ
            // AFFFDAFDA3
            // AFFFD3AFDA
            this.code = 'AFFFDAFDA3'
            this.ticketInfo = null
            this.loading = false

            this.$refs.popup.open()
        },

        close() {
            this.$refs.popup.close()
        },

        async confirm() {
            if (this.loading || !this.code) return
            const param = {
                data: this.code
            }
            this.loading = true
            try {
                const res = await this.$http.post('/mini/trainTicket/getByCode', param)
                this.step = 1
                this.ticketInfo = res.data
            } finally {
                this.loading = false
            }
        },

        async checkConfirm() {
            if (this.loading) return
            const param = {
                data: this.ticketInfo.ticketId
            }
            this.loading = true
            try {
                const res = await this.$http.post('/mini/trainTicket/useStudentTrainTicket', param)
                if (res.ok) {
                    uni.showToast({
                        title: '核销成功！',
                        icon: 'success',
                    })
                    this.$refs.popup.close()
                    this.$emit('success')
                }
            } finally {
                this.loading = false
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.main {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;

    .content {
        padding: 64rpx 48rpx;
        .input {
            /deep/.van-cell {
                padding: 0;
            }
            /deep/.van-field__body {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                background: #e3e5e9;
                border-radius: 12rpx;

                padding-left: 36rpx;
                padding-right: 20rpx;
                font-size: 32rpx;
                font-weight: 500;
                color: #141f33;
                box-sizing: border-box;
            }
        }
        .tip {
            width: 100%;
            text-align: center;
            font-size: 28rpx;
            font-weight: 500;
            color: #525666;
            line-height: 40rpx;
        }
        .name {
            font-size: 32rpx;
            font-weight: 500;
            color: #62bbec;
            line-height: 44rpx;
            margin-top: 36rpx;
        }
    }

    .footer {
        display: flex;
        column-gap: 48rpx;
        padding: 32rpx 48rpx;
        .btn {
            flex: 1;
            height: 72rpx;
            line-height: 72rpx;
            border-radius: 44rpx;
            border: 2rpx solid #d3d7e0;
            background: #fff;

            text-align: center;
            font-size: 32rpx;
            font-weight: 500;
            color: #616b80;
        }
        .disabled {
            background: #e1e1e1;
            border: none;
            color: #ffffff;
        }
        .confirm {
            background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
            border: none;
            color: #ffffff;
        }
    }
}
</style>