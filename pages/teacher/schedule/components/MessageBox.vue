<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="piano-message-box">
            <view class="piano-message-box__content">
                <template v-if="!course">
                    <view class="piano-message-box__message">这是该学员最后一节课，无后续课程安排</view>
                    <view class="piano-message-box__message">请告知家长知悉</view>
                </template>
                <template v-else>
                    <view class="piano-message-box__message">这是该学员最后一节课，后续课程安排如下</view>
                    <view class="piano-message-box__message course">
                        <text>{{ course.courseName }}</text>
                        <text>{{ course.teacherName }}</text>
                        <text>周{{ WEEK_DAY[course.dayOfWeek] }} {{ course.timetablePeriodName }}</text>
                    </view>
                    <view class="piano-message-box__message">请注意提醒并告知家长相应教室位置</view>
                </template>
            </view>
            <view class="piano-message-box__btns">
                <button
                    class="btn"
                    :class="{ confirm: seconds === 0 }"
                    :disabled="seconds > 0"
                    @click="close"
                >
                    已告知
                    <text v-if="seconds > 0">({{ seconds }}s)</text>
                </button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
import { WEEK_DAY } from '@/utils/format'
export default {
    data() {
        return {
            WEEK_DAY,
            seconds: 15,
            course: null
        }
    },
    methods: {
        open(course) {
            this.seconds = 15
            this.course = course
            this.$refs.popup.open()

            const timer = setInterval(() => {
                if (this.seconds > 0) {
                    this.seconds--
                } else {
                    clearInterval(timer)
                }
            }, 1000)
        },

        close() {
            this.$refs.popup.close()
        }
    }
};
</script>

<style lang="scss" scoped>
.piano-message-box {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;
    &__content {
        padding: 48rpx 32rpx 36rpx;
        text-align: center;
    }
    &__message {
        font-size: 28rpx;
        color: #616b80;
        line-height: 42rpx;
        &.course {
            font-weight: 500;
            color: #62bbec;
            margin: 16rpx 0;
            text + text {
                margin-left: 16rpx;
            }
        }
    }
    &__btns {
        display: flex;
        column-gap: 48rpx;
        padding: 32rpx 184rpx;
        box-shadow: 0px -4rpx 8rpx 0px rgba(0, 0, 0, 0.05);
        .btn {
            flex: 1;
            height: 72rpx;
            line-height: 72rpx;
            border-radius: 44rpx;
            background: #fff;
            border: 2rpx solid #d3d7e0;

            font-size: 32rpx;
            font-weight: 500;
            color: #d3d7e0;
            &::after {
                display: none;
            }
            &.confirm {
                color: #fff;
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
                border: none;
            }
        }
    }
}
</style>
