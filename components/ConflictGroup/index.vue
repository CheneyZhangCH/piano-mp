<template>
    <uni-popup ref="popup" :is-mask-click="false" type="center">
        <view class="piano-message-box">
            <view class="piano-message-box__header ">
                <view class="text">该学员续课考核存在冲突</view>
                <view class="text">请选择将本次续课数据纳入以下哪一分组</view>
            </view>
            <scroll-view scroll-y="true" style="max-height: 60vh;" class="piano-message-box__content">
                <view v-for="group in newGroups" :key="group.id" class="group" @click="groupId = group.id">
                    <image class="select-icon"
                        :src="`/static/images/student/icon-radio${group.id === groupId ? '-active' : ''}.png`" />
                    <text class="name ellipsis">{{ group.groupName }}</text>
                    <view class="leader">
                        <text class="er">组长：</text>
                        <image class="cover" :src="teacher.coverUrl" v-for="teacher in group.leaders.slice(0, 1)"
                            :key="teacher.accountId" />
                    </view>
                    <view class="member">
                        <text class="er">组员：</text>
                        <image class="cover" :src="teacher.coverUrl" v-for="teacher in group.members.slice(0, 5)"
                            :key="teacher.accountId" />
                    </view>
                </view>
            </scroll-view>
            <view class="piano-message-box__btns">
                <button class="btn cancel" @click="close">取消</button>
                <button class="btn" :class="{ confirm: !!groupId, disabled: !groupId }" :disabled="!groupId"
                    @click="confirm">确认</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    props: {
        groups: Array
    },
    computed: {
        newGroups() {
            return this.groups.map(item => {
                const {
                    teachers,
                    ...rest
                } = item
                return {
                    ...rest,
                    leaders: teachers.filter(_ => _.groupTeacherType === 'leader') ?? [],
                    members: teachers.filter(_ => _.groupTeacherType === 'member') ?? []
                }
            })
        }
    },
    data() {
        return {
            groupId: 0
        }
    },
    methods: {
        open() {
            this.loading = false
            this.$refs.popup.open()
        },

        close() {
            this.$refs.popup.close()
        },

        confirm() {
            if (this.loading) return
            this.loading = true
            this.$emit('confirm', this.groupId)
        }
    }
};
</script>

<style lang="scss" scoped>
.piano-message-box {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;

    &__header {
        padding: 36rpx 32rpx;
        .text {
            font-size: 28rpx;
            color: #99a0ad;
            line-height: 42rpx;
            text-align: center;
        }
    }

    &__content {
        margin-bottom: 36rpx;

        .group {
            display: flex;
            align-items: center;
            background-image: url('https://static.gangqintonghua.com/img/beijing/box-shadow.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            border-radius: 20rpx;
            padding: 20rpx 36rpx; // 设计稿7px 18px
            margin: 0 32rpx;

            // + .group {
            //     margin-top: 10rpx; // 设计稿8px -> 5px
            // }
            .select-icon {
                width: 28rpx;
                height: 28rpx;
                margin-right: 40rpx;
            }

            .name {
                width: 140rpx;
                font-size: 28rpx;
                color: #525666;
                line-height: 40rpx;
                margin-right: 32rpx;
            }

            .leader,
            .member {
                display: flex;
                align-items: center;

                .er {
                    font-size: 24rpx;
                    color: #525666;
                    margin-right: 10rpx;
                }

                .cover {
                    width: 28rpx;
                    height: 28rpx;
                    border-radius: 50%;
                    margin-left: -10rpx;
                    border: 2rpx solid #FFF;
                }
            }

            .leader {
                margin-right: 32rpx;
            }
        }
    }

    &__btns {
        display: flex;
        column-gap: 48rpx;
        padding: 32rpx 48rpx;
        box-shadow: 0px -4rpx 8rpx 0px rgba(0, 0, 0, 0.05);

        .btn {
            flex: 1;
            height: 72rpx;
            line-height: 72rpx;
            padding: 0;
            font-size: 32rpx;
            font-weight: 600;
            color: #616b80;
            background-color: #fff;
            border: 2rpx solid #d3d7e0;
            border-radius: 44rpx;

            &::after {
                display: none;
            }

            &.confirm,
            &.disabled {
                color: #FFF;
                border: none;
                padding-left: 2rpx;
                padding-right: 2rpx;
            }

            &.confirm {
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
            }

            &.disabled {
                background: #e1e1e1;
            }
        }
    }
}
</style>
