<template>
  <div class="dashboard">
    <p>hello, {{fullname}}</p>
    <p>您现在不在任何班级</p>
    <p v-if="role === 'teacher'">请先创建班级</p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetCourseList } from '@/api/course'
  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters(['fullname', 'role'])
    },
    mounted() {
      GetCourseList().then(res => {
        if (res.data.code === 0) {
          const courseList = res.data.courseList;
          if (courseList.length) {
            let path = '/courseInfo/';
            path += courseList[0].id;
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
