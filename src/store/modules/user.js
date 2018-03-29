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
    sid: '',
    token: Cookies.get('Token')
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
    },

    SET_SID: (state, sid) => {
      state.sid = sid;
    }

  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        loginByUsername(username, password).then(response => {
          const data = response.data;
          console.log('response.data: ', response.data);
          Cookies.set('Token', data.token);
          commit('SET_ID', data.id);
          commit('SET_TOKEN', data.token);
          commit('SET_USERNAME', username);
          commit('SET_FULLNAME', data.fullname);
          commit('SET_ROLE', data.role);
          commit('SET_EMAIL', data.email);
          commit('SET_SID', data.sid);
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data;
          commit('SET_ID', data.id);
          commit('SET_USERNAME', data.username);
          commit('SET_FULLNAME', data.fullname);
          commit('SET_ROLE', data.role);
          commit('SET_EMAIL', data.email);
          commit('SET_SID', data.sid);
          resolve(response);
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
          Cookies.remove('Token');
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
