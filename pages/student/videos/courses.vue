<template>
    <view class="page">
        <view v-if="book" class="book">
            <view
                class="bg"
                :style="{
                    backgroundImage: 'url('+book.coverUrl+')'
                }"
            />
            <image class="cover" :src="book.coverUrl"></image>
            <view class="custom-header" :style="{top: `${headerTop}px`,height: `${headerHeight}px`}">
                <van-icon name="arrow-left" class="back" @click="goBack"/>
                <text class="title">{{ book.bookName }}</text>
            </view>
        </view>
        <view class="units">
            <view v-for="item in units" :key="item.unit.id" class="item">
                <view class="name">{{ item.unit.unitName }}</view>
                <view class="chapter">
                    <view
                        v-for="chapter in item.chapters"
                        :key="chapter.chapter.id"
                        class="chapter-item"
                        @click="goChapter(chapter)"
                    >
                        {{ chapter.chapter.chapterName }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="js">
export default {
    data() {
        return {
            book: null,
            units: [],
            headerHeight: 0,
            headerTop: 0
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
        this.customHeader()
        this.init(option)
    },
    methods: {
        customHeader() {
            let rect = wx.getMenuButtonBoundingClientRect();

            this.headerHeight = rect.height
            this.headerTop = rect.top
        },

        async init({id}){
            const res = await this.$http.get('/mini/teachingBook/getBook?bookId='+id)
            if(res.ok){
                const {book,units} = res.data
                this.book = book
                this.units = units ?? []
            }
        },

        goChapter(chapter){
            uni.navigateTo({ url: `/pages/student/videos/chapter?id=${chapter.chapter.id}` })
        },

        goBack(){
            uni.navigateBack({ delta: 1 })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    background-color: #fff;
    padding-top: 596rpx;
    .book {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 596rpx;
        .bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background-position: 38% 0;
            background-size: 200% 100%;
            filter: blur(10px);
        }
        .cover {
            position: absolute;
            left: 32rpx;
            bottom: 88rpx;
            z-index: 9;
            width: calc(100% - 64rpx);
            height: 304rpx;
        }
        .custom-header {
            position: absolute;
            z-index: 9;
            display: flex;
            align-items: center;
            width: 100%;
            height: 56rpx;
            text-align: center;
            color: #FFF;
            .title {
                font-size: 32rpx;
                font-weight: 500;
                line-height: 44rpx;
                flex: 1;
            }
            .back {
                font-size: 32rpx;
                margin-left: 28rpx;
            }
        }
    }
    .units {
        .item {
            .name {
                background-color: #f5f7fa;

                font-weight: 500;
                color: #141f33;
                line-height: 92rpx;
                padding: 0 44rpx;
            }
            .chapter {
                padding: 0 44rpx;
                &-item {
                    color: #525666;
                    line-height: 112rpx;
                    &:not(:last-child) {
                        border-bottom: 1px solid #f5f7fa;
                    }
                }
            }
        }
    }
}
</style>
