<template>
    <view class="page">
        <view v-if="book" class="book">
            <view class="bg" :style="{
                backgroundImage: 'url(' + book.coverUrl + ')'
            }" />
            <image class="cover" :src="book.coverUrl"></image>
        </view>
        <view class="custom-header">
            <view class="title" :style="customTitleStyle">
                <uni-icons type="left" color="#FFF" size="22" @click="back"
                    style="position: absolute; left: 0; padding: 0 30rpx" />
                {{ book.bookName }}
            </view>
        </view>
        <scroll-view scroll-y="true" class="units" @scroll="onUnitsScroll">
            <tui-sticky v-for="item in units" :key="item.unit.id" class="item" :scrollTop="scrollTop" :offset-top="298">
                <template v-slot:header>
                    <view class="name">{{ item.unit.unitName }}</view>
                </template>
                <template v-slot:content>
                    <view class="chapter">
                        <view v-for="chapter in item.chapters" :key="chapter.chapter.id" class="chapter-item"
                            @click="goChapter(chapter)">
                            {{ chapter.chapter.chapterName }}
                        </view>
                    </view>
                </template>
            </tui-sticky>
        </scroll-view>
    </view>
</template>

<script>
import tuiSticky from "@/components/ThorUi/tui-sticky"
export default {
    components: {
        tuiSticky
    },
    data() {
        return {
            book: null,
            units: [],
            headerHeight: 0,
            headerTop: 0,
            scrollTop: 0
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')

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

        let rect = wx.getMenuButtonBoundingClientRect();

        this.headerHeight = rect.height
        this.headerTop = rect.top

        this.init(option)
    },
    computed: {
        customTitleStyle() {
            return `top: ${this.headerTop}px; height: ${this.headerHeight}px; line-height: ${this.headerHeight}px`
        },
    },
    methods: {
        async init({ id }) {
            const res = await this.$http.get('/mini/teachingBook/getBook?bookId=' + id)
            if (res.ok) {
                const { book, units } = res.data
                this.book = book
                this.units = units ?? []
            }
        },

        goChapter(chapter) {
            uni.navigateTo({ url: `/pages/student/videos/chapter?id=${chapter.chapter.id}` })
        },

        back() {
            uni.navigateBack({ delta: 1 })
        },

        onUnitsScroll(e) {
            this.scrollTop = e.detail.scrollTop + 298
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    padding-top: 596rpx;

    .book {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 596rpx;
        overflow: hidden;

        .bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background-position: 38% 0;
            background-size: 200% 100%;
            filter: blur(20px);
        }

        .cover {
            position: absolute;
            left: 32rpx;
            bottom: 88rpx;
            z-index: 9;
            width: calc(100% - 64rpx);
            height: 304rpx;
        }
    }

    .custom-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;

        .title {
            position: absolute;
            width: 100%;
            z-index: 1;
            text-align: center;
            font-size: 32rpx;
            font-weight: 600;
            color: #fff;
        }
    }

    .units {
        height: calc(100vh - 596rpx);

        .item {
            .name {
                background-color: #f5f7fa;

                font-weight: 600;
                color: #141f33;
                line-height: 92rpx;
                padding: 0 44rpx;
            }

            .chapter {
                background-color: #FFF;
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
