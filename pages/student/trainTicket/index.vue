<template>
    <view class="page">
        <view class="page-content">
            <view v-for="item in list" :key="item.id" class="item">
                <view class="name">
                    <text class="text">{{ item | ticketName }}</text>
                </view>
                <view class="info">
                    <view class="code">
                        <text>课程陪练券码：</text>
                        <text>{{ item.ticketCode }}</text>
                    </view>
                    <view class="desc">日常课程陪练与考级集训等情况均可使用</view>
                    <view v-if="item.effectiveTime" class="time">{{ item | effectiveTime }}到期</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="js">
import dayjs from "dayjs"
export default {
    filters: {
        effectiveTime({effectiveTime}){
            return dayjs(effectiveTime).format('YYYY年 MM月DD日')
        },
        // 4个字换行
        ticketName({ ticketName: name }) {
            return name.substr(0, 4) + '\n' + name.substr(4)
        }
    },
    data() {
        return {
            list: []
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
        this.init()
    },
    methods: {
        async init() {
            try {
                const res = await this.$http.post('/mini/trainTicket/listStudentTrainTicket')
                this.list = res.data ?? []
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
    &-content {
        padding: 0 32rpx;
        padding-top: 36rpx;
        .item {
            + .item {
                margin-top: 36rpx;
            }
            width: 100%;
            height: 180rpx;
            background-image: url("https://static.gangqintonghua.com/img/beijing/peilianquan.png");
            background-size: 100%;
            background-repeat: no-repeat;
            display: flex;
            .name {
                display: flex;
                align-items: center;
                width: 200rpx;
                font-size: 32rpx;
                font-weight: 500;
                color: #ffffff;
                line-height: 44rpx;
                padding: 0 20rpx;
                .text {
                    width: 100%;
                    text-align: center;
                }
            }
            .info {
                flex: 1;
                .code {
                    font-size: 28rpx;
                    font-weight: 600;
                    color: #62bbec;
                    line-height: 40rpx;
                    padding: 24rpx 0 4rpx 36rpx;
                    margin-bottom: 4rpx;
                    text + text {
                        margin-left: 18rpx;
                    }
                }
                .desc {
                    font-size: 20rpx;
                    color: #99a0ad;
                    line-height: 28rpx;
                    padding-left: 36rpx;
                    margin-bottom: 42rpx;
                }
                .time {
                    font-size: 24rpx;
                    color: #99a0ad;
                    line-height: 34rpx;
                    text-align: right;
                    padding-right: 50rpx;
                }
            }
        }
    }
}
</style>
