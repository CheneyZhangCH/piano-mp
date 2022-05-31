<template>
    <view class="page">
        <view class="teacher">
            <view class="info">
                <image class="cover" :src="detail.teacher.coverUrl" />
                <text class="name">{{ detail.teacher.teacherName }}</text>
                <text class="sub-name">{{ detail.courseName }}</text>
            </view>
            <text class="sub-name">布置于 {{ agoWeekOrDateTime(detail.finishTime) }}</text>
        </view>
        <view class="page-content">
            <view class="divider">课堂报告</view>
            <view v-if="detail.chapterScores.length" class="block">
                <image class="title-icon"
                    src="https://static.gangqintonghua.com/img/beijing/homework-huikeqingkuang.png" />
                <view class="chapterScores">
                    <view v-for="item in detail.chapterScores" :key="item.id" class="score">
                        <text class="name ellipsis ">
                            {{ item.chapterName }}
                        </text>
                        <view class="rate">
                            <van-rate v-model="item.score"
                                :icon="'https://static.gangqintonghua.com/img/icon/star-new.png'"
                                :void-icon="'https://static.gangqintonghua.com/img/icon/star-void.png'" disabled
                                disabled-color="#62BBEC" gutter="4rpx" size="26rpx" />
                            <text class="num">{{ item.score * 2 }}分</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="block">
                <image class="title-icon"
                    src="https://static.gangqintonghua.com/img/beijing/homework-benkebiaoxian.png" />
                <view class="scores">
                    <view class="score">
                        <text class="num">{{ detail.handScore || '-' }}</text>
                        <text class="desc">手型得分</text>
                    </view>
                    <view class="score">
                        <text class="num">{{ detail.musicScore || '-' }}</text>
                        <text class="desc">识谱得分</text>
                    </view>
                    <view class="score">
                        <text class="num">{{ detail.attitudeScore || '-' }}</text>
                        <text class="desc">学习态度</text>
                    </view>
                </view>
            </view>
            <view class="divider">作业详情</view>
            <view v-for="chapter in detail.chapters" :key="chapter.id" class="chapter">
                <view class="book">
                    <view class="name">
                        <image src="https://static.gangqintonghua.com/img/icon/book.png" class="image" />
                        <text class="text">{{ chapter.bookName }}</text>
                    </view>
                    <view v-if="chapter.chapterId" class="video" @click="toVideo(chapter)">
                        <image src="https://static.gangqintonghua.com/img/beijing/peitaoshipin.png" class="image" />
                    </view>
                </view>
                <view class="chapterName">
                    {{ chapter.chapterName }}
                </view>
                <image class="title-icon" src="https://static.gangqintonghua.com/img/beijing/homework-kehouzuoye.png" />
                <view class="workStep">
                    <view v-for="(work, workIndex) in chapter.workStep" :key="workIndex" class="work">
                        <text class="work-step">步骤{{ numToChinese[workIndex + 1] }}：</text>
                        <text class="work-content">{{ work.content }}</text>
                    </view>
                </view>
                <image class="title-icon"
                    src="https://static.gangqintonghua.com/img/beijing/homework-jiaoshipingyu.png" />
                <view class="suggestStep">
                    <view v-for="(suggest, suggestIndex) in chapter.suggestStep" :key="suggestIndex" class="suggest">
                        <text>·</text>
                        <text>{{ suggest.content }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { numToChinese } from '@/utils/dicts'
import { agoWeekOrDateTime } from '@/utils/format'
export default {
    data() {
        return {
            numToChinese,
            id: 0,
            detail: {}
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.id = option.id
        this.init()
    },
    methods: {
        agoWeekOrDateTime,
        async init() {
            uni.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.get('/mini/finishiLesson/getStudentWork?id=' + this.id)
                const {
                    chapterScores,
                    ...rest
                } = res.data
                this.detail = {
                    ...rest,
                    chapterScores: chapterScores?.map(item => {
                        item.score = item.score / 2
                        return item
                    })
                }
            } finally {
                uni.hideLoading()
            }
        },

        toVideo({ chapterId }) {
            uni.navigateTo({ url: `/pages/student/videos/chapter?id=${chapterId}` })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;

    .teacher {
        padding: 30rpx 72rpx;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .info {
            flex: 1;
            display: flex;
            align-items: center;

            .cover {
                width: 60rpx;
                height: 60rpx;
                border-radius: 50%;
                margin-right: 16rpx;
            }

            .name {
                font-size: 28rpx;
                color: #141f33;
                margin-right: 16rpx;
            }
        }

        .sub-name {
            font-size: 24rpx;
            color: #99a0ad;
        }
    }

    &-content {
        padding-bottom: 30rpx;

        .title-icon {
            width: 116rpx;
            height: 40rpx;
            margin-bottom: 24rpx;
        }

        .block {
            background: #FFFFFF;
            border-radius: 20rpx;
            padding: 20rpx 36rpx;
            margin: 0 30rpx;

            +.block {
                margin-top: 20rpx;
            }

            .chapterScores {
                .score {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    +.score {
                        margin-top: 2rpx;
                    }

                    .name {
                        width: 320rpx;
                        font-size: 24rpx;
                        color: #525666;
                        line-height: 34rpx;
                    }

                    .rate {
                        display: flex;
                        align-items: center;

                        .num {
                            width: 56rpx;
                            font-size: 24rpx;
                            font-weight: 600;
                            color: #62BBEC;
                            line-height: 34rpx;
                            margin-left: 16rpx;
                            text-align: right;
                        }
                    }
                }
            }

            .scores {
                display: flex;

                .score {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    text-align: center;

                    .num {
                        font-size: 28rpx;
                        font-weight: 600;
                        color: #141f33;
                        line-height: 40rpx;
                        margin-bottom: 2rpx;
                    }

                    .desc {
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;
                    }

                    +.score {
                        position: relative;

                        &::before {
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            content: ' ';
                            display: inline-block;
                            width: 2rpx;
                            height: 20rpx;
                            background: #C9CED6;
                        }
                    }
                }
            }
        }

        .chapter {
            background: #FFFFFF;
            border-radius: 20rpx;
            padding: 24rpx 36rpx;
            margin: 0 30rpx;

            +.chapter {
                margin-top: 24rpx;
            }

            .book {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .name {
                    display: flex;
                    align-items: center;

                    .text {
                        font-size: 24rpx;
                        font-weight: 600;
                        color: #616B80;
                        // line-height: 34rpx;
                    }

                    .image {
                        width: 34rpx;
                        height: 34rpx;
                        margin-right: 8rpx;
                    }
                }

                .video {
                    .image {
                        width: 124rpx;
                        height: 24rpx;
                    }
                }
            }

            .chapterName {
                font-size: 32rpx;
                font-weight: 600;
                color: #141F33;
                line-height: 44rpx;
                text-align: center;
                margin: 36rpx 0;
            }

            .workStep {
                margin-bottom: 20rpx;

                .work {
                    display: flex;

                    font-size: 24rpx;
                    color: #525666;
                    line-height: 34rpx;

                    +.work {
                        margin-top: 10rpx;
                    }

                    &-step {
                        flex-basis: 96rpx;
                    }

                    &-content {
                        flex: 1;
                        font-weight: 600;
                        color: #62bbec;
                        margin-left: 12rpx;
                    }
                }
            }

            .suggestStep {
                .suggest {
                    display: flex;

                    font-size: 24rpx;
                    font-weight: 600;
                    color: #F15E5E;
                    line-height: 34rpx;

                    +.suggest {
                        margin-top: 10rpx;
                    }

                    text+text {
                        margin-left: 12rpx;
                    }
                }
            }
        }

        .divider {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            font-weight: 500;
            color: #62bbec;
            line-height: 34rpx;
            margin: 36rpx 0;

            &::before,
            &::after {
                content: " ";
                display: inline-block;
                width: 216rpx;
                height: 2rpx;
                background: #62bbec;
            }

            &::before {
                margin-right: 36rpx;
            }

            &::after {
                margin-left: 36rpx;
            }
        }
    }
}
</style>
