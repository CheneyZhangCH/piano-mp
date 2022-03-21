<template>
    <view class="page">
        <view class="basic block">
            <view class="block-title">
                <text class="name">基本收入（元）</text>
                <text class="times">{{ times }}</text>
            </view>
            <view class="salary">{{ detail.salary }}</view>
            <view class="desc">* 基本收入为税前收入，额外奖金不含在内</view>
        </view>
        <view class="list block">
            <view class="container">
                <view class="block-title">
                    <text class="name">课时收入</text>
                    <text class="times">{{ times }}</text>
                    <text class="num">
                        总计
                        <text
                            class="sal"
                            :class="{ 'plus': courseSalary > 0, 'minus': courseSalary < 0 }"
                        >{{ courseSalary > 0 ? '+' : '' }}{{ courseSalary || '-' }}</text>元
                    </text>
                </view>
                <view class="wrap">
                    <template v-if="detail.courses.length">
                        <view
                            v-for="item in detail.courses"
                            class="item"
                            :key="item.courseId"
                            @click="toFinishLesson(item)"
                        >
                            <view class="name ellipsis">{{ item.courseName }}</view>
                            <view class="right">
                                <text
                                    class="num"
                                >{{ item.num }}{{ item.courseType === 'one' ? '节' : '人' }}</text>
                                <view class="salary">
                                    <text>+{{ item.salary }}元</text>
                                    <uni-icons type="right" size="12"></uni-icons>
                                </view>
                            </view>
                        </view>
                    </template>
                    <text v-else class="empty">-</text>
                </view>
            </view>
            <view class="container">
                <view class="block-title">
                    <text class="name">陪练收入</text>
                    <text class="times">{{ times }}</text>
                    <text class="num">
                        总计
                        <text
                            class="sal"
                            :class="{ 'plus': trainTicketSalary > 0, 'minus': trainTicketSalary < 0 }"
                        >{{ trainTicketSalary > 0 ? '+' : '' }}{{ trainTicketSalary || '-' }}</text>元
                    </text>
                </view>
                <view class="wrap">
                    <template v-if="detail.trainTickets.length">
                        <view
                            v-for="item in detail.trainTickets"
                            class="item"
                            :key="item.ticketId"
                            @click="toTrainTickets(item)"
                        >
                            <text class="name ellipsis">{{ item.ticketName }}</text>
                            <view class="right">
                                <text class="num">{{ item.num }}张</text>
                                <view class="salary">
                                    <text>+{{ item.salary }}元</text>
                                    <uni-icons type="right" size="12"></uni-icons>
                                </view>
                            </view>
                        </view>
                    </template>
                    <text v-else class="empty">-</text>
                </view>
            </view>
            <view class="container disciplines">
                <view class="block-title">
                    <text class="name">违规违纪</text>
                    <text class="times">{{ times }}</text>
                    <text class="num">
                        总计
                        <text
                            class="sal"
                            :class="{ 'plus': disciplineAmount > 0, 'minus': disciplineAmount < 0 }"
                        >{{ disciplineAmount > 0 ? '+' : '' }}{{ disciplineAmount || '-' }}</text>元
                    </text>
                </view>
                <view class="wrap">
                    <template v-if="detail.disciplines.length">
                        <view v-for="item in detail.disciplines" class="item" :key="item.id">
                            <text class="content ellipsis">· {{ item.content }}</text>
                            <text class="num">{{ item.amount }}元</text>
                        </view>
                    </template>
                    <text v-else class="empty">-</text>
                </view>
            </view>
        </view>
        <view class="update-to-next-month" @click="$refs.utnm.open()">
            更新至下个月
            <image src="/static/images/teacher/refresh.png" />
        </view>

        <pianoMessageBox
            ref="utnm"
            message="更新至下个月后收入将恢复至底薪 请问是否确认更新"
            showCancelButton
            @confirm="updateToNextMonthConfirm"
        />
    </view>
</template>

<script>
import dayjs from "dayjs";
export default {
    data() {
        return {
            teacherId: 0,
            detail: {}
        };
    },
    computed: {
        teacher() {
            return this.detail?.teacher ?? {}
        },
        times() {
            const start = this.detail?.startTime,
                end = this.detail?.endTime

            const s = start ? dayjs(start).format('YYYY/M/D') : '',
                e = end ? dayjs(end).format('YYYY/M/D') : ''
            return [s, e].filter(Boolean).join('~')
        },

        courseSalary() {
            return this.detail?.courseSalary ?? 0
        },
        trainTicketSalary() {
            return this.detail?.trainTicketSalary ?? 0
        },
        disciplineAmount() {
            return this.detail?.disciplineAmount ?? 0
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync("token");
        // 权限验证
        if (!token) {
            uni.showToast({ title: "请先登录", icon: "none" });
            return uni.navigateTo({ url: "/pages/login/index" });
        }
        this.teacherId = option.teacherId
        uni.setNavigationBarTitle({
            title: option.teacherName
        })
        this.init()
    },
    methods: {
        async init() {
            const res = await this.$http.get("/mini/teacher/getTeacherDataInfo?teacherId=" + this.teacherId);
            if (res.ok) {
                this.detail = res.data ?? {}
            }
        },

        toFinishLesson({ courseType, courseId }) {
            uni.navigateTo({ url: '/pages/teacher/xiaokeOrhexiaoRecord/index?courseType=' + courseType + '&courseId=' + courseId + '&teacherId=' + this.teacher.accountId })
        },

        toTrainTickets({ ticketId }) {
            uni.navigateTo({ url: '/pages/teacher/xiaokeOrhexiaoRecord/index?ticketId=' + ticketId + '&teacherId=' + this.teacher.accountId })
        },

        async updateToNextMonthConfirm() {
            try {
                const { endTime, salary, startTime } = this.detail
                const param = {
                    data: {
                        endTime, salary, startTime, teacherId: this.teacherId
                    }
                }
                await this.$http.post('/mini/teacher/updateTeacherSalary', param)
                uni.showToast({
                    title: '更新成功！',
                    icon: 'success',
                })
                this.$refs.utnm.close()
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    padding-top: 30rpx;
    .block {
        margin: 0 30rpx;
        background: #ffffff;
        border-radius: 10px;
        padding: 24rpx 24rpx 0 36rpx;
        .block-title {
            margin-bottom: 30rpx;
            .name {
                font-size: 28rpx;
                color: #141f33;
                margin-right: 12rpx;
            }
            .times {
                font-size: 20rpx;
                color: #99a0ad;
                align-self: flex-end;
            }
            .num {
                float: right;

                font-size: 24rpx;
                color: #141f33;
                .sal {
                    padding: 0 6rpx;
                    &.plus {
                        color: #f15e5e;
                    }
                    &.minus {
                        color: #44be5e;
                    }
                }
            }
        }
    }
    .basic {
        margin-bottom: 24rpx;
        padding-bottom: 10rpx;
        .salary {
            font-size: 48rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #141f33;
            line-height: 66rpx;
        }
        .desc {
            font-size: 16rpx;
            color: #99a0ad;
            text-align: right;
        }
    }
    .list {
        .container {
            padding-bottom: 30rpx;
            + .container {
                border-top: 1px solid #f5f7fa;
                padding-top: 24rpx;
            }
            .wrap {
                .item {
                    display: flex;
                    + .item {
                        margin-top: 16rpx;
                    }
                    .name,
                    .num,
                    .salary,
                    .content {
                        font-size: 24rpx;
                        color: #525666;
                    }
                    .name {
                        width: 284rpx;
                    }
                    .right {
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                    }
                }
                .empty {
                    font-size: 24rpx;
                    color: #99a0ad;
                    padding-left: 48rpx;
                }
            }
        }
        .disciplines {
            .wrap {
                .item {
                    justify-content: space-between;
                    .content {
                        flex: 1;
                        padding-right: 20rpx;
                    }
                }
            }
        }
    }
    .update-to-next-month {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 28rpx;
        color: #62bbec;
        line-height: 40rpx;
        margin-top: 48rpx;
        image {
            width: 24rpx;
            height: 22rpx;
            margin-left: 4rpx;
        }
    }
}
</style>
