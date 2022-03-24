<template>
    <uni-popup ref="popup" :is-mask-click="false" type="bottom">
        <view class="main">
            <view class="header">
                <text>全部筛选</text>
                <uni-icons class="close" type="closeempty" size="16" @click="close"></uni-icons>
            </view>
            <scroll-view scroll-y="true" style="max-height: 700rpx;">
                <view class="content">
                    <view class="filter">
                        <view class="name">阶段筛选</view>
                        <view class="wrap">
                            <view
                                v-for="item in dicts.packages"
                                :key="item.id"
                                class="item ellipsis"
                                :class="{ active: form.packageIds.includes(item.id) }"
                                @click="change(item.id, 'packageIds')"
                            >{{ item.packageName }}</view>
                        </view>
                    </view>
                    <view class="filter">
                        <view class="name">老师筛选</view>
                        <view class="wrap">
                            <view
                                v-for="item in dicts.teachers"
                                :key="item.accountId"
                                class="item ellipsis"
                                :class="{ active: form.teacherIds.includes(item.accountId) }"
                                @click="change(item.accountId, 'teacherIds')"
                            >{{ item.teacherName }}</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <view class="footer">
                <button class="btn cancel" @click="reset">重置</button>
                <button class="btn confirm" @click="confirm">确认</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    props: {
        dicts: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            form: {
                packageIds: [],
                teacherIds: []
            }
        }
    },
    methods: {
        open() {
            this.$refs.popup.open()
        },

        close() {
            this.$refs.popup.close()
        },

        change(id, type) {
            const cur = this.form[type]
            if (cur.includes(id)) {
                cur.splice(cur.findIndex(item => item === id), 1)
            } else {
                cur.push(id)
            }
        },

        reset() {
            this.form = {
                packageIds: [],
                teacherIds: []
            }
            this.$emit('confirm', this.form)
        },

        confirm() {
            this.$emit('confirm', this.form)
            this.close()
        }
    },
}
</script>

<style lang="scss" scoped src="@/components/Student/popup.scss"></style>
<style lang="scss" scoped>
.main {
    width: 100%;
    border-radius: 32rpx 32rpx 0 0;
    .header {
        padding: 36rpx 40rpx 36rpx 0;

        font-size: 32rpx;
        font-weight: 500;
        color: #141f33;
        line-height: 44rpx;
        .close {
            float: right;
        }
    }
    .content {
        padding: 0 40rpx 40rpx;
        .filter {
            + .filter {
                margin-top: 60rpx;
            }
            .name {
                font-size: 32rpx;
                color: #525666;
                line-height: 44rpx;
                margin-bottom: 26rpx;
            }
            .wrap {
                display: flex;
                flex-wrap: wrap;
                row-gap: 34rpx;
                column-gap: 28rpx;
                .item {
                    width: calc((100% - 56rpx) / 3);
                    border: 1px solid #f5f7fa;
                    background: #f5f7fa;
                    border-radius: 8rpx;

                    padding: 4rpx 10rpx;
                    text-align: center;
                    font-size: 28rpx;
                    color: #616b80;
                    line-height: 40rpx;
                    &.active {
                        border: 1px solid #62BBEC;
                        color: #62BBEC;
                        background: #FFF;
                    }
                }
            }
        }
    }
}
</style>
