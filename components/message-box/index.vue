<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view
            class="piano-message-box"
            :class="[customClass, 'piano-message-box--center']"
        >
            <view v-if="title" class="piano-message-box___header">
                <view class="piano-message-box__title">{{ title }}</view>
            </view>
            <view class="piano-message-box__content">
                <view v-if="message !== ''" class="piano-message-box__message">{{ message }}</view>
            </view>
            <view class="piano-message-box__btns">
                <button
                    v-if="showCancelButton"
                    :class="[cancelButtonClasses]"
                    @click="close"
                >{{ cancelButtonText }}</button>
                <button
                    v-show="showConfirmButton"
                    :loading="confirmButtonLoading"
                    :class="[confirmButtonClasses]"
                    @click="confirm"
                >{{ confirmButtonText }}</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
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
        confirmButtonLoading: {
            type: Boolean,
            default: false
        },
        confirmButtonClass: String,
        cancelButtonClass: String,
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
            loading: false
        };
    },
    methods: {
        open() {
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
    }
};
</script>

<style lang="scss" scoped>
.piano-message-box {
	width: 650rpx;
	background-color: #FFF;
	border-radius: 32rpx;
	&___header {
		padding: 22rpx 0;
		font-size: 32rpx;
		font-weight: 500;
		line-height: 44rpx;
		color: #141F33;
		text-align: center;
	}
    &__content {
        padding: 64rpx 48rpx;
    }
    &__message {
        width: 100%;
        text-align: center;
        font-size: 28rpx;
        color: #99A0AD;
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
			color: #616B80;
			background-color: #FFF;
			border: 1px solid #D3D7E0;
			border-radius: 44rpx;
			&::after {
				display: none;
			}
			&.confirm {
				color: #FFF;
				background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
				border: none;
			}
			&.disabled {
				background: #E1E1E1;
				border: none;
			}
		}
	}
}
</style>
