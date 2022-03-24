<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="piano-message-box" :class="[customClass, 'piano-message-box--center']">
            <view v-if="title" class="piano-message-box___header">
                <view class="piano-message-box__title">{{ title }}</view>
            </view>
            <view class="piano-message-box__content">
                <view v-if="message !== ''" class="piano-message-box__message">{{ message }}</view>

                <view class="piano-message-box__input" v-show="showInput">
                    <input
                        class="input"
                        :value="inputValue"
                        :type="inputType"
                        :placeholder="inputPlaceholder"
                        :placeholder-style="placeholderStyle"
                        :maxlength="maxlength"
                        @input="e => inputValue = e.detail.value" />
                    <view
                        class="piano-message-box__errormsg"
                        :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }"
                    >{{ editorErrorMessage }}</view>
                </view>
            </view>
            <view class="piano-message-box__btns">
                <button
                    v-if="showCancelButton"
                    :class="[cancelButtonClasses]"
                    @click="close"
                >{{ cancelButtonText }}</button>
                <button
                    v-show="showConfirmButton"
                    :loading="loading"
                    :class="[confirmButtonClasses]"
                    @click="confirm"
                >{{ confirmButtonText }}</button>
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
        title: String,
        message: String,
        customClass: String,
        showConfirmButton: {
            type: Boolean,
            default: true
        },
        showCancelButton: {
            type: Boolean,
            default: false
        },
        confirmButtonText: {
            type: String,
            default: '确认'
        },
        cancelButtonText: {
            type: String,
            default: '取消'
        },
        confirmButtonClass: String,
        cancelButtonClass: String,

        showInput: {
            type: Boolean,
            default: false
        },
        inputType: {
            type: String,
            default: 'text'
        },
        maxlength: {
            type: Number,
            default: 20
        },
        inputPlaceholder: {
            type: String,
            default: '请输入'
        },
        placeholderStyle: {
            type: String,
            default: 'color: #99A0AD;font-size: 24rpx;'
        }
    },
    computed: {
        confirmButtonClasses() {
            return `btn confirm ${this.confirmButtonClass}`;
        },
        cancelButtonClasses() {
            return `btn cancel ${this.cancelButtonClass}`;
        }
    },
    data() {
        return {
            loading: false,
            inputValue: null,
            editorErrorMessage: ''
        };
    },
    methods: {
        open(inputValue) {
            if (this.showInput) this.inputValue = inputValue ?? null
            this.loading = false
            this.$refs.popup.open()
        },

        close() {
            this.$refs.popup.close()
        },

        confirm() {
            if (this.loading) return
            this.loading = true
            this.$emit('confirm', this.inputValue)
        }
    }
};
</script>

<style lang="scss" scoped>
.piano-message-box {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;
    &___header {
        padding: 22rpx 0;
        text-align: center;
    }
    &__title {
        font-size: 32rpx;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 44rpx;
        color: #141f33;
    }
    &__input {
        padding: 30rpx;
        .input {
            width: 100%;
            height: 72rpx;
            line-height: 72rpx;
            border-radius: 8rpx;
            border: 2rpx solid #e3e5e9;
            padding: 0 30rpx;
            font-size: 24rpx;
            font-weight: 500;
            color: #141f33;
            box-sizing: border-box;
        }
    }
    &__errormsg {
        color: #f56c6c;
        font-size: 24rpx;
        min-height: 36rpx;
        margin-top: 4rpx;
    }
    &__message {
        padding: 64rpx 48rpx;
        font-size: 28rpx;
        color: #99a0ad;
        text-align: center;
        line-height: 42rpx;
    }
    &__btns {
        display: flex;
        column-gap: 48rpx;
        padding: 32rpx 48rpx;
        box-shadow: 0px -4rpx 8rpx 0px rgba(0, 0, 0, 0.05);
        .btn {
            flex: 1;
            height: 72rpx;
            padding: 0 56rpx;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 72rpx;
            color: #616b80;
            background-color: #fff;
            border: 1px solid #d3d7e0;
            border-radius: 44rpx;
            &::after {
                display: none;
            }
            &.confirm {
                color: #fff;
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
                border: none;
            }
            &.disabled {
                background: #e1e1e1;
                border: none;
            }
        }
    }
}
</style>
