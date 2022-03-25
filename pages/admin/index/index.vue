<template>
    <view class="page">
        <view class="page-content">
            <template v-if="teacherGroup.length">
                <view v-for="group in teacherGroup" :key="group.id" class="group">
                    <view class="group-title">
                        <view class="name ellipsis">
                            <image class="icon" src="/static/images/audition/group.png"></image>
                            <text>{{ group.groupName }}</text>
                        </view>
                        <view v-if="group.id > 0" class="btn" @click="toGroup(group)">
                            查看组内数据 <uni-icons type="right" color="#99A0AD" size="12" />
                        </view>
                    </view>
                    <view class="group-content">
                        <view v-for="teacher in group.teachers" :key="teacher.accountId" class="teacher-item" @click="toTeacherManage(teacher)">
                            <image class="avatar" :src="teacher.coverUrl" mode="fit"></image>
                            <text class="name">{{ teacher.teacherName }}</text>
                        </view>
                    </view>
                </view>
            </template>
        </view>

        <customTabbar :active="0" />
  </view>
</template>

<script>
export default {
    data() {
        return {
            teacherGroup: [],
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
        async init() {
            try {
                const res = await this.$http.get('/mini/teacherGroup/listTeachers')
                this.teacherGroup = res.data ?? []

                const countWaitDealComplaintRes = await this.$http.post('/mini/studentComplaint/countWaitDealComplaint')
                this.$store.dispatch('accountBusinessCount/setTabbarInfo', {
                    key: 'waitDealComplaintCount',
                    count: countWaitDealComplaintRes.data ?? 0
                })
            } catch (error) {
                console.log(error)
            }
        },

        toTeacherManage({ accountId }) {
            uni.navigateTo({ url: `/pages/admin/teacherManage/index?teacherId=${accountId}` })
        },

        toGroup({ id }) {
            uni.navigateTo({ url: `/pages/teacher/datacenter/index?groupId=${id}` })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    padding-bottom: 100rpx;
    .group {
        &-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 88rpx;
            background: #ffffff;
            padding: 0 42rpx 0 54rpx;

            .name {
                flex: 1;
                display: flex;
                font-size: 32rpx;
                font-weight: 500;
                color: #141f33;
                padding-right: 20rpx;
                .icon {
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 8rpx;
                }
            }
            .btn {
                font-size: 24rpx;
                color: #99a0ad;
            }
        }
        &-content {
            display: flex;
            flex-wrap: wrap;
            column-gap: 72rpx;
            row-gap: 36rpx;

            padding-left: 58rpx;
            padding-top: 36rpx;
            padding-bottom: 36rpx;
            .teacher-item {
                display: flex;
                flex-direction: column;

                .name {
                    font-size: 28rpx;
                    color: #141f33;
                    line-height: 40rpx;
                }

                .avatar {
                    width: 100rpx;
                    height: 100rpx;
                    border-radius: 50rpx;
                    margin-bottom: 20rpx;
                }
            }
        }
    }
}
</style>
