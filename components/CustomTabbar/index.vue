<template>
    <van-tabbar
        :active="active"
        active-color="#62BBEC"
        inactive-color="#616B80"
        @change="tabbarChange"
    >
        <van-tabbar-item
            v-for="(item,index) in tabBars"
            :key="item.text"
            :name="index"
            :info="item.key ? tabBarInfo[item.key] ? tabBarInfo[item.key] : null : null"
            :dot="item.key ? !!tabbarDot[item.key] : false"
        >
            <image slot="icon" :src="item.iconPath" mode="aspectFit" class="icon" />
            <image slot="icon-active" :src="item.selectedIconPath" mode="aspectFit" class="icon" />
            {{ item.text }}
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { mapGetters } from "vuex"
export default {
    options: {
        styleIsolation: 'shared'
    },
    props: {
        active: Number
    },
    computed: {
        ...mapGetters(['tabBars', 'tabBarInfo', 'tabbarDot']),
    },
    methods: {
        tabbarChange(e) {
            if (this.active === e.detail) return
            uni.redirectTo({ url: this.tabBars[e.detail].pagePath })
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.van-tabbar-item {
    &__icon {
        margin-bottom: 2rpx;
    }
    &__text {
        font-size: 24rpx;
    }
    .icon {
        width: 48rpx;
        height: 44rpx;
    }
}
/deep/.van-info--dot {
    // width: 16rpx;
    // height: 16rpx;
    background-color: #F15E5E;
    border: 2rpx solid #FFFFFF;
    border-radius: 50%;
    margin-top: 0;
}
</style>
