import tabBar from "@/utils/tabBar"
const accountType = uni.getStorageSync('accountType')

export default {
    namespaced: true,
    state: {
        list: tabBar[accountType]
    },
    mutations: {
        SET_TABBAR_LIST: (state, payload) => {
            state.list = tabBar[payload]
        }
    },
    actions: {
        setTabbar({ commit }, accountType) {
            commit('SET_TABBAR_LIST', accountType)
        }
    }
}