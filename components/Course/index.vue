<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="main">
            <view class="header">{{ title }}</view>
            <scroll-view scroll-y="true" style="max-height: 550rpx;">
                <view class="content">
                    <view v-for="student in students" :key="student.studentId" class="student">
                        <view class="name ellipsis">{{ student.studentName }}</view>
                        <view class="info">
                            <image
                                class="gender"
                                :src="`/static/images/student/${student.gender || 'male'}-selected.png`"
                            />
                            <text class="age">{{ student.age }}岁</text>
                            <text v-if="student.packageName" class="packageName ellipsis">{{ student.packageName }}</text>
                        </view>
                        <view class="detail" @click="$emit('student', student.studentId)">查看详情</view>
                    </view>
                </view>
            </scroll-view>
            <view class="footer">
                <button class="btn confirm" @click="$refs.popup.close()">我知道了</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
import { WEEK_DAY } from '@/utils/format'
export default {
    props: {
        detail: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        title() {
            return `周${WEEK_DAY[this.detail?.dayOfWeek]} ${
                this.detail?.periodName
            }  ${this.detail?.moreCourse?.course?.courseName}`
        },
        students() {
            return this.detail?.moreCourse?.students ?? []
        }
    },
    methods: {
        open() {
            this.$refs.popup.open()
        }
    },
}
</script>

<style lang="scss" scoped src="../Student/popup.scss"></style>
<style lang="scss" scoped>
.main {
    .content {
        padding: 32rpx 32rpx 60rpx;
        .student {
            display: flex;
            align-items: center;
            justify-content: center;
            column-gap: 20rpx;
            +.student {
                margin-top: 32rpx;
            }
            .name {
                width: 126rpx;
                font-size: 28rpx;
                font-weight: 600;
                color: #141F33;
                line-height: 40rpx;
            }
            .info {
                flex: 1;
                display: flex;
                align-items: center;

                font-size: 24rpx;
                color: #525666;
                overflow: hidden;
                .gender {
                    width: 24rpx;
                    height: 24rpx;
                    margin-right: 8rpx;
                }
                .age {
                    width: 60rpx;
                    margin-right: 20rpx;
                }
                .packageName {
                    flex: 1;
                }
            }
            .detail {
                border-radius: 8rpx;
                border: 2rpx solid;

                padding: 6rpx 16rpx;
                font-size: 22rpx;
                color: #62BBEC;
                line-height: 32rpx;
            }
        }
    }
}
</style>
