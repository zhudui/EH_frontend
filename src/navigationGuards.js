import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

function hasPermission(role, to) {
  if (to.meta && to.meta.roles) {
    return to.meta.roles.indexOf(role) >= 0;
  }
  return true;
}

const whiteList = ['/login']; // 不重定向白名单

router.beforeEach((to, from, next) => {
  console.log('to', to);
  NProgress.start(); // 开启Progress
  if (store.getters.token) { // 判断是否有token
    console.log('has token');
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (!store.getters.role) { // 判断当前用户是否已拉取user_info
        store.dispatch('GetInfo').then(res => {
          console.log('userinfo', res.user);
          const role = res.user.role;
          store.dispatch('GenerateRoutes', { role }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to });
          });
        }).catch((err) => {
          console.log('errerrerrerrerr', err);
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' });
          });
        });
      } else {
        if (hasPermission(store.getters.role, to)) { // 有权限则直接进入
          next();
        } else {
          next({ path: '/', query: { noGoBack: true } });
        }
      }
    }
  } else {
    console.log('no token');
    if (whiteList.indexOf(to.path) !== -1) { // 在免登陆白名单，直接进入
      next();
    } else {
      next('/login'); // 否者全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
