<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarMinimize">&#9776;</button>

    <Dropdown class="nav-item" placement="bottom-end">
      <a href="javascript:void(0)">
           <span slot="button">
          <img src="static/img/avatars/6.jpg" class="img-avatar" alt="o">
          <span class="d-md-down-none">admin</span>
          </span>
      </a>
      <Dropdown-menu slot="list">
        <Dropdown-item>
          <p class="dropdown-itemp"><Icon type="android-contact"></Icon> Profile</p>
        </Dropdown-item>

        <Dropdown-item > <a href="" @click.prevent="Logout"  ><p  class="dropdown-itemp"><Icon type="power"></Icon> Logout</p></a></Dropdown-item>

      </Dropdown-menu>
    </Dropdown>

    <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" @click="asideToggle">&#9776;</button>
  </header>
</template>
<script>
export default {
  name: 'header',
  methods: {
    Logout() {
      this.$store.dispatch('logOut').then(() => {
        this.$router.push({ path: '/login' });
      }).catch(err => {
        this.$Message.error(err);
      });
    },
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
</script>

<style scoped>
  .app-header {
    z-index: 50;
  }

  .nav-item {
    padding-right: 15px;
  }

  .dropdown-itemp{
    font-size: 15px;
    display: table-cell;
    vertical-align:middle;
    padding: 5px 0;
  }
</style>
