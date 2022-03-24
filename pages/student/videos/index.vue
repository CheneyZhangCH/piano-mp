<template>
    <view class="page">
        <view class="page-package">
            <view
                v-for="item in packageList"
                :key="item.id"
                class="item"
                :class="{
                    available: item.available,
                    active: packageId === item.id,
                }"
                @click="packageChange(item)"
            >
                <text class="name">{{ item.packageName }}</text>
                <image
                    :src="
                        item.available
                            ? packageId === item.id
                                ? '/static/images/student/unlock-active.png'
                                : '/static/images/student/unlock.png'
                            : '/static/images/student/lock.png'
                    "
                    style="width: 10px; height: 12px"
                    class="icon"
                />
            </view>
        </view>
        <view class="page-courses">
            <view v-for="item in courses" :key="item.id" @click="coursesDetail(item)" class="item">
                <image :src="item.coverUrl" />
            </view>
        </view>
        <view class="notify">
            <image src="/static/images/student/notify.png" />
            <view class="count">8</view>
        </view>

        <customTabbar v-if="showTabBar" :active="0" />
    </view>
</template>

<script lang="js">
export default {
    data() {
        return {
            showTabBar: true,
            packageId: '',
            packageList: [],

            courses: []
        }
    },
    onLoad(option) {
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
        // 从数据中心隐藏tabbar
        if (option?.from === 'datacenter') this.showTabBar = false
        this.init()
    },
    methods: {
        async init() {
            uni.showLoading({ title: '加载中', mask: true })
            try {
                const res = await this.$http.post('/mini/coursePackage/listAvailableCoursePackage')
                this.packageList = res.data ?? []
                this.packageId = this.packageList.length ? this.packageList[0].id : ''
                this._listByPackageId()
            } finally {
                uni.hideLoading()
            }
        },

        packageChange(item) {
            if (!item.available) return
            this.packageId = item.id
            this._listByPackageId()
        },

        async _listByPackageId() {
            uni.showLoading({ title: '加载中', mask: true })
            try {
               const res = await this.$http.get('/mini/teachingBook/listByPackageId?packageId=' + this.packageId)
               this.courses = res.data ?? []
            } finally {
                uni.hideLoading()
            }
        },

        coursesDetail({ id }) {
            uni.navigateTo({ url: `/pages/student/videos/courses?id=${id}` })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    background-color: #fff;
    &-package {
        width: 100%;
        background-color: #fff;
        padding: 0 32rpx;
        white-space: nowrap;
        overflow-x: auto;
        .item {
            display: inline-block;
            font-size: 26rpx;
            color: #c9ced6;
            line-height: 36rpx;
            .icon {
                margin-left: 10rpx;
            }
            + .item {
                margin-left: 80rpx;
            }
            &.available {
                color: #616b80;
            }
            &.active {
                position: relative;

                font-size: 30rpx;
                font-weight: 500;
                color: #62bbec;
                line-height: 80rpx;
                &::after {
                    content: " ";
                    display: block;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 4rpx;
                    background: linear-gradient(
                        90deg,
                        #61baec 0%,
                        #84daee 100%
                    );
                    border-radius: 2rpx;
                }
            }
        }
    }
    &-courses {
        padding: 32rpx 30rpx;
        .item {
            width: 100%;
            height: 270rpx;
            + .item {
                margin-top: 30rpx;
            }
            image {
                width: 100%;
                height: 100%;
            }
        }
    }
    .notify {
        position: fixed;
        right: 20rpx;
        bottom: 200rpx;
        image {
            width: 96rpx;
            height: 96rpx;
        }
        .count {
            position: absolute;
            top: 20rpx;
            right: 20rpx;

            width: 24rpx;
            height: 24rpx;
            background: #f15e5e;
            border: 1px solid #ffffff;
            border-radius: 50%;
            text-align: center;

            font-size: 16rpx;
            font-weight: 600;
            color: #ffffff;
            line-height: 24rpx;
        }
    }
}
</style>
