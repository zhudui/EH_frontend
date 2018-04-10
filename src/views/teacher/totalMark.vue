<template>
  <div class="total-mark-container">
    <h5 style="margin-bottom: 15px;">{{className}} 班级成绩总评</h5>
    <Table border :columns="userColumns" :data="studentList"></Table>
  </div>
</template>

<script>
  import { GetHomeworkNameList } from '@/api/homework'
  import { GetClassUserList } from '@/api/user'
  import { GetClassReviewData } from '@/api/review'
  import { GetClassName } from '@/api/class'
  export default {
    name: 'TotalMark',
    data() {
      return {
        className: '',
        userColumns: [{
          title: '学号',
          key: 'username'
        },
        {
          title: '姓名',
          key: 'fullname'
        }],
        studentList: []
      }
    },
    mounted() {
      GetClassName(this.$route.params.classId).then(res => {
        if (res.data.code === 0) {
          this.className = res.data.classData.name;
        }
      }).catch(err => {
        console.error(err);
      });
      GetHomeworkNameList(this.$route.params.classId).then(res => {
        if (res.data.code === 0) {
          let homeworkList = res.data.homeworkNameList;
          const homeworkCounts = homeworkList.length;
          homeworkList.forEach(homework => {
            this.userColumns.push({
              title: homework.name,
              key: homework.id
            });
          });
          this.userColumns.push({
            title: '平均分',
            key: 'averageScore'
          })
          GetClassUserList(this.$route.params.classId, { onlyStudent: true }).then(res => {
            if (res.data.code === 0) {
              let classStudentList = res.data.classUserList;
              console.log('classUserList', classStudentList);
              GetClassReviewData(this.$route.params.classId).then(res => {
                if (res.data.code === 0) {
                  let tableData = [];
                  let reviewData = res.data.reviewData;
                  console.log('reviewData', reviewData);
                  classStudentList.forEach(student => {
                    let rowData = {
                      id: student.id,
                      username: student.username,
                      fullname: student.fullname
                    };
                    let totalScore = 0;
                    homeworkList.forEach(homework => {
                      let review = reviewData.find(review => review.revieweeId === student.id && review.homeworkId === homework.id);
                      if (review) {
                        rowData[homework.id] = review.score;
                        totalScore += review.score;
                      }
                    });
                    let averageScore = totalScore / homeworkCounts;
                    rowData.averageScore = averageScore.toFixed(1);
                    tableData.push(rowData);
                  });
                  this.studentList = tableData;
                }
              }).catch(err => {
                console.error(err);
              })
            }
          }).catch(err => {
            console.error(err);
          })
        }
      }).catch(err => {
        console.error(err);
      })
    }
  }
</script>

<style scoped>
  .total-mark-container {
    background-color: white;
    padding: 18px;
  }
</style>
