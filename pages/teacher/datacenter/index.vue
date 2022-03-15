<template>
    <view class="page">
        <view class="custom-header">
            <view class="title" :style="customTitleStyle">
                数据中心
            </view>
        </view>
        <view v-if="!groupId" class="page-content">
            <view class="user">
                <image :src="teacher.coverUrl || 'https://static.gangqintonghua.com/img/touxiang/pic1.webp'" class="cover" />
                <view class="info">
                    <view class="msg">
                        <text class="name">{{ teacher.teacherName }}</text>
                        <template v-if="groups.length">
                            <text v-for="g in groups" :key="g.id" class="group">{{ g.groupName }}</text>
                        </template>
                    </view>
                    <view class="yanquan" @click="handleYanQuan">
                        <text>输码验券</text>
                        <image src="/static/images/teacher/yanquan.png"></image>
                    </view>
                    <picker v-if="groups.length" class="switch" :value="groupValue" range-key="groupName" :range="groups" @change="onGroupChange">
                        切换组内数据
                    </picker>
                </view>
            </view>
            <view class="salary-basic">
                <view class="salary-title">
                    <text class="name">基本收入（元）</text>
                    <text class="times">{{ times }}</text>
                </view>
                <view class="salary">{{ detail.salary }}</view>
                <view class="desc">* 基本收入为税前收入，额外奖金不含在内</view>
            </view>
            <view class="salary-list">
                <view class="container courses">
                    <view class="salary-title">
                        <text class="name">课时收入</text>
                        <text class="times">{{ times }}</text>
                        <text class="num">
                            总计
                            <text class="sal" :class="{ 'plus': courseSalary > 0, 'minus': courseSalary < 0 }">{{ courseSalary > 0 ? '+' : courseSalary < 0 ? '-' : '' }}{{ courseSalary || '-' }}</text>元
                        </text>
                    </view>
                    <view class="wrap">
                        <template v-if="courses.length">
                            <view v-for="item in courses" class="item" :key="item.courseId" @click="toFinishLesson(item)">
                                <view class="name ellipsis">{{ item.courseName }}</view>
                                <view class="right">
                                    <text class="num">{{ item.num }}{{ item.courseType === 'one' ? '节' : '人' }}</text>
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
                <view class="container trainTickets">
                    <view class="salary-title">
                        <text class="name">陪练收入</text>
                        <text class="times">{{ times }}</text>
                        <text class="num">
                            总计
                            <text class="sal" :class="{ 'plus': trainTicketSalary > 0, 'minus': trainTicketSalary < 0 }">{{ trainTicketSalary > 0 ? '+' : trainTicketSalary < 0 ? '-' : '' }}{{ trainTicketSalary || '-' }}</text>元
                        </text>
                    </view>
                    <view class="wrap">
                        <template v-if="trainTickets.length">
                            <view v-for="item in trainTickets" class="item" :key="item.ticketId">
                                <text class="name ellipsis">{{ item.ticketName }}</text>
                                <text class="num">{{ item.num }}张</text>
                                <view class="salary">
                                    <text>+{{ item.salary }}元</text>
                                    <uni-icons type="right" size="12"></uni-icons>
                                </view>
                            </view>
                        </template>
                        <text v-else class="empty">-</text>
                    </view>
                </view>
                <view class="container disciplines">
                    <view class="salary-title">
                        <text class="name">违规违纪</text>
                        <text class="times">{{ times }}</text>
                        <text class="num">
                            总计
                            <text class="sal" :class="{ 'plus': disciplineAmount > 0, 'minus': disciplineAmount < 0 }">{{ disciplineAmount > 0 ? '+' : disciplineAmount < 0 ? '-' : '' }}{{ disciplineAmount || '-' }}</text>元
                        </text>
                    </view>
                    <view class="wrap">
                        <template v-if="disciplines.length">
                            <view v-for="item in disciplines" class="item" :key="item.id">
                                <text class="content ellipsis">· {{ item.content }}</text>
                                <text>-{{ item.amount }}元</text>
                            </view>
                        </template>
                        <text v-else class="empty">-</text>
                    </view>
                </view>
            </view>
            <view class="tools">
                <view class="salary-title">
                    <text class="name">教学工具</text>
                </view>
                <view class="tools-list">
                    <view class="tool" @click="toVideos">
                        <image src="/static/images/teacher/peitaoshipin.png"></image>
                        <text>配套视频</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="page-content group">
            zunei
        </view>

        <customTabbar :active="1" />
    </view>
</template>

<script lang="js">
import dayjs from "dayjs"
export default {
    data() {
        return {
            groupId: null,
            groupValue: 0,
            detail: null,
            headerHeight: 0,
            headerTop: 0
        }
    },
    computed: {
        customTitleStyle() {
            return `top: ${this.headerTop * 2}rpx; height: ${this.headerHeight * 2}rpx; line-height: ${this.headerHeight * 2}rpx`
        },
        teacher() {
            return this.detail?.teacher ?? {}
        },
        groups() {
            return this.detail?.groups ?? []
        },
        times() {
            const start = this.detail?.startTime,
                end = this.detail?.endTime

            const s = start ? dayjs(start).format('YYYY-MM-DD') : '',
                e = end ? dayjs(end).format('YYYY-MM-DD') : ''
            return [s, e].filter(Boolean).join('~')
        },
        courses() {
            return this.detail?.courses ?? []
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
    onLoad() {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return uni.navigateTo({
                url: '/pages/login/index'
            })
        }

        let rect = wx.getMenuButtonBoundingClientRect();

        this.headerHeight = rect.height
        this.headerTop = rect.top

        this.init()
    },
    methods: {
        async init() {
            // const userId = uni.getStorageSync('userId')
            const res = await this.$http.get('/mini/teacher/getTeacherDataInfo?teacherId=' + 16)
            this.detail = res.data ?? {}
        },

        handleYanQuan() {

        },

        // 切换至组内数据
        onGroupChange(e) {
            const value = e.detail.value
            this.groupValue = value
            this.groupId = this.groups[value].id
        },

        // 消课记录
        toFinishLesson({ courseType, courseId }) {
            uni.navigateTo({ url: '/pages/teacher/finishLessonRecord/index?courseType=' + courseType + '&courseId=' + courseId + '&teacherId=' + this.teacher.accountId })
        },

        // 配套视频
        toVideos() {
            uni.navigateTo({ url: '/pages/student/videos/index?from=datacenter' })
        }
    }
}
</script>

<style lang="scss" scoped>
page {
    background-color: #f5f7fa;
}

.page {
    padding-top: 156rpx;
    .custom-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 500rpx;
        background-image: url("https://static.gangqintonghua.com/img/beijing/bg1.png");
        background-size: 100%;
        background-repeat: no-repeat;
        .title {
            position: absolute;
            width: 100%;
            z-index: 1;
            text-align: center;
            font-size: 32rpx;
            font-weight: 500;
            color: #fff;
        }
    }
    &-content {
        position: relative;
        z-index: 1;
    }
    .user {
        display: flex;
        position: relative;
        padding-left: 30rpx;
        margin-bottom: 20rpx;
        .cover {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            margin-right: 24rpx;
        }
        .info {
            .msg {
                display: flex;
                align-items: center;
                margin: 14rpx 0 16rpx;
                .name {
                    font-size: 32rpx;
                    font-weight: 500;
                    margin-right: 12rpx;
                    color: #ffffff;
                }
                .group {
                    background: #62bbec;
                    border-radius: 18rpx;

                    padding: 0 14rpx;
                    font-size: 24rpx;
                    font-weight: 500;
                    color: #eff5ff;
                    line-height: 17px;
                    + .group {
                        margin-left: 6rpx;
                    }
                }
            }
            .yanquan {
                text {
                    font-size: 28rpx;
                    color: #ffffff;
                    margin-right: 4rpx;
                }
                image {
                    width: 24rpx;
                    height: 24rpx;
                }
            }
        }
        .switch {
            position: absolute;
            top: 0;
            right: 0;

            background: rgba(118, 118, 128, 0.24);
            border-radius: 26rpx 0px 0px 26rpx;

            padding: 10rpx 14rpx 8rpx 16rpx;
            font-size: 24rpx;
            color: #ffffff;
            line-height: 17px;
        }
    }
    .salary-title {
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
    .salary-basic {
        margin: 0 30rpx;
        background: #ffffff;
        border-radius: 10px;
        padding: 36rpx 24rpx 10rpx;
        .salary {
            font-size: 48rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #141f33;
        }
        .desc {
            font-size: 16rpx;
            color: #99a0ad;
            text-align: right;
        }
    }
    .salary-list {
        margin: 24rpx 30rpx 0;
        background: #ffffff;
        border-radius: 10px;
        .container {
            + .container {
                border-top: 1px solid #f5f7fa;
            }
            padding: 24rpx 24rpx 30rpx 36rpx;
            .wrap {
                .item {
                    display: flex;
                    + .item {
                        margin-top: 16rpx;
                    }
                    .name,
                    .num,
                    .salary {
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
    .tools {
        background: #ffffff;
        border-radius: 10px;
        margin: 24rpx 30rpx 0;
        padding: 24rpx 24rpx 30rpx 36rpx;
        &-list {
            display: flex;
            .tool {
                display: flex;
                flex-direction: column;
                align-items: center;
                image {
                    width: 40rpx;
                    height: 40rpx;
                    margin-bottom: 6rpx;
                }
                text {
                    font-size: 24rpx;
                    color: #616b80;
                }
            }
        }
    }
}
</style>
