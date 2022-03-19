<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="main">
            <view class="content">
                <view class="text mb-16">违规违纪内容</view>
                <van-field
                    class="input"
                    :value="form.content"
                    placeholder="填写内容不可超过18字"
                    placeholder-style="color: #99A0AD;font-size: 24rpx;"
                    maxlength="18"
                    clearable
                    @input="e => form.content = e.detail"
                />
                <view class="amount-row">
                    <text class="text">违规违纪金额：</text>
                    <view class="amount">
                        <input
                            type="number"
                            :value="form.amount"
                            placeholder="请录入金额"
                            placeholder-style="color: #99A0AD;font-size: 24rpx;"
                            border="false"
                            maxlength="9"
                            @input="e => form.amount = e.detail.value"
                        />
                        元
                    </view>
                </view>
                <view v-if="form.amount && !validAmount" class="amount-rule-error">
                    请输入0-999999.99之间的数字
                </view>
            </view>
            <view class="footer">
                <button class="btn" @click="close">取消</button>
                <button
                    class="btn"
                    :class="{ confirm: !disabled, disabled: disabled }"
                    :disabled="disabled"
                    @click="confirm"
                >确认</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    options: {
        styleIsolation: 'shared'
    },
    props: {
        teacherId: [String, Number]
    },
    data() {
        return {
            amountRule: /^(0|[1-9]{1}\d{0,5})(\.\d{1,2})?$/,
            form: {
                amount: '',
                content: '',
            },
            loading: false
        }
    },
    computed: {
        disabled() {
            return !this.validAmount || !this.form.content
        },
        validAmount() {
            return this.amountRule.test(this.form.amount)
        }
    },
    methods: {
        open() {
            this.$refs.popup.open()
        },

        close() {
            this.$refs.popup.close()
        },

        async confirm() {
            if (this.loading) return
            const param = {
                data: {
                    ...this.form,
                    teacherId: this.teacherId
                }
            }
            this.loading = true
            try {
                const res = await this.$http.post('/mini/teacher/addDiscipline', param)
                if(res.ok) {
                    uni.showToast({
                        title: '录入成功！',
                        icon: 'success',
                    })
                    this.$refs.popup.close()
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
        padding: 50rpx;
        .text {
            font-size: 24rpx;
            color: #525666;
            line-height: 34rpx;
        }
        .mb-16 {
            margin-bottom: 16rpx;
        }
        .input {
            /deep/.van-cell {
                padding: 0;
            }
            /deep/.van-field__body {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;

                border-radius: 8rpx;
                border: 2rpx solid #e3e5e9;

                padding-left: 36rpx;
                padding-right: 20rpx;

                font-size: 24rpx;
                font-weight: 500;
                color: #141f33;
                box-sizing: border-box;
            }
        }
        .amount-row {
            display: flex;
            align-items: center;
            margin-top: 36rpx;
            .text {
                margin-right: 10rpx;
            }
            .amount {
                display: flex;
                align-items: center;
                width: 198rpx;
                input {
                    border-bottom: 2rpx solid #e3e5e9;
                    padding: 0 20rpx;
                    font-size: 24rpx;
                }
            }
        }
        .amount-rule-error {
            margin-top: 16rpx;
            font-size: 24rpx;
            color: #ee0a24;
        }
    }

    .footer {
        display: flex;
        column-gap: 48rpx;
        padding: 32rpx 48rpx;

        box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
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
            &::after {
                display: none;
            }
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