<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar/>
      <main class="main">
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
  </div>
</template>

<script>
import { Header as AppHeader, Sidebar, Aside as AppAside } from '../components/'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside
  }
}
</script>

<style scoped>
  .container-fluid {
    padding-top: 20px;
  }

  .main {
    background-color: #e4e5e6;
  }
</style>
