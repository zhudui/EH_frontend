<template>
  <div class="dashboard">
    <p>hello, {{fullname}}</p>
    <p>您现在不在任何班级</p>
    <p v-if="role === 'teacher'">请先创建班级</p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetClassList } from '@/api/class'
  export default {
    name: 'TeacherDashboard',
    computed: {
      ...mapGetters(['fullname', 'role'])
    },
    mounted() {
      GetClassList().then(res => {
        if (res.data.code === 0) {
          const classList = res.data.classList;
          if (classList.length) {
            let path = this.role === 'student' ? '/classInfo/' : '/t/classInfo/';
            path += classList[0].id;
            this.$router.push({ path: path });
          }
        }
      }).catch(err => {
        console.error(err);
      });
    }
  }
</script>

<style scoped>
  .dashboard {
    font-size: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
</style>
