<template>
    <view class="page">
        <template v-if="msgsInfo">
            <view v-for="msg in msgs" :key="msg.key" class="msg" @click="toDetail(msg)">
                <view class="msg-cover-num">
                    <image class="cover" :src="msg.coverUrl" />
                    <text
                        v-if="msgsInfo[msg.key].unreadCount"
                        class="num"
                    >{{ msgsInfo[msg.key].unreadCount > 99 ? '99+' : msgsInfo[msg.key].unreadCount }}</text>
                </view>
                <view class="msg-info">
                    <view class="msg-info-name">{{ msg.name }}</view>
                    <view class="msg-info-content ellipsis">
                        <template v-if="msgsInfo[msg.key].msgData">
                            <template v-if="msg.key === 'contractMsg'">
                                钢琴童话教育培训协议-{{
                                    msgsInfo[msg.key].msgData.contractType === 'ACCOUNT'
                                        ? msgsInfo[msg.key].msgData.accountContract.packageName
                                        : msgsInfo[msg.key].msgData.continueContract.packageName
                                }}{{ msgsInfo[msg.key].msgData.confirmFlag ? '已开通' : '待确认' }}
                            </template>
                            <template v-else-if="msg.key === 'courseMsg'">
                                <template
                                    v-if="msgsInfo[msg.key].msgData.msgType === 'accountExpiry'"
                                >
                                    距离您的账户有效期还剩余
                                    <text
                                        class="warning"
                                    >{{ ' ' + msgsInfo[msg.key].msgData.msgData.expiryDays + ' ' }}</text>天，为保证课程连续性，请尽快联系店长续费噢~
                                </template>
                                <template
                                    v-else-if="msgsInfo[msg.key].msgData.msgType === 'useTrainTicket'"
                                >您有一张{{ msgsInfo[msg.key].msgData.msgData.ticketName }}于{{ dayjsFormat(msgsInfo[msg.key].msgData.msgData.useTime, 'MM月DD日hh:mm') }}被{{ msgsInfo[msg.key].msgData.msgData.teacherName }}老师核销。</template>
                                <template
                                    v-else-if="msgsInfo[msg.key].msgData.msgType === 'courseRemain'"
                                >
                                    {{ msgsInfo[msg.key].msgData.msgData.courseName }}仅剩余
                                    <text
                                        class="warning"
                                    >{{ ' ' + msgsInfo[msg.key].msgData.msgData.remainCourseNum + ' ' }}</text>节，为保证课程连续性，请尽快联系店长续费噢~
                                </template>
                            </template>
                            <template
                                v-else-if="msg.key === 'complaintMsg'"
                            >您于{{ dayjsFormat(msgsInfo[msg.key].msgData.createTime, 'MM月DD日') }}提交的{{ dicts.complaintType[msgsInfo[msg.key].msgData.complaintType] }}审核{{ dicts.dealComplaint_status[msgsInfo[msg.key].msgData.status] }}</template>
                        </template>
                        <template v-else>暂时没有消息</template>
                    </view>
                </view>
            </view>
        </template>
    </view>
</template>

<script>
import { dayjsFormat } from "@/utils/format"
import dicts from '@/utils/dicts'
export default {
    data() {
        return {
            dicts,
            msgsInfo: null,
            msgs: [
                {
                    name: '签约信息',
                    key: 'contractMsg',
                    coverUrl: 'https://static.gangqintonghua.com/img/icon/msg-contract.png',
                    navigateUrl: '/pages/student/messageContract/index'
                },
                {
                    name: '课程消息',
                    key: 'courseMsg',
                    coverUrl: 'https://static.gangqintonghua.com/img/icon/msg-course.png',
                    navigateUrl: '/pages/student/messageCourse/index'
                },
                {
                    name: '申/投诉处理',
                    key: 'complaintMsg',
                    coverUrl: 'https://static.gangqintonghua.com/img/icon/msg-complaint.png',
                    navigateUrl: '/pages/student/messageComplaint/index'
                },
            ]
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
    },
    onShow() {
        this.init()
    },
    methods: {
        dayjsFormat,
        async init() {
            try {
                const res = await this.$http.get('/mini/studentMsg/msgPage')
                const {
                    courseMsg: {
                        msgData,
                        unreadCount
                    },
                    ...rest
                } = res.data ?? {}
                if (msgData) {
                    msgData.msgData = msgData.msgData ? JSON.parse(msgData.msgData) : null
                }
                this.msgsInfo = {
                    courseMsg: {
                        msgData,
                        unreadCount
                    },
                    ...rest
                }
                console.log(this.msgsInfo)
            } catch (error) {

            }
        },

        toDetail({ navigateUrl }) {
            uni.navigateTo({ url: navigateUrl })
        }
    },
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background-color: #fff;
    padding-top: 52rpx;
    .msg {
        display: flex;
        justify-content: space-between;
        margin: 0 30rpx;
        padding: 36rpx 32rpx;
        border-bottom: 2rpx solid #f5f7fa;
        &-cover-num {
            width: 90rpx;
            height: 90rpx;
            margin-right: 18rpx;
            position: relative;
            .cover {
                width: 100%;
                height: 100%;
            }
            .num {
                position: absolute;
                right: 0;
                height: 28rpx;
                line-height: 28rpx;
                background: #f15e5e;
                border-radius: 28rpx;
                padding: 0 10rpx;

                font-size: 20rpx;
                font-weight: 600;
                color: #fff;
            }
        }
        &-info {
            flex: 1;
            overflow: hidden;
            &-name {
                font-size: 28rpx;
                font-weight: 600;
                color: #141f33;
                line-height: 40rpx;
                margin-top: 6rpx;
                margin-bottom: 6rpx;
            }
            &-content {
                font-size: 24rpx;
                color: #99a0ad;
                line-height: 34rpx;
                .warning {
                    color: #f15e5e;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>
