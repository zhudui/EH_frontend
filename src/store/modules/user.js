import { LoginByUsername, GetInfo, Logout } from '@/api/user'
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
    loginByUsername({ commit, dispatch, rootState }, { username, password }) {
      return new Promise((resolve, reject) => {
        LoginByUsername(username, password).then(response => {
          if (response.data.code === 0) {
            const user = response.data.user;
            commit('SET_ID', user.id);
            console.log('Cookies.get(\'token\')', Cookies.get('token'))
            console.log('document.cookie', document.cookie);
            commit('SET_TOKEN', Cookies.get('token'));
            commit('SET_USERNAME', username);
            commit('SET_FULLNAME', user.fullname);
            commit('SET_ROLE', user.role);
            commit('SET_EMAIL', user.email);
            console.log('user.role', user.role);
            dispatch('generateRoutes', { role: user.role }).then(() => { // 生成可访问的路由表
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
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        GetInfo(state.token).then(response => {
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

    logOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        Logout(state.token).then(() => {
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

    fedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Token');
        resolve();
      });
    }
  }
};

export default user
