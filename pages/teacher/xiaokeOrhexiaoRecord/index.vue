<template>
    <view class="page">
        <view class="page-search">
            <view class="mode" @click="toggleSearchMode">{{ mode === 'month' ? '自定义时间' : '按月份筛选' }}</view>
        </view>
        <view class="page-records">
            <view class="title">
                <view class="time">
                    <picker
                        v-if="mode === 'month'"
                        mode="date"
                        fields="month"
                        :value="month"
                        @change="onMonthChange"
                    >
                        {{ month || '请选择月份' }}
                        <uni-icons type="bottom" size="14" style="margin-left: 6rpx;" />
                    </picker>

                    <uni-datetime-picker
                        v-if="mode === 'range'"
                        :value="range"
                        :border="false"
                        :clear-icon="false"
                        type="daterange"
                        @change="onDaterRangeChange"
                    >
                        {{ range.length ? range.join(' 至 ') : '请选择日期范围' }}
                        <uni-icons type="bottom" size="14" style="margin-left: 6rpx;" />
                    </uni-datetime-picker>
                </view>
                <text class="len" v-if="records.length">{{ recordsLen }}</text>
            </view>
            <view class="list">
                <template v-if="records.length">
                    <view v-for="item in records" :key="item.id" class="item">
                        <template v-if="courseId">
                            <view class="info">
                                <view class="chapters">
                                    <view
                                        v-for="c in item.chapters"
                                        :key="c.id"
                                        class="chapters-item ellipsis"
                                    >{{ c.chapterName || '' }}</view>
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
                                    <image
                                        v-for="s in item.students"
                                        :key="s.studentId"
                                        class="cover"
                                        :src="s.coverUrl || 'https://static.gangqintonghua.com/img/touxiang/pic1.webp'"
                                    />
                                </view>
                            </template>
                        </template>
                        <template v-else>
                            <view class="ticket-time">
                                <text>{{ item | day }}</text>
                                <text>{{ item | weekAndTime }}</text>
                            </view>
                            <view class="ticket-name">{{ item.ticketName }}</view>
                        </template>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
import dayjs from "dayjs"
const CUR_MONTH = dayjs().format('YYYY-MM')
const DEFAULT_RANGE_DATE = [dayjs().subtract(15, 'days').format('YYYY-MM-DD'), dayjs().add(15, 'days').format('YYYY-MM-DD')]
export default {
    filters: {
        time({ finishTime }) {
            if (!finishTime) return ''
            const day = dayjs(finishTime).format('YYYY-MM-DD')
            const week = '周' + ['', '一', '二', '三', '四', '五', '六', '日'][new Date(finishTime).getDay()]
            const time = dayjs(finishTime).format('HH:mm')
            return [day, week, time].join(' ')
        },
        day({ useTime }) {
            if (!useTime) return ''
            return dayjs(useTime).format('YYYY-MM-DD')
        },
        weekAndTime({ useTime }) {
            if (!useTime) return ''
            const week = '周' + ['', '一', '二', '三', '四', '五', '六', '日'][new Date(useTime).getDay()]
            const time = dayjs(useTime).format('HH:mm')
            return [week, time].join(' ')
        }
    },
    data() {
        return {
            mode: 'month',
            month: CUR_MONTH,
            range: [],

            courseType: '',
            courseId: 0,
            ticketId: 0,
            teacherId: 0,

            records: []
        }
    },
    computed: {
        recordsLen() {
            if (this.courseId) {
                if (this.courseType === 'one') return `共消课 ${this.records.length}节`
                return `共消课 ${this.records.reduce((acc, cur) => acc + cur.students.length, 0)}人`
            }
            return `共核销 ${this.records.length}张`
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }

        this.courseType = option.courseType ?? ''
        this.courseId = option.courseId ?? 0
        this.ticketId = option.ticketId ?? 0
        this.teacherId = option.teacherId

        uni.setNavigationBarTitle({
            title: this.courseId ? '消课记录' : '核销记录'
        })
        this.handleSearch()
    },
    methods: {
        toggleSearchMode() {
            this.mode = (this.mode === 'month' ? 'range' : 'month')
            this.month = CUR_MONTH
            this.range = DEFAULT_RANGE_DATE
            this.handleSearch()
        },

        onMonthChange(e) {
            this.month = e.detail.value
            this.handleSearch()
        },

        onDaterRangeChange(e) {
            this.range = e
            this.handleSearch()
        },

        async handleSearch() {
            const { month, range, courseId, ticketId, teacherId } = this

            const param = {
                data: {
                    ...(courseId ? {
                        courseId
                    } : {
                        ticketId
                    }),
                    ...(this.mode === 'month' ? {
                        minMonth: month,
                        maxMonth: month
                    } : {
                        minDate: range[0],
                        maxDate: range[1]
                    }),
                    teacherId
                }
            }
            wx.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.post(`/mini/${courseId ? 'finishiLesson/searchFinishLesson' : 'trainTicket/searchUsedTrainTicket'}`, param)
                this.records = res.data ?? []
            } finally {
                wx.hideLoading()
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
    &-search {
        display: flex;
        padding: 20rpx 30rpx;
        .mode {
            border-radius: 4px;
            border: 1px solid;
            border-image: linear-gradient(
                    90deg,
                    rgba(97, 186, 236, 1),
                    rgba(132, 218, 238, 1)
                )
                1 1;

            padding: 2rpx 10rpx;
            font-size: 28rpx;
            color: #62bbec;
            line-height: 20px;
        }
    }
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
                // font-size: 28rpx;
                font-weight: 500;
                // color: #141f33;
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
                .ticket {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    &-time {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        font-size: 24rpx;
                        color: #99A0AD;
                        line-height: 34rpx;
                        text+ text {
                            margin-top: 4rpx;
                        }
                    }
                    &-name {
                        width: 120rpx;
                        font-size: 24rpx;
                        font-weight: 500;
                        color: #141F33;
                        line-height: 34rpx;
                    }
                }
            }
        }
    }
}
</style>
