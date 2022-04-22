<template>
    <view class="page">
        <scroll-view
            scroll-x="true"
            :scroll-into-view="`package_${packageId}`"
            scroll-with-animation
            class="page-package"
        >
            <view
                v-for="item in packageList"
                :id="`package_${item.id}`"
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
                    class="icon"
                    :class="{ 'lock': !item.available }"
                />
                <image v-if="packageId === item.id" src="/static/images/student/video-active-underline.png" class="underline"/>
            </view>
        </scroll-view>
        <view v-if="courses.length" class="page-courses">
            <view v-for="item in courses" :key="item.id" @click="coursesDetail(item)" class="item">
                <image :src="item.coverUrl" />
            </view>
        </view>

        <MessageNotify />
        <customTabbar v-if="showTabBar" :active="0" />
    </view>
</template>

<script lang="js">
import MessageNotify from '../Components/MessageNotify'
export default {
    components: {
        MessageNotify
    },
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
                if (this.packageList.length) {
                    const current = this.packageList.filter(_ => _.current)
                    if (current.length) {
                        this.packageId = current[0].id
                        this._listByPackageId()
                    }
                }
            } finally {
                uni.hideLoading()
            }
        },

        packageChange(item) {
            if (this.packageId === item.id || !item.available) return
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
    min-height: 100vh;
    background-color: #fff;
    &-package {
        width: 100%;
        background-color: #fff;
        white-space: nowrap;
        border-bottom: 2rpx solid #f5f7fa;
        .item {
            display: inline-block;
            font-size: 26rpx;
            color: #c9ced6;
            line-height: 80rpx;
            padding: 0 40rpx;
            .icon {
                margin-left: 10rpx;
                width: 12px;
                height: 12px;
                &.lock {
                    width: 10px;
                }
            }
            &.available {
                color: #616b80;
            }
            &.active {
                position: relative;
                font-size: 30rpx;
                font-weight: 600;
                color: #62bbec;
            }
            .underline {
                width: 112rpx;
                height: 4rpx;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
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
}
</style>
