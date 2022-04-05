<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="piano-message-box">
            <view class="piano-message-box__content">
                <view class="piano-message-box__message">仅对内部学员开放</view>
                <view class="piano-message-box__message">请使用已开通的手机号登录</view>
            </view>
            <view class="piano-message-box__btns">
                <button class="btn confirm" @click="confirm">我知道了</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    methods: {
        open() {
            this.$refs.popup.open()
        },

        confirm() {
            this.$refs.popup.close()
            this.$emit('confirm')
        }
    }
};
</script>

<style lang="scss" scoped>
.piano-message-box {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;
    &__content {
        padding: 48rpx 32rpx 40rpx;
        text-align: center;
    }
    &__message {
        font-size: 28rpx;
        color: #99a0ad;
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
