<template>
    <view class="page" @touchstart="touchstart" @touchend="touchend">
        <scroll-view scroll-x="true" :scroll-left="scrollLeft" scroll-with-animation class="page-package">
            <view v-for="item in packageList" :key="item.id" :data-package-id="item.id" class="page-package-item"
                :class="{
                    available: item.available,
                    active: packageId === item.id,
                }" @click="packageChange(item)">
                <text class="name">{{ item.packageName }}</text>
                <image :src="
                    item.available
                        ? packageId === item.id
                            ? '/static/images/student/unlock-active.png'
                            : '/static/images/student/unlock.png'
                        : '/static/images/student/lock.png'
                " class="icon" :class="{ 'lock': !item.available }" />
                <image v-if="packageId === item.id" src="/static/images/student/video-active-underline.png"
                    class="underline" />
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
            scrollLeft: 0,
            clientWidth: uni.getSystemInfoSync().windowWidth / 2,

            courses: [],

            startX: 0
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
    watch: {
        packageId() {
            wx.createSelectorQuery().in(this).selectAll('.page-package-item').boundingClientRect(rect => {
                let width = 0
                for (let i = 0; i < rect.length; i++) {
                    const item = rect[i]
                    if (item.dataset.packageId === this.packageId) {
                        this.scrollLeft = width + item.width / 2 - this.clientWidth
                        break
                    }
                    width += item.width
                }
            }).exec()
        }
    },
    methods: {
        touchstart(e) {
            this.startX = e.changedTouches[0].pageX
        },

        touchend(e) {
            const moveX = e.changedTouches[0].pageX - this.startX
            if (Math.abs(moveX) < 50) return
            const availablePackageList = this.packageList.filter(_ => _.available)
            const index = availablePackageList.findIndex(_ => _.id === this.packageId)
            if (moveX > 0) {
                if(index === 0) return
                this.packageChange(availablePackageList[index - 1])
            } else {
                if(index === availablePackageList.length - 1) return
                this.packageChange(availablePackageList[index + 1])
            }
        },

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

        &-item {
            position: relative;
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

            +.item {
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
