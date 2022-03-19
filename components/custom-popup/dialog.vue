<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="main">
            <view class="content">
                <view class="tip">{{ content }}</view>
            </view>
            <view class="footer">
                <button class="btn cancel" @click="close">取消</button>
                <button class="btn confirm" @click="confirm">确认</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    props: {
        content: String
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        open() {
            this.loading = false
            this.$refs.popup.open()
        },

        close() {
            this.$refs.popup.close()
        },

        confirm() {
            if(this.loading) return
            this.loading = true
            this.$emit('confirm')
        }
    },
}
</script>

<style lang="scss" scoped src="./index.scss"></style>
<style lang="scss" scoped>
.main {
    .content {
        padding: 64rpx 48rpx;
        .tip {
            width: 100%;
            text-align: center;
            font-size: 28rpx;
            color: #99A0AD;
            line-height: 42rpx;
        }
    }
}
</style>
