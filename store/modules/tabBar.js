import tabBar from "@/utils/tabBar"
const accountType = uni.getStorageSync('accountType')
const state = {
    list: tabBar[accountType]
}

export default {
    namespaced: true,
    state
}