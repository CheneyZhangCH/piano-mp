
import Vue from 'vue'
import Vuex from 'vuex'
import tabBar from './modules/tabBar'
import accountBusinessCount from './modules/accountBusinessCount'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        tabBar,
        accountBusinessCount,
    },
    getters
})

export default store
