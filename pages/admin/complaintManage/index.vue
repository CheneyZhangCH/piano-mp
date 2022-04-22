<template>
    <view class="page">
        <view class="page-content">
            <view v-for="item in complaintList" :key="item.id" class="complaint-item">
                <view class="complaint-item-header">
                    <view class="left">
                        <text class="type">{{ dicts.complaintType[item.complaintType] }}</text>
                        <image class="cover" :src="getStudentCoverUrl(item.student)" />
                        <text class="name">{{ item.student.studentName }}</text>
                    </view>
                    <text class="time">{{ todayOrYesterdayOrDateFormat(item.createTime) }}</text>
                </view>
                <view class="complaint-item-content">
                    <view class="infos">
                        <view class="info">
                            <template
                                v-if="item.complaintType === 'finishLesson' && item.finishLesson"
                            >
                                <view class="content-2 mb-16">{{ item.finishLesson | chapterNames }}</view>
                                <view class="content mb-16">{{ item.finishLesson | finishTime }}</view>
                                <view
                                    v-if="item.finishLesson.courseType === 'one'"
                                    class="scores content mb-16"
                                >
                                    <text>手型评分:{{ item.finishLesson.handScore || 0 }}分</text>
                                    <text>识谱评分:{{ item.finishLesson.musicScore || 0 }}分</text>
                                    <text>学习态度:{{ item.finishLesson.attitudeScore || 0 }}分</text>
                                </view>
                            </template>
                            <view v-else class="content-2 mb-16">投诉原因：{{ item.complaintReason }}</view>

                            <view class="content">投诉详情：{{ item.content }}</view>
                        </view>
                        <view
                            v-if="item.complaintType === 'finishLesson' && item.finishLesson"
                            class="teacher"
                        >
                            <image class="cover" :src="item.finishLesson.teacher.coverUrl" />
                            <text class="name">{{ item.finishLesson.teacher.teacherName }}</text>
                        </view>
                    </view>
                    <view v-if="item.imgUrls" class="imgs">
                        <image
                            class="img"
                            v-for="url in item.imgUrls"
                            :key="url"
                            :src="url"
                            @click="preview(url, item.imgUrls)"
                        />
                    </view>
                </view>
                <view class="complaint-item-footer">
                    <view @click="dealComplaint(item)">
                        立即处理
                        <uni-icons type="right" color="#62BBEC" size="12" />
                    </view>
                </view>
            </view>
        </view>
        <customTabbar :active="1" />
    </view>
</template>

<script>
import dicts from '@/utils/dicts'
import { todayOrYesterdayOrDateFormat, dayWeekTime } from '@/utils/format'
export default {
    filters: {
        finishTime({ finishTime }) {
            return dayWeekTime(finishTime)?.filter(Boolean).join(' ')
        },
        chapterNames({ chapters }) {
            return chapters?.map(item => item.chapterName)?.join('、')
        }
    },
    data() {
        return {
            dicts,
            complaintList: []
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
    },
    onShow() {
        this.init()
    },
    methods: {
        todayOrYesterdayOrDateFormat,
        dayWeekTime,
        async init() {
            try {
                const res = await this.$http.post('/mini/studentComplaint/listWaitDealComplaint')
                this.complaintList = res.data ?? []

                this.$store.dispatch('accountBusinessCount/setTabbarInfo', {
                    key: 'waitDealComplaintCount',
                    count: this.complaintList.length
                })
            } finally {
                uni.stopPullDownRefresh()
            }
        },

        preview(current, urls) {
            wx.previewImage({
                current,
                urls
            })
        },

        dealComplaint({ id }) {
            uni.navigateTo({ url: '/pages/admin/complaint/index?id=' + id })
        }
    },
    onPullDownRefresh() {
        this.init()
    },
}
</script>

<style lang="scss" scoped>
.mb-16 {
    margin-bottom: 16rpx;
}
.page {
    min-height: 100vh;
    padding-bottom: 100rpx;
    &-content {
        padding: 36rpx 30rpx;
        .complaint-item {
            background-color: #fff;
            border-radius: 20rpx;
            + .complaint-item {
                margin-top: 36rpx;
            }
            &-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16rpx 20rpx;
                border-bottom: 1px solid #f5f7fa;
                .left {
                    display: flex;
                    align-items: center;
                }
                .type {
                    font-size: 28rpx;
                    font-weight: 600;
                    color: #141f33;
                    margin-right: 50rpx;
                }
                .cover {
                    width: 40rpx;
                    height: 40rpx;
                    border-radius: 50%;
                    margin-right: 12rpx;
                }
                .name {
                    font-size: 24rpx;
                    color: #99a0ad;
                }
                .time {
                    font-size: 20rpx;
                    color: #99a0ad;
                }
            }
            &-content {
                border-bottom: 1px solid #f5f7fa;
                .infos {
                    display: flex;
                    justify-content: space-between;
                    padding: 20rpx 20rpx 20rpx 30rpx;
                    .info {
                        flex: 1;
                        .scores {
                            text + text {
                                margin-left: 16rpx;
                            }
                        }
                        .reason {
                            margin-bottom: 14rpx;
                        }
                        .content {
                            font-size: 20rpx;
                            color: #99a0ad;
                            line-height: 28rpx;
                        }
                        .content-2 {
                            font-size: 24rpx;
                            font-weight: 500;
                            color: #99a0ad;
                            line-height: 34rpx;
                        }
                    }
                    .teacher {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        margin-left: 20rpx;
                        .cover {
                            width: 40rpx;
                            height: 40rpx;
                            border-radius: 50%;
                            margin-bottom: 2rpx;
                        }
                        .name {
                            font-size: 20rpx;
                            color: #99a0ad;
                            line-height: 28rpx;
                        }
                    }
                }
                .imgs {
                    display: flex;
                    flex-wrap: wrap;
                    column-gap: 12rpx;
                    padding: 4rpx 30rpx 20rpx;
                    .img {
                        width: 98rpx;
                        height: 98rpx;
                        border-radius: 12rpx;
                    }
                }
            }
            &-footer {
                font-size: 24rpx;
                color: #62bbec;
                line-height: 34rpx;
                text-align: right;
                padding: 16rpx 20rpx;
            }
        }
    }
}
</style>
