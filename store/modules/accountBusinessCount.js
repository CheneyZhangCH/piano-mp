export default {
    namespaced: true,
    state: {
        tabBarInfo: {}, // tabbar info
        tabbarDot: {}, // tabbar dot
    },
    mutations: {
        SET_TABBAR_INFO: (state, {
            key,
            count
        }) => {
            const data = Object.assign({}, state.tabBarInfo, {
                [key]: count
            })
            state.tabBarInfo = data
        },

        SET_TABBAR_DOT: (state, {
            key,
            dotFlag
        }) => {
            const data = Object.assign({}, state.tabbarDot, {
                [key]: dotFlag
            })
            state.tabbarDot = data
        }
    },
    actions: {
        /* payload: { key: String, count: Number } */
        setTabbarInfo({
            commit
        }, payload) {
            commit('SET_TABBAR_INFO', payload)
        },

        /* payload: { key: String, dotFlag: Boolean } */
        setTabbarDot({
            commit
        }, payload) {
            commit('SET_TABBAR_DOT', payload)
        }
    }
}
