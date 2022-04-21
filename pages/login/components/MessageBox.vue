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

<style lang="scss" src="@/common/piano-message-box.scss"></style>
