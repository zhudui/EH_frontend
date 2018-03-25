import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'

// Login
import Login from '@/views/Login'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true }
];

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'Home',
    component: Full,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      }
    ]
  }
];
