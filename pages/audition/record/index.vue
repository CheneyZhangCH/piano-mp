<template>
    <view class="page">
        <view v-if="list.length" class="page-list">
            <tui-sticky v-for="(listItem, listIndex) in list" :key="listItem.date" class="page-list-item"
                :scrollTop="scrollTop">
                <template v-slot:header>
                    <view class="page-list-item__title">
                        <view class="sub-title" @click="$refs.datetime.show()">
                            <text class="date">{{ listItem.date }}</text>
                            <image src="/static/images/audition/arrow_down_dark_new.png" class="arrow" />
                        </view>
                        <view class="desc">{{ `开通账号${listItem.items.length}个` }}</view>
                    </view>
                </template>
                <template v-slot:content>
                    <view class="page-list-item__content">
                        <view v-for="(item, itemIndex) in listItem.items" :key="itemIndex" class="item">
                            <image class="avatar" :src="getStudentCoverUrl(item.student)">
                            </image>
                            <view class="content">
                                <view class="student-info">
                                    <view>
                                        <text class="name">{{ item.student.studentName }}</text>
                                        <image class="gender-icon"
                                            :src="`/static/images/student/${item.student.gender || 'male'}-selected.png`">
                                        </image>
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
                                        <image class="arrow"
                                            :src="`/static/images/audition/arrow_${item.folded ? 'down' : 'up'}.png`">
                                        </image>
                                    </view>
                                </view>

                                <template v-if="!item.folded">
                                    <view v-for="course in item.contract.courses" :key="course.courseId" class="course">
                                        <text>{{ course.courseName }}({{ course.teacherName }})</text>
                                        <text>周{{ WEEK_DAY[course.dayOfWeek] }}</text>
                                        <text>{{ course.timetablePeriodName }}</text>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </view>
                </template>
            </tui-sticky>
        </view>
        <uni-datetime-picker ref="datetime" :value="dateRange" :border="false" :clear-icon="false" type="daterange"
            @change="onDaterRangeChange">
            <text />
        </uni-datetime-picker>
    </view>
</template>
<script>
import tuiSticky from "@/components/ThorUi/tui-sticky"
import dayjs from "dayjs";
import { WEEK_DAY } from '@/utils/format'
const DEFAULT_RANGE_DATE = [dayjs().subtract(15, 'days').format('YYYY-MM-DD'), dayjs().add(15, 'days').format('YYYY-MM-DD')]
export default {
    components: {
        tuiSticky
    },
    data() {
        return {
            datetimeFlag: false,
            dateRange: DEFAULT_RANGE_DATE,
            WEEK_DAY,

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
        onDaterRangeChange(e) {
            this.datetimeFlag = true
            this.dateRange = e
            this.handleSearch()
        },

        async handleSearch() {
            const { dateRange } = this
            const param = {
                data: {
                    ...(this.datetimeFlag && dateRange.length ? {
                        minDate: dateRange[0],
                        maxDate: dateRange[1]
                    } : {})
                }
            }
            uni.showLoading({ title: '加载中' })
            try {
                const res = await this.$http.post('/mini/studentContract/getAccountContracts', param)

                const result = []
                if (res.data?.length) {
                    for (let i = 0; i < res.data.length; i++) {
                        const item = res.data[i]
                        item.folded = true
                        item.contract.createDate = dayjs(item.contract.createTime).format('YYYY-MM-DD')

                        const date = !this.datetimeFlag ? dayjs(item.contract.createTime).format('YYYY年MM月') : this.dateRange.join(' 至 ')
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

    &-list {
        &-item {

            &__title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 88rpx;
                background: #f5f7fa;
                padding-left: 32rpx;
                padding-right: 30rpx;

                .sub-title {
                    display: flex;
                    align-items: center;

                    .date {
                        font-size: 28rpx;
                        font-weight: 600;
                        color: #141f33;
                    }

                    .arrow {
                        width: 20rpx; // 40*25
                        height: 12rpx;
                        margin-left: 6rpx;
                    }
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

                            .arrow {
                                width: 20rpx;
                                height: 20rpx;
                            }
                        }

                        .course {
                            margin-top: 12rpx;
                            font-size: 24rpx;
                            color: #99a0ad;
                            line-height: 34rpx;

                            text+text {
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
