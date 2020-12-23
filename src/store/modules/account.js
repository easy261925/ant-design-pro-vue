import { getAllService, createService, updateService, deleteService } from '@/api/settings/account'

const account = {
  namespaced: true,
  state: {
    list: [],
    total: 0,
    pagination: {
      current: 1,
      pageSize: 10
    }
  },

  mutations: {
    SAVE: (state, payload) => {
      state.list = payload.list
      state.total = payload.total
      state.pagination = payload.pagination
    }
  },

  actions: {
    // 获取列表
    GetAll({ commit, state }, payload) {
      const params = {
        ...state.pagination,
        ...payload,
      }
      return new Promise((resolve, reject) => {
        getAllService(params).then(response => {
          if (response.success) {
            commit('SAVE', {
              list: response.data.list,
              total: response.data.total,
              pagination: {
                current: payload.current,
                pageSize: payload.pageSize || state.pagination.pageSize
              }
            })
            resolve(response)
          }
        })
      }).catch(err => reject(err))
    },
    Create({ commit }, payload) {
      return new Promise((resolve, reject) => {
        createService(payload).then((response) => {
          if (response.success) {
            resolve(response)
          }
        })
      })
    },
    Update({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateService(payload).then((response) => {
          if (response.success) {
            resolve(response)
          }
        })
      })
    },
    Delete({ commit }, payload) {
      return new Promise((resolve, reject) => {
        deleteService(payload).then((response) => {
          if (response.success) {
            resolve(response)
          }
        })
      })
    }
  }
}

export default account