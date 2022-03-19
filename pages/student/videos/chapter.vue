<template>
    <view class="page">
        <view v-if="chapter" class="chapter">
            <video
                id="video"
                class="video"
                :src="video.videoUrl"
                controls
            />
        </view>
        <view v-if="chapter && video" class="video">
            {{chapter.chapterName}}-{{video.videoName}}
        </view>
        <view class="videos">
            <view class="title">视频合集</view>
            <view class="content">
                <view v-for="item in videos" :key="item.id" class="item" :class="{active:item.id === video.id}" @click="videosChange(item)">
                    {{ item.videoName }}
                    <image v-if="item.id === video.id" class="on" :src="'/static/images/student/video-on.png'"/>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="js">
export default {
    data() {
        return {
            chapter: null,
            videos: [],

            video: null
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        const accountType = uni.getStorageSync('accountType')

        // 权限验证
        if (!token) {
            uni.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return uni.navigateTo({
                url: '/pages/login/index'
            })
        }
        this.init(option)
    },
    methods: {
        async init({id}){
            const res = await this.$http.get('/mini/teachingBook/getChapter?chapterId='+id)
            if(res.ok){
                const {chapter,videos} = res.data
                this.chapter = chapter
                this.videos = videos ?? []
                this.video = this.videos[0]

				uni.setNavigationBarTitle({
					title: chapter.chapterName
				})
            }
        },

        videosChange(item) {
            if(this.video.id === item.id) return
            this.video = item
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    background-color: #FFF;
    .chapter {
        max-height: 596rpx;
        .video {
            width: 100%;
        }
    }
    >.video {
        padding: 40rpx 30rpx;

        font-size: 32rpx;
        font-weight: 500;
        color: #141F33;
        line-height: 44rpx;
    }
    .videos {
        .title {
            padding: 30rpx;
            font-size: 28rpx;
            font-weight: 500;
            color: #141F33;
            line-height: 40rpx;
        }
        .content {
            width: 100%;
            padding: 0 30rpx 30rpx;
            white-space: nowrap;
            overflow-x: auto;
            .item {
                display: inline-block;
                height: 76rpx;
                background-color: #FFF;
                box-shadow: 0px 0px 8rpx 0px #E3E5E9;
                border-radius: 8rpx;
                line-height: 34rpx;
                padding: 22rpx 24rpx 20rpx;
                + .item {
                    margin-left: 20rpx;
                }
                &.active {
                    position: relative;
                    font-weight: 500;
                    color: #62bbec;
                    border-radius: 12rpx;
                }
                .on {
                    position: absolute;
                    left: 10rpx;
                    bottom: 4rpx;
                    width: 16rpx;
                    height: 16rpx;
                }
            }
        }
    }
}
</style>
