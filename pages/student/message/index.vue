<template>
    <view class="page">
        <template v-if="complete">
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
                                    msgsInfo[msg.key].msgData.accountContract.packageName
                                }}{{ msgsInfo[msg.key].msgData.accountContract.confirmFlag ? '已开通' : '待确认' }}
                            </template>
                            <template v-else-if="msg.key === 'courseMsg'">钢琴童话教育培训协议-xxx</template>
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
            complete: false,
            msgsInfo: {},
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
        this.init()
    },
    methods: {
        dayjsFormat,
        async init() {
            try {
                const res = await this.$http.get('/mini/studentMsg/msgPage')
                this.msgsInfo = res.data ?? {}
                this.complete = true
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
                font-weight: 500;
                color: #141f33;
                line-height: 40rpx;
                margin-bottom: 6rpx;
            }
            &-content {
                font-size: 24rpx;
                color: #99a0ad;
                line-height: 34rpx;
            }
        }
    }
}
</style>
