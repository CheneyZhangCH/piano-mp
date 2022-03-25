<template>
    <view class="page">
        <view class="teacher">
            <view class="info">
                <image class="cover" :src="detail.teacher.coverUrl" />
                <text class="name">{{ detail.teacher.teacherName }}</text>
                <text class="sub-name">{{ detail.courseName }}</text>
            </view>
            <text class="sub-name">布置于 {{ weekOrDateTime(detail.finishTime) }}</text>
        </view>
        <view class="page-content">
            <view class="divider">课堂报告</view>
            <view v-if="detail.chapterScores.length" class="block">
                <view class="title">
                    <text>回课情况</text>
                </view>
                <view class="chapterScores">
                    <view v-for="item in detail.chapterScores" :key="item.id" class="score">
                        <text>
                            <text class="name ellipsis">{{ item.chapterName }}</text>回课表现
                        </text>
                        <view class="rate">
                            <van-rate
                                v-model="item.score"
                                disabled
                                disabled-color="#62BBEC"
                                gutter="4rpx"
                                size="26rpx"
                            />
                            <text class="num">{{ item.score }}分</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="block">
                <view class="title">
                    <text>本课表现</text>
                </view>
                <view class="scores">
                    <view class="score">
                        <text class="num">{{ detail.handScore || '-' }}</text>
                        <text class="desc">手型平均分</text>
                    </view>
                    <view class="score">
                        <text class="num">{{ detail.musicScore || '-' }}</text>
                        <text class="desc">识谱平均分</text>
                    </view>
                    <view class="score">
                        <text class="num">{{ detail.attitudeScore || '-' }}</text>
                        <text class="desc">学习态度分</text>
                    </view>
                </view>
            </view>
            <view class="divider">作业详情</view>
            <view v-for="chapter in detail.chapters" :key="chapter.id" class="chapter">
                <view class="book">
                    <view class="name">
                        <image src="/static/images/student/book.png" />
                        {{chapter.bookName}}
                    </view>
                    <view class="btn" @click="toVideo(chapter)">
                        配套视频
                        <image src="/static/images/student/play.png" />
                    </view>
                </view>
                <view class="chapterName">
                    {{chapter.chapterName}}
                </view>
                <view class="title">
                    <text>课后作业</text>
                </view>
                <view class="workStep">
                    <view
                        v-for="(work, workIndex) in chapter.workStep"
                        :key="workIndex"
                        class="work"
                    >
                        <text>步骤{{ numToChinese[workIndex + 1] }}：</text>
                        <text class="work-content">{{ work.content }}</text>
                    </view>
                </view>
                <view class="title">
                    <text>教师评语</text>
                </view>
                <view class="suggestStep">
                    <view
                        v-for="(suggest, suggestIndex) in chapter.suggestStep"
                        :key="suggestIndex"
                        class="suggest"
                    >
                        <text>· {{ suggest.content }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { numToChinese } from '@/utils/dicts'
import { weekOrDateTime } from '@/utils/format'
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
        weekOrDateTime,
        async init() {
            uni.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.get('/mini/finishiLesson/getStudentWork?id=' + this.id)
                this.detail = res.data ?? {}
            } finally {
                uni.hideLoading()
            }
        },

        toVideo({ id }) {
            uni.navigateTo({ url: `/pages/student/videos/chapter?id=${id}` })
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

                    font-size: 24rpx;
                    color: #525666;
                    line-height: 34rpx;
                    .name {
                        margin-right: 4rpx;
                    }
                    +.score {
                        margin-top: 2rpx;
                    }
                    .num {
                        font-size: 24rpx;
                        font-weight: 500;
                        color: #62BBEC;
                        line-height: 34rpx;
                        margin-left: 20rpx;
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
                        font-weight: 500;
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
        .block,
        .chapter {
            .title {
                font-size: 28rpx;
                font-weight: 500;
                color: #141F33;
                line-height: 40rpx;
                margin-bottom: 24rpx;
                text {
                    position: relative;
                }
                text::after {
                    content: " ";
                    display: block;
                    position: absolute;
                    top: 24rpx;
                    left: 8rpx;
                    opacity: 0.8;
                    width: 100%;
                    height: 12rpx;
                    background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
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
                .name,
                .btn {
                    display: flex;
                    align-items: center;
                    font-size: 24rpx;
                    color: #616B80;
                    line-height: 34rpx;
                }
                .name {
                    font-weight: 500;
                    image {
                        width: 34rpx;
                        height: 34rpx;
                        margin-right: 8rpx;
                    }
                }
                .btn {
                    image {
                        width: 24rpx;
                        height: 24rpx;
                        margin-left: 8rpx;
                    }
                }
            }
            .chapterName {
                font-size: 32rpx;
                font-weight: 500;
                color: #141F33;
                line-height: 44rpx;
                text-align: center;
                margin: 36rpx 0;
            }
            .workStep {
                margin-bottom: 20rpx;
                .work {
                    font-size: 24rpx;
                    color: #525666;
                    line-height: 34rpx;
                    + .work {
                        margin-top: 10rpx;
                    }
                    &-content {
                        font-weight: 500;
                        color: #62bbec;
                        margin-left: 12rpx;
                    }
                }
            }
            .suggestStep {
                .suggest {
                    width: 298px;
                    font-size: 24rpx;
                    font-weight: 500;
                    color: #F15E5E;
                    line-height: 34rpx;
                    + .suggest {
                        margin-top: 10rpx;
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
