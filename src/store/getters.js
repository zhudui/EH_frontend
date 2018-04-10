const getters = {
  userId: state => state.user.id,
  token: state => state.user.token,
  role: state => state.user.role,
  username: state => state.user.username,
  fullname: state => state.user.fullname,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers
};

export default getters
