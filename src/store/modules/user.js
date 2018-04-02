import { loginByUsername, getInfo, logout } from '@/api/auth'
import Router from 'vue-router'
import router, { constantRouterMap } from '@/router'
import Cookies from 'js-cookie'

const user = {
  state: {
    id: '',
    username: '',
    fullname: '',
    email: '',
    role: '',
    token: Cookies.get('token')
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id;
    },

    SET_TOKEN: (state, token) => {
      state.token = token;
    },

    SET_USERNAME: (state, username) => {
      state.username = username;
    },

    SET_FULLNAME: (state, fullname) => {
      state.fullname = fullname;
    },

    SET_ROLE: (state, role) => {
      state.role = role;
    },

    SET_EMAIL: (state, email) => {
      state.email = email;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit, dispatch, rootState }, { username, password }) {
      return new Promise((resolve, reject) => {
        loginByUsername(username, password).then(response => {
          console.log('response.data', response.data);
          if (response.data.code === 0) {
            const user = response.data.user;
            commit('SET_ID', user.id);
            commit('SET_TOKEN', Cookies.get('token'));
            commit('SET_USERNAME', username);
            commit('SET_FULLNAME', user.fullname);
            commit('SET_ROLE', user.role);
            commit('SET_EMAIL', user.email);
            dispatch('GenerateRoutes', { role: user.role }).then(() => { // 生成可访问的路由表
              router.addRoutes(rootState.permission.addRouters); // 动态添加可访问路由表
              resolve();
            });
          } else {
            reject(response.data.msg);
          }
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const user = response.data.user;
          commit('SET_ID', user.id);
          commit('SET_USERNAME', user.username);
          commit('SET_FULLNAME', user.fullname);
          commit('SET_ROLE', user.role);
          commit('SET_EMAIL', user.email);
          resolve(response.data);
        }).catch(error => {
          reject(error);
        });
      });
    },

    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLE', '');
          const newRouter = new Router({ // difficulty:去除router中duplicate路由的方法
            mode: 'hash',
            linkActiveClass: 'open active',
            scrollBehavior: () => ({ y: 0 }),
            routes: constantRouterMap
          });
          router.matcher = newRouter.matcher;
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Token');
        resolve();
      });
    }
  }
};

export default user
