<template>
  <div class="review-container">
    <h5 style="margin-bottom: 15px;">{{homeworkName}} 课程成绩总评</h5>
    <Table :columns="userColumns" :data="studentList"></Table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetUploadUserList } from '@/api/user'
  import { GetReviewList, SubmitReview } from '@/api/review'
  import { GetHomeworkName } from '@/api/homework'
  import { fileDownload } from '@/utils'
  export default {
    name: 'Review',
    data() {
      return {
        homeworkName: '',
        studentList: [],
        uploads: [],
        userColumns: [
          {
            title: '学号',
            width: 100,
            key: 'username'
          },
          {
            title: '姓名',
            width: 100,
            key: 'fullname'
          },
          {
            title: '作业',
            width: 100,
            key: 'homework',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      const upload = this.uploads.find(upload => upload.userId === params.row.id);
                      const filename = params.row.username + '-' + params.row.fullname;
                      fileDownload(upload.filePath, filename);
                    }
                  }
                }, '下载')
              ]);
            }
          },
          {
            title: '评语',
            key: 'comment',
            render: (h, params) => {
              return h('div', [
                h('Input', {
                  props: {
                    type: 'text',
                    value: this.studentList[params.index].comment
                  },
                  on: {
                    'on-blur': (event) => {
                      this.studentList[params.index].comment = event.target.value;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '分数',
            key: 'score',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                  props: {
                    type: 'text',
                    value: this.studentList[params.index].score
                  },
                  on: {
                    'on-change': (event) => {
                      this.studentList[params.index].score = event.target.value;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log('this.studentList[params.index]', this.studentList[params.index]);
                      this.submitReview(this.studentList[params.index]);
                    }
                  }
                }, '提交')
              ]);
            }
          }
        ]
      }
    },
    computed: {
      ...mapGetters(['userId', 'username', 'fullname', 'role'])
    },
    mounted() {
      GetHomeworkName(this.$route.params.homeworkId).then(res => {
        if (res.data.code === 0) {
          console.log('courseData', res.data);
          this.homeworkName = res.data.homeworkData.name;
        }
      }).catch(err => {
        console.error(err);
      });
      const reqData = {
        homeworkId: this.$route.params.homeworkId
      };
      GetUploadUserList(reqData).then(res => {
        let studentList = res.data.userList;
        this.uploads = res.data.uploads;
        console.log('res.data', res.data);
        GetReviewList(reqData).then(res => {
          if (res.data.code === 0) {
            const reviewList = res.data.reviewList;
            console.log('reviewList', reviewList);
            reviewList.forEach(review => {
              let student = studentList.find(data => data.id === review.revieweeId);
              if (student) {
                student.comment = review.comment;
                student.score = review.score;
              }
            });
            this.studentList = studentList;
            console.log('this.studentList', this.studentList);
          }
        }).catch(err => {
          console.error(err);
        })
      }).catch(err => {
        console.error(err);
      });
    },
    methods: {
      submitReview(student) {
        if (!student.score) {
          this.$Message.warning('请先填写分数');
        } else {
          if (isNaN(student.score)) {
            this.$Message.warning('分数必须是0~100的整数');
          } else {
            let score = parseInt(student.score);
            if (score >= 0 && score <= 100) {
              const review = {
                homeworkId: this.$route.params.homeworkId,
                reviewerId: this.userId,
                reviewerUsername: this.username,
                reviewerFullname: this.fullname,
                reviewerRole: this.role,
                revieweeId: student.id,
                revieweeUsername: student.username,
                revieweeFullname: student.fullname,
                comment: student.comment ? student.comment : null,
                score: score
              };
              console.log('review', review);
              SubmitReview(review).then(res => {
                if (res.data.code === 0) {
                  this.$Message.success('评分成功');
                }
              }).catch(err => {
                console.error(err);
              })
            } else {
              this.$Message.warning('分数必须是0~100的整数');
            }
          }
        }
      }
    }
  }
</script>

<style>
  .review-container {
    background-color: white;
    padding: 18px;
  }
</style>
