import { constantRouterMap, asyncRouterMap } from '@/router'
import cloneDeep from 'lodash.clonedeep'

function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.indexOf(role) >= 0;
  } else {
    return true;
  }
}

// 递归过滤异步路由表，返回符合用户角色权限的路由表
function filterAsyncRouter(asyncRouterMap, role) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(role, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, role);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },

  actions: {
    generateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { role } = data;
        const AsyncRouterMap = cloneDeep(asyncRouterMap); // 深复制原始异步路由表，不用深复制会使原始路由表发生变化，导致错误
        let accessedRouters = filterAsyncRouter(AsyncRouterMap, role);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    }
  }
};

export default permission
