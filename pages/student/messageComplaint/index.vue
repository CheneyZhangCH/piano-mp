<template>
    <view class="page">
        <view v-for="item in records" :key="item.id" class="record">
            <view class="record-title">
                <text class="name">{{ complaintType[item.complaintType] }}</text>
                <text class="date">{{ weekOrDateTime(item.createTime) }}</text>
            </view>
            <view class="record-content">
                <view class="infos">
                    <view class="info">
                        <template v-if="item.complaintType === 'finishLesson' && item.finishLesson">
                            <view class="content-2 mb-16">{{ item.finishLesson | chapterNames }}</view>
                            <view class="content mb-16">{{ item.finishLesson | finishTime }}</view>
                            <view v-if="item.finishLesson.courseType === 'one'" class="scores content mb-16">
                                <text>手型评分:{{ item.finishLesson.handScore || 0 }}分</text>
                                <text>识谱评分:{{ item.finishLesson.musicScore || 0 }}分</text>
                                <text>学习态度:{{ item.finishLesson.attitudeScore || 0 }}分</text>
                            </view>
                        </template>
                        <view v-else class="content-2 mb-16">投诉原因：{{ item.complaintReason }}</view>
                        <view class="content">投诉详情：{{ item.content }}</view>
                    </view>
                    <view v-if="item.complaintType === 'finishLesson' && item.finishLesson" class="teacher">
                        <image class="cover" :src="item.finishLesson.teacher.coverUrl" />
                        <text class="name">{{ item.finishLesson.teacher.teacherName }}</text>
                    </view>
                </view>
                <view v-if="item.imgUrls.length" class="imgs">
                    <image class="img" v-for="url in item.imgUrls" :key="url" :src="url"
                        @click="preview(url, item.imgUrls)" />
                </view>
                <view class="deal-content">
                    <text>{{ item.dealContent }}</text>
                </view>
                <image class="status"
                    :src="`https://static.gangqintonghua.com/img/icon/audit${item.status === 'deal' ? '' : '-not'}-deal.png`"></image>
            </view>
        </view>
    </view>
</template>

<script>
import { complaintType } from '@/utils/dicts'
import { weekOrDateTime, dayWeekTime } from "@/utils/format"
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
            complaintType,
            records: []
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.init()
    },
    methods: {
        weekOrDateTime,
        async init() {
            try {
                const res = await this.$http.post('/mini/studentComplaint/listDealComplaintForStudent')
                this.records = res.data ?? []
            } catch (error) {

            }
        }
    },
}
</script>

<style lang="scss" scoped>
.mb-16 {
    margin-bottom: 16rpx;
}
.page {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 48rpx 0;
    .record {
        background: #ffffff;
        border-radius: 20rpx;
        margin: 0 30rpx;
        + .record {
            margin-top: 48rpx;
        }
        &-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16rpx 30rpx;
            border-bottom: 2rpx solid #f5f7fa;
            .name {
                font-size: 28rpx;
                font-weight: 500;
                color: #141f33;
                line-height: 40rpx;
            }
            .date {
                font-size: 20rpx;
                color: #99a0ad;
            }
        }
        &-content {
            padding: 16rpx 20rpx 16rpx 30rpx;
            position: relative;
            .infos {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30rpx;
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
                column-gap: 10rpx;
                margin-bottom: 32rpx;
                .img {
                    width: 100rpx;
                    height: 100rpx;
                    border-radius: 12rpx;
                }
            }
            .deal-content {
                font-size: 24rpx;
                color: #141F33;
                line-height: 34rpx;
            }
            .status {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 144rpx;
                height: 126rpx;
            }
        }
    }
}
</style>
