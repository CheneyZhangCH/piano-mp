<template>
    <van-tabbar
        :active="active"
        active-color="#62BBEC"
        inactive-color="#616B80"
        @change="tabbarChange"
    >
        <van-tabbar-item
            v-for="item in tabBars"
            :key="item.text"
            :info="item.key ? tabBarInfo[item.key] ? tabBarInfo[item.key] : null : null"
            :dot="item.key ? !!tabbarDot[item.key] : false"
        >
            <image
                slot="icon"
                :src="item.iconPath"
                mode="aspectFit"
                style="width: 30px; height: 18px"
            />
            <image
                slot="icon-active"
                :src="item.selectedIconPath"
                mode="aspectFit"
                style="width: 30px; height: 18px"
            />
            {{ item.text }}
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { mapGetters } from "vuex"
export default {
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