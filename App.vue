<template>
    <view>
        123
    </view>
</template>
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 每个页面公共css */
	@import "./common/uni.css";

	/* 自定义图标库 */
	@import "./common/iconfont.css";

	/* 动画库 */
	@import "./common/animate.css";

	/* 自定义样式库 */
	@import "./common/free.css";

	/* 全局样式 */
	@import "./common/common.css";

	/* 页面样式 */
	@import "./common/page.scss";

	page {
		background-color: #efeff4;
		height: 100%;
		font-size: 28rpx;
		/* line-height: 1.8; */
	}

	view {
		line-height: 1;
	}

	/* 去掉弹出层默认白色背景, 页面样式中设置无效 */
	.uni-transition .uni-popup__wrapper-box {
		background: none !important;
	}

	/* 防止小程序右上角按钮遮住导航右侧按钮 */
	.uni-navbar {
		margin-top: 52rpx !important;
	}

	/deep/.uni-scroll-view ::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}

	/deep/::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}
</style>
