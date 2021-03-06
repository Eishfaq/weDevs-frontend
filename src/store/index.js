import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    collapse: false,
    authUser:''
  },
  getters: {
    collapse(state) {
      return state.collapse;
    },
    authUser(state){
      return state.authUser;
    }
  },
  mutations: {
    changeStatus(state) {
      state.collapse = !state.collapse
    },
    setUser(state,value){
      state.authUser = value;
    }
  },
  actions: {
    setUser({commit},value){
      commit('setUser',value)
    },
  },
})
