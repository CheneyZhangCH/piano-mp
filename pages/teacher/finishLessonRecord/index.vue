<template>
    <view class="page">
        {{courseType}}
        <view class="page-records">
            <view class="title">
                <text class="time">{{ minMonth }}</text>
                <text class="len" v-if="records.length">共消课 {{ records.length }}节</text>
            </view>
            <view class="list">
                <view v-for="item in records" :key="item.id" class="item">
                    <view class="info">
                        <view class="chapters">
                            <view
                                v-for="c in item.chapters"
                                :key="c.id"
                                class="chapters-item ellipsis"
                            >{{ c.chapterName }}</view>
                        </view>
                        <view class="text">
                            <text>{{ item | time }}</text>
                        </view>
                        <view v-if="courseType === 'one'" class="text score">
                            <text>手型评分:{{ item.handScore || '-' }}分</text>
                            <text>识谱评分:{{ item.musicScore || '-' }}分</text>
                            <text>学习态度:{{ item.attitudeScore || '-' }}分</text>
                        </view>
                    </view>
                    <template v-if="item.students.length">
                        <view v-if="courseType === 'one'" class="touxiang one">
                            <image
                                class="cover"
                                :src="item.students[0].coverUrl || 'https://static.gangqintonghua.com/img/touxiang/pic1.webp'"
                            />
                            <text class="name ellipsis">{{ item.students[0].studentName }}</text>
                        </view>
                        <view v-else class="touxiang more">
                            <image v-for="s in item.students" :key="s.studentId" class="cover" :src="s.coverUrl || 'https://static.gangqintonghua.com/img/touxiang/pic1.webp'" />
                        </view>
                    </template>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import dayjs from "dayjs"
const CUR_MONTH = dayjs().format('YYYY-MM')
export default {
    filters: {
        time({ finishTime }) {
            if (!finishTime) return ''
            const day = dayjs(finishTime).format('YYYY-MM-DD')
            const week = '周' + ['', '一', '二', '三', '四', '五', '六', '日'][new Date(finishTime).getDay()]
            const time = dayjs(finishTime).format('HH:mm')
            return [day, week, time].join(' ')
        }
    },
    data() {
        return {
            courseType: '',
            courseId: 0,
            minMonth: CUR_MONTH,
            teacherId: 0,

            records: []
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.courseType = option.courseType
        this.courseId = option.courseId
        this.teacherId = option.teacherId
        this.handleSearch()
    },
    methods: {
        async handleSearch() {
            const { courseId, minMonth, teacherId } = this
            const param = {
                data: {
                    courseId,
                    minMonth,
                    teacherId
                }
            }
            try {
                const res = await this.$http.post('/mini/finishiLesson/searchFinishLesson', param)
                this.records = res.data ?? []
            } finally {
                uni.stopPullDownRefresh()
            }
        }
    },
    onPullDownRefresh() {
        this.handleSearch()
    },
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background-color: #fff;
    &-records {
        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 88rpx;
            line-height: 88rpx;
            background: #f5f7fa;
            padding: 0 14rpx 0 22rpx;
            .time {
                font-size: 28rpx;
                font-weight: 500;
                color: #141f33;
            }
            .len {
                font-size: 24rpx;
                color: #99a0ad;
            }
        }
        .list {
            .item {
                display: flex;
                align-items: center;
                margin: 0 30rpx;
                padding: 30rpx 0;
                .info {
                    flex: 1;
                    .chapters {
                        margin-bottom: 14rpx;
                        &-item {
                            font-size: 24rpx;
                            font-weight: 500;
                            color: #141f33;
                            line-height: 34rpx;
                            + .chapters-item {
                                margin-top: 16rpx;
                            }
                        }
                    }
                    .text {
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;
                        text + text {
                            margin-left: 22rpx;
                        }
                        + .text {
                            margin-top: 10rpx;
                        }
                    }
                }
                .touxiang {
                    display: flex;
                    &.one {
                        flex-direction: column;
                        align-items: center;
                        width: 110rpx;
                        .name {
                            width: 100%;
                            text-align: center;
                            font-size: 24rpx;
                            color: #616b80;
                            line-height: 17px;
                            margin-top: 2rpx;
                        }
                    }
                    &.more {
                        width: 160rpx;
                        column-gap: 4rpx;
                        row-gap: 4rpx;
                        flex-wrap: wrap;
                        justify-content: flex-end;
                    }
                    .cover {
                        width: 44rpx;
                        height: 44rpx;
                        border-radius: 50%;
                    }
                }
                &:not(:last-child) {
                    border-bottom: 1px solid #f5f7fa;
                }
            }
        }
    }
}
</style>
