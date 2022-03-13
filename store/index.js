
import Vue from 'vue'
import Vuex from 'vuex'
import tabBar from './modules/tabBar'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        tabBar
    },
    getters
})

export default store
