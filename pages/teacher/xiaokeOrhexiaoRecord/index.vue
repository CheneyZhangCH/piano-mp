<template>
    <view class="page common" :class="{ 'page-selectAble': selectAble }">
        <view v-if="accountType !== 'TEACHER'" class="page-search" :class="{ 'student': accountType === 'STUDENT' }">
            <view v-if="accountType !== 'STUDENT'" class="mode" @click="toggleSearchMode">{{
                    mode === 'month' ? '自定义时间'
                        : '按月份筛选'
            }}</view>
            <view v-if="['ADMIN', 'SUPER_ADMIN', 'STUDENT'].includes(accountType) && courseId" class="switch"
                :class="{ selectAble }" @click="toggleSelectAble">
                <template v-if="['ADMIN', 'SUPER_ADMIN'].includes(accountType)">
                    <image class="refresh" :src="`/static/images/teacher/refresh${selectAble ? '-blue' : ''}.png`" />
                    恢复课时
                </template>
                <template v-else>
                    <image class="shensu" :src="`/static/images/student/shensu${selectAble ? '-blue' : ''}.png`" />课时申诉
                </template>
                <uni-icons v-if="selectAble" type="closeempty" color="#62BBEC" size="12" style="margin-left: 8rpx;" />
            </view>
        </view>
        <view class="page-records">
            <view class="title">
                <view class="time">
                    <template v-if="accountType !== 'TEACHER'">
                        <picker v-if="mode === 'month'" mode="date" fields="month" :value="month"
                            @change="onMonthChange">
                            {{ month || '请选择月份' }}
                            <image src="/static/images/audition/arrow_down_dark.png" class="arrow" />
                        </picker>

                        <uni-datetime-picker v-if="mode === 'range'" :value="dateRange" :border="false"
                            :clear-icon="false" type="daterange" @change="onDaterRangeChange">
                            {{ dateRange.length ? dateRange.join(' 至 ') : '请选择日期范围' }}
                            <image src="/static/images/audition/arrow_down_dark.png" class="arrow" />
                        </uni-datetime-picker>
                    </template>
                    <template v-else>
                        <text v-if="times">{{ times }}</text>
                    </template>
                </view>
                <text class="len" v-if="records.length">{{ recordsLen }}</text>
            </view>
            <view class="list">
                <template v-if="records.length">
                    <view v-for="item in records" :key="item.id" class="item" :class="{ 'ticket': !courseId }"
                        @click="onRecordClick(item)">
                        <template v-if="courseId">
                            <image v-if="selectAble" class="select-icon"
                                :src="`/static/images/student/icon-radio${selectedFinishLesson.id === item.id ? '-active' : ''}.png`" />
                            <view class="info">
                                <view class="chapters">
                                    <view v-for="c in item.chapters" :key="c.id" class="chapters-item ellipsis">{{
                                            c.chapterName || ''
                                    }}</view>
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
                            <template v-if="accountType === 'STUDENT'">
                                <view v-if="item.teacher" class="touxiang one">
                                    <image class="cover" :src="item.teacher.coverUrl" />
                                    <text class="name ellipsis">{{ item.teacher.teacherName }}</text>
                                </view>
                            </template>
                            <template v-else>
                                <template v-if="item.students.length">
                                    <view v-if="courseType === 'one'" class="touxiang one">
                                        <image class="cover" :src="getStudentCoverUrl(item.students[0])" />
                                        <text class="name ellipsis">{{ item.students[0].studentName }}</text>
                                    </view>
                                    <view v-else class="touxiang more">
                                        <image v-for="s in item.students" :key="s.studentId" class="cover"
                                            :src="getStudentCoverUrl(s)" />
                                    </view>
                                </template>
                            </template>
                        </template>
                        <template v-else>
                            <view class="ticket-time">
                                <text>{{ item | day }}</text>
                                <text>{{ item | weekAndTime }}</text>
                            </view>
                            <view class="ticket-name">
                                <text>{{ item | ticketName }}</text>
                            </view>
                        </template>
                    </view>
                </template>
            </view>
        </view>
        <view v-if="['ADMIN', 'SUPER_ADMIN', 'STUDENT'].includes(accountType) && courseId && selectAble"
            class="page-footer">
            <template v-if="['ADMIN', 'SUPER_ADMIN'].includes(accountType)">
                <!-- 一对一、一对多但只有一个学生 -->
                <button
                    v-if="courseType === 'one' || (courseType === 'more' && (!selectedFinishLesson || selectedFinishLesson && selectedFinishLesson.students.length === 1))"
                    class="btn" :class="{ confirm: !!selectedFinishLesson, disabled: !selectedFinishLesson }"
                    :disabled="!selectedFinishLesson" @click="openRecoverLesson(0)">确定</button>
                <picker v-else class="btn confirm picker" :value="recoverLessonStudent" range-key="studentName"
                    :range="selectedFinishLesson.students" @change="onRecoverLessonStudentChange">确定</picker>
            </template>
            <button v-else class="btn" :class="{ confirm: !!selectedFinishLesson, disabled: !selectedFinishLesson }"
                :disabled="!selectedFinishLesson" @click="toComplaint">确定</button>
        </view>

        <uni-popup ref="recoverLesson" :is-mask-click="false" type="center">
            <view class="piano-message-box">
                <view class="piano-message-box__content">
                    <view class="piano-message-box__message">恢复该课时后老师与家长数据相应发生改变</view>
                    <view class="piano-message-box__message">请问是否确认恢复</view>
                </view>
                <view class="piano-message-box__btns">
                    <button class="btn cancel" @click="$refs.recoverLesson.close()">取消</button>
                    <button class="btn confirm" @click="confirmRecoverLesson">确认</button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import dayjs from "dayjs"
const CUR_MONTH = dayjs().format('YYYY-MM')
const DEFAULT_RANGE_DATE = [dayjs().subtract(15, 'days').format('YYYY-MM-DD'), dayjs().add(15, 'days').format('YYYY-MM-DD')]
import { WEEK_DAY } from '@/utils/format'
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
        },
        // 4个字换行
        ticketName({ ticketName: name }) {
            return name.substr(0, 4) + '\n' + name.substr(4)
        }
    },
    data() {
        return {
            mode: 'month',
            month: CUR_MONTH,
            dateRange: [],

            courseType: '',
            courseId: 0,
            ticketId: 0,
            teacherId: 0,
            studentId: 0,
            startTime: undefined,
            endTime: undefined,

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
        },
        times() {
            const start = +this.startTime,
                end = +this.endTime

            const s = start ? dayjs(start).format('YYYY年M月D日') : '',
                e = end ? dayjs(end).format('YYYY年M月D日') : ''
            console.log(s, e)
            return [s, e].filter(Boolean).join(' 至 ')
        },
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
        this.teacherId = option?.teacherId ?? 0
        this.studentId = option?.studentId ?? 0
        this.startTime = option?.startTime ?? undefined
        this.endTime = option?.endTime ?? undefined

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
            const { month, dateRange, courseId, ticketId, teacherId, studentId } = this

            const param = {
                data: {
                    ...(courseId ? {
                        courseId
                    } : {
                        ticketId
                    }),
                    // 老师端显示的时间是带过来只用于显示
                    ...(this.accountType === 'TEACHER' ? {} : this.mode === 'month' ? {
                        minMonth: month,
                        maxMonth: month
                    } : {
                        minDate: dateRange[0],
                        maxDate: dateRange[1]
                    }),
                    ...(teacherId ? {
                        teacherId
                    } : {
                        studentId
                    })
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
            } catch (error) {
                console.log(error)
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

    &.page-selectAble {
        padding-bottom: 148rpx;
    }

    &-search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 30rpx;
        min-height: 88rpx;

        &.student {
            justify-content: flex-end;
        }

        .mode {
            border-radius: 4px;
            border: 1px solid;
            border-image: linear-gradient(90deg,
                    rgba(97, 186, 236, 1),
                    rgba(132, 218, 238, 1)) 1 1;

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
                margin-right: 8rpx;
            }

            .shensu {
                width: 24rpx;
                height: 26rpx;
                margin-right: 6rpx;
            }

            &.selectAble {
                background: #e2f3ff;
                border-radius: 6px;
                border: 1px solid #62bbec;
                padding: 6rpx 10rpx 4rpx 20rpx;

                font-weight: 600;
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
                font-weight: 600;
                // color: #141f33;
            }

            .len {
                font-size: 24rpx;
                color: #99a0ad;
            }

            .arrow {
                width: 20rpx;
                height: 20rpx;
                margin-left: 6rpx;
            }
        }

        .list {
            .item {
                display: flex;
                align-items: center;
                margin: 0 30rpx;
                padding: 30rpx 0;

                &.ticket {
                    justify-content: space-between;
                }

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
                            font-weight: 600;
                            color: #141f33;
                            line-height: 34rpx;

                            +.chapters-item {
                                margin-top: 16rpx;
                            }
                        }
                    }

                    .text {
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;

                        text+text {
                            margin-left: 22rpx;
                        }

                        +.text {
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
                        display: flex;
                        flex-direction: column;
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;

                        text {
                            text-align: center;

                            +text {
                                margin-top: 4rpx;
                            }
                        }
                    }

                    &-name {
                        width: 120rpx;
                        font-size: 24rpx;
                        font-weight: 600;
                        color: #141f33;
                        line-height: 34rpx;
                        text-align: center;
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

<style lang="scss" src="@/common/piano-message-box.scss">
</style>
