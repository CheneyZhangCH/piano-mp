<template>
    <view class="page">
        <view class="page-search">
            <view class="mode" @click="toggleSearchMode">{{ mode === 'month' ? '自定义时间' : '按月份筛选' }}</view>
            <view>
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
        </view>

        <view v-if="list.length" class="page-list">
            <tui-sticky v-for="(listItem, listIndex) in list" :key="listItem.date" class="page-list-item" :scrollTop="scrollTop">
                <template v-slot:header>
                    <view class="page-list-item__title">
                        <view class="sub-title">
                            <text>{{ listItem.date }}</text>
                            <image class="arrow_down" src="/static/images/arrow_down_dark.png"></image>
                        </view>
                        <view class="desc">{{ `开通账号${listItem.items.length}个` }}</view>
                    </view>
                </template>
			    <template v-slot:content>
                    <view class="page-list-item__content">
                        <view v-for="(item, itemIndex) in listItem.items" :key="itemIndex"
                            class="item">
                            <image class="avatar"
                                :src="`/static/images/audition/${item.student.gender || 'male'}.png`">
                            </image>
                            <view class="content">
                                <view class="student-info">
                                    <view>
                                        <text class="name">{{ item.student.studentName }}</text>
                                        <image class="gender-icon"
                                            :src="`/static/images/${item.student.gender || 'male'}_selected.png`"></image>
                                        <text class="age">{{ `${item.student.age}岁` }}</text>
                                    </view>
                                    <view>
                                        <text class="date">{{ item.contract.createDate }}</text>
                                    </view>
                                </view>
                                <view class="package-info">
                                    <text class="period">{{ item.contract.packageName }}</text>
                                    <view @click="toggleFolded(listIndex, itemIndex)">
                                        <text class="more">更多信息</text>
                                        <image class="arrow_down"
                                            :src="`/static/images/audition/arrow_${item.folded ? 'down' : 'up'}.png`">
                                        </image>
                                    </view>
                                </view>

                                <template v-if="!item.folded">
                                    <view v-for="course in item.contract.courses" :key="course.courseId"
                                        class="course">
                                        <text>{{ course.courseName }}({{ course.teacherName }}老师)</text>
                                        <text>{{ dayOfWeekOBj[course.dayOfWeek] }}</text>
                                        <text>{{ course.timetablePeriodName }}</text>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </view>
                </template>
            </tui-sticky>
        </view>
    </view>
</template>
<script>
import tuiSticky from "@/components/ThorUi/tui-sticky/better-sticky"
import dayjs from "dayjs";
const CUR_MONTH = dayjs().format('YYYY-MM')
const DEFAULT_RANGE_DATE = [dayjs().subtract(15, 'days').format('YYYY-MM-DD'), dayjs().add(15, 'days').format('YYYY-MM-DD')]
export default {
    components: {
        tuiSticky
    },
    data() {
        return {
            mode: 'month',
            month: '',
            dateRange: [],

            dayOfWeekOBj: { 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 7: '周日', },

            list: {},
            scrollTop: 0
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
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
            const { month, dateRange } = this
            const param = {
                data: {
                    ...(this.mode === 'month' ? (month ? {
                        minMonth: month,
                        maxMonth: month
                    } : {}) : (dateRange.length ? {
                        minDate: dateRange[0],
                        maxDate: dateRange[1]
                    } : {}))
                }
            }
            uni.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.post('/mini/studentContract/getAccountContracts', param)

                const result = []
                if (res.data?.length) {
                    for (let i = 0; i < res.data.length; i++) {
                        const item = res.data[i]
                        const date = dayjs(item.contract.createTime).format('YYYY年MM月')

                        item.folded = true
                        item.contract.createDate = dayjs(item.contract.createTime).format('YYYY-MM-DD')

                        const temp = result.find(_ => _.date === date)
                        if (temp) {
                            temp.items.push(item)
                        } else {
                            result.push({
                                date,
                                items: [item]
                            })
                        }
                    }
                }
                this.list = result
            } finally {
                uni.hideLoading()
                uni.stopPullDownRefresh()
            }
        },

        toggleFolded(listIndex, itemIndex) {
            this.list[listIndex].items[itemIndex].folded = !this.list[listIndex].items[itemIndex].folded
        }
    },
    onPullDownRefresh() {
        this.handleSearch()
    },
    //页面滚动执行方式
    onPageScroll(e) {
        this.scrollTop = e.scrollTop
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background-color: #fff;

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
    &-list {
        &-item {
            .arrow_down {
                width: 20rpx;
                height: 20rpx;
            }
            &__title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 88rpx;
                background: #f5f7fa;
                padding-left: 32rpx;
                padding-right: 30rpx;
                .sub-title {
                    font-size: 28rpx;
                    color: #141f33;
                }
                .desc {
                    font-size: 24rpx;
                    color: #99a0ad;
                }
            }
            &__content {
                margin: 0 18rpx;
                .item {
                    display: flex;
                    justify-content: space-between;
                    padding: 24rpx 16rpx 24rpx 20rpx;
                    border-bottom: 2rpx solid #f5f7fa;
                    .avatar {
                        width: 100rpx;
                        height: 100rpx;
                        border-radius: 50%;
                        margin-right: 24rpx;
                    }
                    .content {
                        flex: 1;
                        overflow: hidden;
                        padding-top: 6rpx;
                        .student-info {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 14rpx;
                            .name {
                                font-size: 28rpx;
                                font-weight: 500;
                                color: #141f33;
                                line-height: 40rpx;
                                margin-right: 16rpx;
                            }
                            .gender-icon {
                                width: 24rpx;
                                height: 24rpx;
                                margin-right: 8rpx;
                            }

                            .age {
                                font-size: 24rpx;
                                color: #525666;
                            }
                            .date {
                                font-size: 24rpx;
                                color: #141f33;
                            }
                        }
                        .package-info {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            .period {
                                font-size: 24rpx;
                                color: #525666;
                            }
                            .more {
                                font-size: 24rpx;
                                color: #99a0ad;
                            }
                        }
                        .course {
                            margin-top: 12rpx;
                            font-size: 24rpx;
                            color: #99a0ad;
                            line-height: 34rpx;
                            text + text {
                                margin-left: 16rpx;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
