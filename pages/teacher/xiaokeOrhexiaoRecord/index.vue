<template>
    <view class="page common" :class="{ selectAble }">
        <view class="page-search">
            <view class="mode" @click="toggleSearchMode">{{ mode === 'month' ? '自定义时间' : '按月份筛选' }}</view>
            <view
                v-if="['ADMIN', 'STUDENT'].includes(accountType) && courseId"
                class="switch"
                :class="{ selectAble }"
                @click="toggleSelectAble"
            >
                <template v-if="accountType === 'ADMIN'">
                    <image class="refresh" src="/static/images/teacher/refresh.png" />恢复课时
                </template>
                <template v-else>
                    <image
                        class="refresh"
                        :src="`/static/images/student/shensu${selectAble ? '-blue' : ''}.png`"
                    />课时申诉
                </template>
                <uni-icons
                    v-if="selectAble"
                    type="closeempty"
                    color="#62BBEC"
                    size="12"
                    style="margin-left: 8rpx;"
                />
            </view>
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
                        :value="dateRange"
                        :border="false"
                        :clear-icon="false"
                        type="daterange"
                        @change="onDaterRangeChange"
                    >
                        {{ dateRange.length ? dateRange.join(' 至 ') : '请选择日期范围' }}
                        <uni-icons type="bottom" size="14" style="margin-left: 6rpx;" />
                    </uni-datetime-picker>
                </view>
                <text class="len" v-if="records.length">{{ recordsLen }}</text>
            </view>
            <view class="list">
                <template v-if="records.length">
                    <view
                        v-for="item in records"
                        :key="item.id"
                        class="item"
                        @click="onRecordClick(item)"
                    >
                        <template v-if="courseId">
                            <image
                                v-if="selectAble"
                                class="select-icon"
                                :src="`/static/images/student/icon-radio${selectedFinishLesson.id === item.id ? '-active' : ''}.png`"
                            />
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
                                        :src="item.students[0].coverUrl || defaultCover"
                                    />
                                    <text class="name ellipsis">{{ item.students[0].studentName }}</text>
                                </view>
                                <view v-else class="touxiang more">
                                    <image
                                        v-for="s in item.students"
                                        :key="s.studentId"
                                        class="cover"
                                        :src="s.coverUrl || defaultCover"
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
        <view
            v-if="['ADMIN', 'STUDENT'].includes(accountType) && courseId && selectAble"
            class="page-footer"
        >
            <template v-if="accountType === 'ADMIN'">
                <!-- 一对一、一对多但只有一个学生 -->
                <button
                    v-if="courseType === 'one' || (courseType === 'more' && (!selectedFinishLesson || selectedFinishLesson && selectedFinishLesson.students.length === 1))"
                    class="btn"
                    :class="{ confirm: !!selectedFinishLesson, disabled: !selectedFinishLesson }"
                    :disabled="!selectedFinishLesson"
                    @click="openRecoverLesson(0)"
                >确定</button>
                <picker
                    v-else
                    class="btn confirm picker"
                    :value="recoverLessonStudent"
                    range-key="studentName"
                    :range="selectedFinishLesson.students"
                    @change="onRecoverLessonStudentChange"
                >确定</picker>
            </template>
            <button
                v-else
                class="btn"
                :class="{ confirm: !!selectedFinishLesson, disabled: !selectedFinishLesson }"
                :disabled="!selectedFinishLesson"
                @click="toComplaint"
            >确定</button>
        </view>
        <pianoMessageBox
            ref="recoverLesson"
            message="恢复该课时后老师与家长数据相应发生改变 请问是否确认恢复"
            showCancelButton
            @confirm="confirmRecoverLesson"
        />
    </view>
</template>

<script>
import dayjs from "dayjs"
const CUR_MONTH = dayjs().format('YYYY-MM')
const DEFAULT_RANGE_DATE = [dayjs().subtract(15, 'days').format('YYYY-MM-DD'), dayjs().add(15, 'days').format('YYYY-MM-DD')]
const WEEK_DAY = ['', '一', '二', '三', '四', '五', '六', '日']
export default {
    filters: {
        time({ finishTime }) {
            if (!finishTime) return ''
            const day = dayjs(finishTime).format('YYYY-MM-DD')
            const week = '周' + WEEK_DAY[new Date(finishTime).getDay()]
            const time = dayjs(finishTime).format('HH:mm')
            return [day, week, time].join(' ')
        },
        day({ useTime }) {
            if (!useTime) return ''
            return dayjs(useTime).format('YYYY-MM-DD')
        },
        weekAndTime({ useTime }) {
            if (!useTime) return ''
            const week = '周' + WEEK_DAY[new Date(useTime).getDay()]
            const time = dayjs(useTime).format('HH:mm')
            return [week, time].join(' ')
        }
    },
    data() {
        return {
            defaultCover: 'https://static.gangqintonghua.com/img/touxiang/pic1.webp',
            mode: 'month',
            month: CUR_MONTH,
            dateRange: [],

            courseType: '',
            courseId: 0,
            ticketId: 0,
            teacherId: 0,

            records: [],

            accountType: '',

            selectAble: false,
            selectedFinishLesson: null,
            recoverLessonStudent: 0,
            recoverLessonParam: {}
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
        const accountType = uni.getStorageSync('accountType')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.accountType = accountType

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
            this.dateRange = DEFAULT_RANGE_DATE
            this.handleSearch()
        },

        onMonthChange(e) {
            this.month = e.detail.value
            this.handleSearch()
        },

        onDaterRangeChange(e) {
            this.dateRange = e
            this.handleSearch()
        },

        async handleSearch() {
            const { month, dateRange, courseId, ticketId, teacherId } = this

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
                        minDate: dateRange[0],
                        maxDate: dateRange[1]
                    }),
                    teacherId
                }
            }
            uni.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.post(`/mini/${courseId ? 'finishiLesson/searchFinishLesson' : 'trainTicket/searchUsedTrainTicket'}`, param)
                this.records = res.data ?? []
                this.selectedFinishLesson = null
            } finally {
                uni.hideLoading()
                uni.stopPullDownRefresh()
            }
        },

        toggleSelectAble() {
            this.selectAble = !this.selectAble
            this.selectedFinishLesson = null
        },

        onRecordClick(item) {
            if (!this.selectAble) return
            this.selectedFinishLesson = this.selectedFinishLesson?.id === item.id ? null : item
        },

        // 一对多且有多个学生
        onRecoverLessonStudentChange(e) {
            const value = e.detail.value
            this.recoverLessonStudent = value
            this.openRecoverLesson(value)
        },

        openRecoverLesson(index) {
            const { id, students } = this.selectedFinishLesson
            this.recoverLessonParam = {
                finishLessonId: id,
                studentId: students[index].studentId
            }
            this.$refs.recoverLesson.open()
        },

        async confirmRecoverLesson() {
            try {
                await this.$http.post('/mini/finishiLesson/recoverLesson', this.recoverLessonParam)
                this.$toast({
                    title: '消课成功！',
                    icon: 'success'
                })
                this.$refs.recoverLesson.close()
                this.handleSearch()
            } finally {
                this.$refs.recoverLesson.loading = false
            }
        },

        toComplaint() {
            uni.navigateTo({ url: '/pages/student/complaint/index?finishLessonId=' + this.selectedFinishLesson.id })
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
    &.selectAble {
        padding-bottom: 148rpx;
    }
    &-search {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        .switch {
            font-size: 24rpx;
            color: #141f33;
            .refresh {
                width: 24rpx;
                height: 22rpx;
                margin-right: 4rpx;
            }
            &.selectAble {
                background: #e2f3ff;
                border-radius: 6px;
                border: 1px solid #62bbec;
                padding: 6rpx 10rpx 4rpx 20rpx;

                font-weight: 500;
                color: #62bbec;
                line-height: 34rpx;
            }
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
                .select-icon {
                    width: 28rpx;
                    height: 28rpx;
                    margin-right: 20rpx;
                }
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
                        color: #99a0ad;
                        line-height: 34rpx;
                        text + text {
                            margin-top: 4rpx;
                        }
                    }
                    &-name {
                        width: 120rpx;
                        font-size: 24rpx;
                        font-weight: 500;
                        color: #141f33;
                        line-height: 34rpx;
                    }
                }
            }
        }
    }
    &-footer {
        .picker {
            text-align: center;
        }
    }
}
</style>
