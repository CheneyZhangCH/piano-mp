<template>
    <view class="page" :style="pageStyle">
        <view class="custom-header" :class="{ group: !!groupId }">
            <view class="title" :style="customTitleStyle">
                <uni-icons v-if="!datacenterFlag" type="left" color="#FFF" size="16" @click="back" style="float: left; padding: 0 30rpx;"/>
                数据中心
            </view>
        </view>
        <scroll-view v-if="!groupId" scroll-y='true' class="page-content personal">
            <view class="user">
                <image :src="teacher.coverUrl || defaultCoverUrl" class="cover" />
                <view class="info">
                    <view class="msg">
                        <text class="name ellipsis">{{ teacher.teacherName }}</text>
                        <view v-if="groups.length" class="groups" >
                            <text v-for="g in groups.slice(0, 2)" :key="g.id" class="group ellipsis">{{ g.groupName }}</text>
                        </view>
                    </view>
                    <view class="yanquan" @click="handleYanQuan">
                        <text>输码验券</text>
                        <image src="/static/images/teacher/yanquan.png"></image>
                    </view>
                    <template v-if="groups.length">
                        <picker v-if="groups.length > 1" class="switch" :value="groupValue" range-key="groupName" :range="groups" @change="onGroupChange">
                            切换组内数据
                        </picker>
                        <view v-else class="switch" @click="groupId = groups[0]">切换组内数据</view>
                    </template>
                </view>
            </view>
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
                            <text class="sal" :class="{ 'plus': courseSalary > 0, 'minus': courseSalary < 0 }">{{ courseSalary > 0 ? '+' : '' }}{{ courseSalary || '-' }}</text>元
                        </text>
                    </view>
                    <view class="wrap">
                        <template v-if="detail.courses.length">
                            <view v-for="item in detail.courses" class="item" :key="item.courseId" @click="toFinishLesson(item)">
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
                <view class="container">
                    <view class="block-title">
                        <text class="name">陪练收入</text>
                        <text class="times">{{ times }}</text>
                        <text class="num">
                            总计
                            <text class="sal" :class="{ 'plus': trainTicketSalary > 0, 'minus': trainTicketSalary < 0 }">{{ trainTicketSalary > 0 ? '+' : '' }}{{ trainTicketSalary || '-' }}</text>元
                        </text>
                    </view>
                    <view class="wrap">
                        <template v-if="detail.trainTickets.length">
                            <view v-for="item in detail.trainTickets" class="item" :key="item.ticketId" @click="toTrainTickets(item)">
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
                            <text class="sal" :class="{ 'plus': disciplineAmount > 0, 'minus': disciplineAmount < 0 }">{{ disciplineAmount > 0 ? '+' : '' }}{{ disciplineAmount || '-' }}</text>元
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
            <view class="tools block">
                <view class="block-title">
                    <text class="name">教学工具</text>
                </view>
                <view class="flex">
                    <view class="tool" @click="toVideos">
                        <image src="/static/images/teacher/peitaoshipin.png"></image>
                        <text>配套视频</text>
                    </view>
                </view>
            </view>
        </scroll-view>
        <scroll-view v-else scroll-y='true' @scrolltolower="lower" class="page-content group">
            <view class="teachers">
                <view v-if="memberTeachers.length" class="member">
                    <text>启蒙组成员：</text>
                    <image v-for="item in memberTeachers" :key="item.accountId"  :src="item.coverUrl || defaultCoverUrl" />
                </view>
                <view v-if="leaderTeachers.length" class="leader">
                    <text>组长：</text>
                    <image v-for="item in leaderTeachers" :key="item.accountId"  :src="item.coverUrl || defaultCoverUrl" />
                </view>
                <view v-if="datacenterFlag" class="switch" @click="() => { groupId = null; group = null }">切换至个人数据</view>
            </view>
            <view class="xukelirun block">
                <view class="block-title">
                    <text class="name">续课率考核</text>
                    <view class="btn" @click="toContinueData">
                        查看详情 <uni-icons type="right" color="#99A0AD" size="12" />
                    </view>
                </view>
                <view class="content">
                    <view v-for="item in group.packageRatios" :key="item.id" class="item">
                        <text class="rate" :class="{ 'reach': item.actualRatio >= item.ratio, 'unreach': item.actualRatio < item.ratio, empty: !item.actualRatio }">{{ item.actualRatio ? `${item.actualRatio}%` : '-' }}</text>
                        <text class="name ellipsis">{{ item.packageName }}({{ item.ratio }}%)</text>
                    </view>
                </view>
            </view>
            <view class="lirun block">
                <view class="container">
                    <view class="block-title">
                        <view>
                            <text class="name">续课利润(元)</text>
                            <text class="times">{{ groupTimes }}</text>
                        </view>
                        <view v-if="accountType === 'ADMIN' && group.totalAmount > 0" class="btn" @click="$refs.utnq.open()">
                            更新至下一季度 <image class="refresh" src="/static/images/teacher/refresh.png" />
                        </view>
                    </view>
                    <view class="total" :class="{ empty: !group.totalAmount }">{{ group.totalAmount || '-' }}</view>
                </view>
                <view class="container amonut">
                    <view class="amonut-item">
                        <text>续课收入</text>
                        <text  class="num" :class="{ empty: !group.continueAmount }">{{ group.continueAmount ? `+${group.continueAmount}` : '-' }}</text>
                    </view>
                    <view class="amonut-item">
                        <text>退费支出</text>
                        <text class="num refund" :class="{ empty: !group.refundAmount }">{{ group.refundAmount || '-' }}</text>
                    </view>
                </view>
                <view class="container fenhong">
                    <view class="block-title">
                        <view>
                            <text class="name">利润分红(元)</text>
                            <text class="times">{{ groupTimes }}</text>
                        </view>
                    </view>
                    <view class="content">
                        <view v-for="item in group.teacherAmounts" :key="item.id" class="fenhong-item">
                            <view class="info">
                                <image :src="item.coverUrl || ''"/>
                                <text class="name ellipsis">{{ item.teacherName }}<template v-if="item.groupTeacherType === 'leader'">(组长)</template></text>
                                <text v-if="leaderFlag" class="btn" @click="toTeacher(item)">查看课表</text>
                            </view>
                            <view class="num">
                                <text class="ratio">{{ item.ratio }}%</text>
                                <text class="amount" :class="{ empty: !item.amount }">{{ item.amount ? `${item.amount > 0 ? `+${item.amount}` : item.amount}` : '-' }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="xuke block">
                <view class="block-title">
                    <text class="name">学员续课情况</text>
                    <text class="times">本季度</text>
                </view>
                <view class="list">
                    <view v-for="item in listStudent" :key="item.id" class="item">
                        <image class="cover" :src="item.student.coverUrl || defaultCoverUrl" />
                        <view class="content">
                            <view class="student">
                                <view class="l">
                                    <text class="student-name">{{ item.student.studentName }}-</text>
                                    <text class="package-name">{{ item.packageName }}</text>
                                    <text class="status" :class="item.changeType">{{ dicts.changeType[item.changeType] }}</text>
                                </view>
                                <view class="r">
                                    {{ weekOrDateTime(item.createTime) }}
                                </view>
                            </view>
                            <view class="teacher">
                                <view class="l">
                                    <text>老师：</text>
                                    <image v-for="teacher in item.teachers" :key="teacher.accountId" :src="teacher.coverUrl || defaultCoverUrl" />
                                </view>
                                <view v-if="['studentContinue', 'refund'].includes(item.changeType)" class="r" :class="item.changeType">
                                    {{ item.amount > 0 ? `+${item.amount}` : item.amount }}
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <YanQuan ref="yanquan" @success="init"/>

        <customPopupDialog ref="utnq" content="更新至下一季度后续课利润将为初始状态 请问是否确认更新" @confirm="updateToNextQuarterConfirm" />

        <customTabbar v-if="datacenterFlag" :active="1" />
    </view>
</template>

<script lang="js">
import dayjs from "dayjs"
import YanQuan from "./components/YanQuan.vue"
import customPopupDialog from '@/components/custom-popup/dialog'

import { weekOrDateTime } from '@/utils/format'
export default {
    components: {
        YanQuan,
        customPopupDialog
    },
    data() {
        return {
            defaultCoverUrl: 'https://static.gangqintonghua.com/img/touxiang/pic1.webp',
            detail: null,

            groupValue: 0,
            group: null,
            groupId: null,

            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            listStudent: [],
            dicts: {
                changeType: {
                    'studentContinue': '续课',
                    'discontinue': '不续课',
                    'refund': '退费'
                }
            },
            datacenterFlag: true,


            headerHeight: 0,
            headerTop: 0,

            accountType: '' // ADMIN - 更新续课利润至下个季度
        }
    },
    computed: {
        pageStyle() {
            return `padding-top: ${(this.headerHeight + this.headerTop + 20) * 2}rpx; padding-bottom: ${this.datacenterFlag ? '100rpx' : 0};`
        },
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
        },

        memberTeachers() {
            return this.group?.teachers?.filter(item => item.groupTeacherType === 'member') ?? []
        },
        leaderTeachers() {
            return this.group?.teachers?.filter(item => item.groupTeacherType === 'leader') ?? []
        },
        leaderFlag() {
            const userId = uni.getStorageSync('userId')
            return !!this.leaderTeachers.filter(item => item.accountId === userId)?.length
        },
        groupTimes() {
            const start = this.group?.startTime,
                end = this.group?.endTime

            const s = start ? dayjs(start).format('YYYY/M/D') : '',
                e = end ? dayjs(end).format('YYYY/M/D') : ''
            return [s, e].filter(Boolean).join('~')
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        const accountType = uni.getStorageSync('accountType')

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
        this.accountType = accountType

        let rect = wx.getMenuButtonBoundingClientRect();

        this.headerHeight = rect.height
        this.headerTop = rect.top

        if (option.groupId) {
            this.groupId = option.groupId
            this.datacenterFlag = false
            this._getGroupSalary()
            return
        }
        this.init()
    },
    methods: {
        weekOrDateTime,
        async init() {
            const userId = uni.getStorageSync('userId')
            // TODO: userId
            const res = await this.$http.get('/mini/teacher/getTeacherDataInfo?teacherId=' + (userId === 28 ? 16 : userId))
            this.detail = res.data ?? {}
        },

        handleYanQuan() {
            this.$refs.yanquan.open()
        },

        onGroupChange(e) {
            const value = e.detail.value
            this.groupValue = value
            this.groupId = this.groups[value].id
            this.pageNum = 1
            this.listStudent = []
            this._getGroupSalary()
        },

        async _getGroupSalary() {
            const res = await this.$http.post('/mini/teacherGroup/getGroupSalary', { data: this.groupId })
            if (res.ok) {
                this.group = res.data ?? {}
                this._listStudentChangeByGroup()
            }
        },

        async _listStudentChangeByGroup() {
            const param = {
                page: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                param: this.groupId
            }
            const res = await this.$http.post('/mini/teacherGroup/listStudentChangeByGroup', param)
            if (res.ok) {
                const { data, totalPage } = res.data
                this.totalPage = totalPage ?? 0
                this.listStudent = this.listStudent.concat(data ?? [])
            }
        },

        lower() {
            console.log('lower')
            if (this.pageNum >= this.totalPage) return
            this.pageNum++
            this._listStudentChangeByGroup()
        },

        async updateToNextQuarterConfirm() {
            try {
                const { continueAmount, endTime, groupId, refundAmount, startTime, totalAmount } = this.group
                const param = {
                    data: {
                        continueAmount, endTime, groupId, refundAmount, startTime, totalAmount
                    }
                }
                await this.$http.post('/mini/teacherGroup/updateGroupSalary', param)
                uni.showToast({
                    title: '更新成功！',
                    icon: 'success',
                })
                this.$refs.utnq.close()
            } catch (error) {
                console.log(error)
            }
        },

        toContinueData() {
            uni.navigateTo({ url: '/pages/teacher/continueData/index?groupId=' + this.groupId })
        },

        toFinishLesson({ courseType, courseId }) {
            uni.navigateTo({ url: '/pages/teacher/xiaokeOrhexiaoRecord/index?courseType=' + courseType + '&courseId=' + courseId + '&teacherId=' + this.teacher.accountId })
        },

        toTrainTickets({ ticketId }) {
            uni.navigateTo({ url: '/pages/teacher/xiaokeOrhexiaoRecord/index?ticketId=' + ticketId + '&teacherId=' + this.teacher.accountId })
        },

        toVideos() {
            uni.navigateTo({ url: '/pages/student/videos/index?from=datacenter' })
        },

        toTeacher({ accountId, teacherName }) {
            uni.navigateTo({ url: `/pages/teacher/schedule/index?teacherId=${accountId}&teacherName=${teacherName}` });
        },

        back() {
            uni.navigateBack({ delta: 1 })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    background-color: #f5f7fa;
    overflow: hidden;
    box-sizing: border-box;

    .custom-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 500rpx;
        background-image: url("https://static.gangqintonghua.com/img/beijing/bg1.png");
        background-size: 100%;
        background-repeat: no-repeat;
        &.group {
            background-image: url("https://static.gangqintonghua.com/img/beijing/bg2.png");
        }
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
        height: 100%;
    }
    .personal,
    .group {
        .switch {
            position: absolute;
            top: 0;
            right: 0;

            background: rgba(118, 118, 128, 0.24);
            border-radius: 26rpx 0px 0px 26rpx;

            padding: 10rpx 14rpx 8rpx 16rpx;
            font-size: 24rpx;
            color: #ffffff;
            line-height: 34rpx;
        }
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
    }
    .personal {
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
                flex: 1;
                overflow: hidden;
                .msg {
                    display: flex;
                    align-items: center;
                    margin: 14rpx 0 16rpx;
                    .name {
                        max-width: 128rpx;
                        font-size: 32rpx;
                        font-weight: 500;
                        margin-right: 12rpx;
                        color: #ffffff;
                    }
                    .groups {
                        flex: 1;
                        overflow: hidden;
                    }
                    .group {
                        display: inline-block;
                        max-width: 120rpx;
                        background: #62bbec;
                        border-radius: 18rpx;

                        padding: 0 14rpx;
                        font-size: 24rpx;
                        font-weight: 500;
                        color: #eff5ff;
                        line-height: 17px;
                        word-break: keep-all;
                        + .group {
                            margin-left: 6rpx;
                        }
                    }
                }
                .yanquan {
                    display: flex;
                    align-items: center;
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
            margin-bottom: 24rpx;
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
        .tools {
            margin-bottom: 30rpx;
            padding-bottom: 30rpx;
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
    .group {
        .block + .block {
            margin-top: 24rpx;
        }
        .teachers {
            display: flex;
            height: 52rpx;
            align-items: center;
            position: relative;
            column-gap: 50rpx;
            padding-left: 66rpx;
            margin-bottom: 30rpx;
            .member,
            .leader {
                display: flex;
                align-items: center;
                text {
                    font-size: 24rpx;
                    color: #ffffff;
                    margin-right: 10rpx;
                }
                image {
                    width: 40rpx;
                    height: 40rpx;
                    border-radius: 50%;
                    margin-left: -10rpx;
                }
            }
        }
        .xukelirun {
            padding-bottom: 24rpx;
            .block-title {
                display: flex;
                justify-content: space-between;
                .btn {
                    font-size: 24rpx;
                    color: #99a0ad;
                }
            }
            .content {
                display: flex;
                justify-content: space-around;
                .item {
                    flex: 1;
                    display: flex;
                    text-align: center;
                    flex-direction: column;
                    padding-right: 24rpx;
                    overflow: hidden;
                    .rate {
                        font-size: 32rpx;
                        font-weight: 500;
                        line-height: 44rpx;
                        margin-bottom: 8rpx;
                        color: #99a0ad;
                        &.reach {
                            color: #f15e5e;
                        }
                        &.unreach {
                            color: #44be5e;
                        }
                        &.empty {
                            color: #99a0ad;
                        }
                    }
                    .name {
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;
                    }
                }
            }
        }
        .lirun,
        .xuke {
            &.block {
                padding-left: 0;
                padding-right: 0;
            }
        }
        .lirun {
            .block-title {
                display: flex;
                justify-content: space-between;
                .btn {
                    font-size: 24rpx;
                    color: #62bbec;
                    .refresh {
                        width: 24rpx;
                        height: 22rpx;
                        margin-left: 4rpx;
                    }
                }
            }
            .container {
                padding-left: 36rpx;
                padding-right: 24rpx;
                .block-title {
                    margin-bottom: 0;
                }
                + .container {
                    border-top: 1px solid #f5f7fa;
                }
                .total {
                    font-size: 36rpx;
                    font-weight: 500;
                    color: #141f33;
                    line-height: 50rpx;
                    padding: 24rpx 0;
                    &.empty {
                        color: #99a0ad;
                    }
                }
                &.amonut {
                    padding: 24rpx 24rpx 24rpx 36rpx;
                    .amonut-item {
                        display: flex;
                        justify-content: space-between;
                        + .amonut-item {
                            margin-top: 12rpx;
                        }
                        font-size: 24rpx;
                        color: #141f33;
                        line-height: 34rpx;
                        .num {
                            color: #f15e5e;
                        }
                        .refund {
                            color: #44be5e;
                        }
                        .empty {
                            color: #99a0ad;
                        }
                    }
                }
                &.fenhong {
                    padding-bottom: 24rpx;
                    .block-title {
                        margin-top: 24rpx;
                        margin-bottom: 24rpx;
                    }
                    .fenhong-item {
                        display: flex;
                        align-items: center;
                        + .fenhong-item {
                            margin-top: 18rpx;
                        }
                        .info {
                            width: 312rpx;
                            display: flex;
                            align-items: center;
                            margin-right: 12rpx;

                            overflow: hidden;
                            image {
                                width: 40rpx;
                                height: 40rpx;
                                border-radius: 50%;
                                margin-right: 12rpx;
                            }
                            .name {
                                flex: 1;
                                font-size: 24rpx;
                                color: #525666;
                                line-height: 34rpx;
                            }
                            .btn {
                                font-size: 20rpx;
                                color: #62bbec;
                                line-height: 24rpx;
                                margin-left: 12rpx;
                            }
                        }
                        .num {
                            flex: 1;
                            font-size: 24rpx;

                            line-height: 34rpx;
                            .ratio {
                                color: #99a0ad;
                            }
                            .amount {
                                float: right;
                                color: #f15e5e;
                                &.empty {
                                    color: #99a0ad;
                                }
                            }
                        }
                    }
                }
            }
        }
        .xuke {
            padding-bottom: 24rpx;
            margin-bottom: 50rpx;
            .block-title {
                padding-left: 36rpx;
                padding-right: 24rpx;
            }
            .list {
                .item {
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #f5f7fa;
                    padding: 10rpx 24rpx 24rpx 36rpx;
                    .cover {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 50%;
                        margin-right: 12rpx;
                    }
                    .content {
                        flex: 1;
                    }
                    .student,
                    .teacher {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .l {
                            flex: 1;
                            overflow: hidden;
                        }
                        .studentContinue {
                            color: #f15e5e;
                        }
                        .discontinue {
                            color: #99a0ad;
                        }
                        .refund {
                            color: #44be5e;
                        }
                    }
                    .student {
                        .l {
                            font-size: 24rpx;
                            font-weight: 500;
                            color: #141f33;
                            line-height: 34rpx;
                            margin-top: 14rpx;
                            margin-bottom: 12rpx;
                            .package-name {
                                margin-right: 8rpx;
                            }
                        }
                        .r {
                            font-size: 24rpx;
                            color: #525666;
                        }
                    }
                    .teacher {
                        .l {
                            display: flex;
                            align-items: center;
                            text {
                                font-size: 24rpx;
                                color: #525666;
                                margin-right: 10rpx;
                            }
                            image {
                                width: 40rpx;
                                height: 40rpx;
                                border-radius: 50%;
                                margin-left: -10rpx;
                            }
                        }
                        .r {
                            font-size: 28rpx;
                            font-weight: 500;
                            color: #44be5e;
                        }
                    }
                }
            }
        }
    }
}
</style>
