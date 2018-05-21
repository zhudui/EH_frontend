<template>
  <div class="course-info-container clearfix">
    <div class="operation-bar clearfix">
      <h5 class="left" style="margin-top: 5px;">{{courseName}}</h5>
      <Button class="right" type="warning" @click="jumpToTotalMark"  v-if="role === 'teacher' || role === 'ta'">查看课程总评</Button>
      <Button class="right" type="success" style="margin-right: 15px" @click="toggleCourseUserList"  v-if="role === 'teacher' || role === 'ta'">管理课程用户</Button>
      <Button class="right" type="primary" style="margin-right: 15px" @click="showAddHomeworkModal"  v-if="role === 'teacher' || role === 'ta'">添加作业</Button>
    </div>
    <div :class="{ 'form-container': true, 'hide-form': hideForm }" v-if="role === 'teacher' || role === 'ta'">
      <Form ref="addCourseUserForm" :model="addCourseUserForm" :rules="addCourseUserRules" :label-width="80" style="margin-top: 24px">
        <FormItem label="用户名" prop="username">
          <Input v-model="addCourseUserForm.username" placeholder="请输入用户名..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="addingCourseUser" @click="addCourseUser">添加</Button>
          <Button type="ghost" style="margin-left: 8px" @click="hideForm = true">取消</Button>
        </FormItem>
      </Form>
    </div>
    <div :class="{ 'course-user-table-container': true, 'hide-table': hideTable, 'clearfix': true }" v-if="role === 'teacher' || role === 'ta'">
      <div class="right">
        <Button type="success" style="margin: 13px 0;" @click="hideForm = !hideForm">添加新用户</Button>
      </div>
      <Table :row-class-name="rowClassName" :columns="courseUserColumns" :data="courseUserList" style="margin-top: 60px"></Table>
    </div>
    <Modal v-model="deleteCourseUserModal" width="360" v-if="role === 'teacher' || role === 'ta'">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>你确定要删除用户 {{ deleteCourseUserInfo.username }} 吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="deletingCourseUser" @click="deleteCourseUser">删除</Button>
      </div>
    </Modal>


    <div class="row" v-for="n in homeworkRow" :key="n">
      <div class="col-sm-6 col-lg-3" v-for="m in 4" :key="m" v-if="homeworkList[4*n-5+m]">
        <b-card class="homework-container" :class="{ 'text-white': true,
        'bg-success': homeworkList[4*n-5+m].state === 'future',
        'bg-primary': homeworkList[4*n-5+m].state === 'open',
        'bg-gray': homeworkList[4*n-5+m].state === 'closed' }">
          <Dropdown class="right" trigger="click" placement="bottom-end">
            <a href="javascript:void(0)" class="homework-setting">
              <i class="fa fa-cogs p-1 font-2xl mr-1"></i>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>
                <div class="homework-dropdown-item" @click="downloadHomework(homeworkList[4*n-5+m])"><Icon type="clipboard" :size="20"></Icon> <span>下载作业</span></div>
              </DropdownItem>
              <DropdownItem>
                <div class="homework-dropdown-item" @click="showDescription(homeworkList[4*n-5+m])"><Icon type="clipboard" :size="20"></Icon> <span>作业描述</span></div>
              </DropdownItem>
              <DropdownItem v-if="(role === 'teacher' || role === 'ta') && homeworkList[4*n-5+m].state !== 'future'">
                <div class="homework-dropdown-item" @click="jumpToReview(homeworkList[4*n-5+m].id)"><Icon type="compose" :size="20"></Icon> <span>作业评分</span></div>
              </DropdownItem>
              <DropdownItem v-if="role === 'student' && homeworkList[4*n-5+m].state === 'open'">
                <div class="homework-dropdown-item" @click="showSubmitModal(homeworkList[4*n-5+m])"><Icon type="upload" :size="20"></Icon> <span>提交作业</span></div>
              </DropdownItem>
              <DropdownItem v-if="role === 'student' && homeworkList[4*n-5+m].state !== 'future'">
                <div class="homework-dropdown-item" @click="showGrade(homeworkList[4*n-5+m].id)"><Icon type="arrow-graph-up-right" :size="20"></Icon> <span>查看评分</span></div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div class="h4 m-0">{{homeworkList[4*n-5+m].name}}</div>
          <div class="homework-daterange">{{homeworkList[4*n-5+m].startTime}} ~ {{homeworkList[4*n-5+m].endTime}}</div>
          <Progress :percent="homeworkList[4*n-5+m].submitNum / homeworkList[4*n-5+m].studentNum * 100" status="active" :hide-info="true" :stroke-width="8" style="margin-bottom: 5px;"></Progress>
          <small class="text-muted left" style="margin-right: 15px;">{{homeworkList[4*n-5+m].submitNum}} / {{homeworkList[4*n-5+m].studentNum}}</small>
          <small class="text-muted download-homework left" v-if="homeworkList[4*n-5+m].state !== 'future' && role === 'student'" @click="downloadUserHomework(homeworkList[4*n-5+m].id)">下载我的作业</small>
          <small class="text-muted right" v-if="homeworkList[4*n-5+m].state === 'future'">未开放</small>
          <small class="text-muted right" v-else-if="homeworkList[4*n-5+m].state === 'open'">开放中</small>
          <small class="text-muted right" v-else>已关闭</small>
        </b-card>
      </div>
    </div>
    <Modal
      v-if="role === 'teacher' || role === 'ta'"
      v-model="addHomeworkModal"
      title="添加作业"
      :mask-closable="false">
      <Form ref="addHomeworkForm" :model="addHomeworkForm" :rules="addHomeworkRules">
        <FormItem label="作业名" prop="name">
          <Input v-model="addHomeworkForm.name"></Input>
        </FormItem>
        <FormItem label="开始时间" prop="startTime">
          <DatePicker type="datetime" v-model="addHomeworkForm.startTime" placeholder="请选择开始时间..." style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endTime">
          <DatePicker type="datetime" v-model="addHomeworkForm.endTime" placeholder="请选择结束时间..." style="width: 300px"></DatePicker>
        </FormItem>
        <p>提示：只有最新上传的作业才有效，新上传的作业会覆盖之前上传的作业</p>
        <Upload
          ref="uploadHomework"
          type="drag"
          :default-file-list="fileList"
          :data="uploadData"
          :before-upload="handleUpload"
          action="/api/upload">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>Click or drag files here to upload</p>
          </div>
        </Upload>
        <div v-if="homeworkFile !== null">上传作业: {{ homeworkFile.name }}</div>
        <FormItem label="作业描述" prop="description" placeholder="可不填">
          <Input type="textarea" :rows="15" v-model="addHomeworkForm.description"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button :loading="false" @click="addHomeworkModal = false">返回</Button>
        <Button type="primary" :loading="addingHomework" @click="addHomework">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="descriptionModal"
      title="作业描述"
      :mask-closable="false">
      <p style="font-size: 15px;">
        {{ homeworkDescription }}
      </p>
    </Modal>
    <Modal
      v-if="role === 'student'"
      v-model="checkGradeModal"
      title="查看作业评分"
      :mask-closable="false"
      :width="700">
      <Row class="review-box">
        <Col span="18" class="review comment-container">
          <template v-if="review.comment">{{review.comment}}</template>
          <template v-else>暂无评语</template>
        </Col>
        <Col span="6" class="review grade-container">
          <div>分数：{{review.score}}</div>
        </Col>
      </Row>
    </Modal>
    <Modal
      v-if="role === 'student'"
      v-model="submitHomeworkModal"
      title="提交作业"
      :mask-closable="false">
      <p>提示：只有最新提交的作业才有效，新提交的作业会覆盖之前提交的作业</p>
      <Upload
        type="drag"
        :default-file-list="fileList"
        :data="uploadData"
        :on-success="handleSuccessSubmit"
        action="/api/upload">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>Click or drag files here to upload</p>
        </div>
      </Upload>
    </Modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import { AddCourseUser, GetCourseUserList, DeleteCourseUser } from '@/api/user'
  import { AddHomework, GetHomeworkList } from '@/api/homework'
  import { GetFilePath } from '@/api/upload'
  import { GetReview } from '@/api/review'
  import { GetCourseName } from '@/api/course'
  import { addHomeworkState, fileDownload } from '@/utils';

  export default {
    name: 'CourseInfo',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length === 0 || value.length > 20) {
          callback(new Error('用户名应包含1~20个字符'));
        } else {
          callback();
        }
      };

      const validateName = (rule, value, callback) => {
        if (value.length === 0 || value.length > 48) {
          callback(new Error('作业名应包含1~48个字符'));
        } else {
          callback();
        }
      };

      const validateStartTime = (rule, value, callback) => {
        console.log('value', value);
        if (value.length === 0) {
          callback(new Error('请选择开始时间'));
        } else {
          callback();
        }
      };

      const validateEndTime = (rule, value, callback) => {
        console.log('value', value);
        if (value.length === 0) {
          callback(new Error('请选择结束时间'));
        } else {
          callback();
        }
      };

      const validateDescription = (rule, value, callback) => {
        if (value.length > 2000) {
          callback(new Error('作业描述应少于2000个字符'));
        } else {
          callback();
        }
      };

      return {
        courseName: '',
        courseStudentNum: 0,
        addHomeworkModal: false,
        addingHomework: false,
        addHomeworkForm: {
          name: '',
          description: '',
          startTime: '',
          endTime: ''
        },
        addHomeworkRules: {
          name: [
            { require: true, validator: validateName }
          ],
          startTime: [
            { require: true, validator: validateStartTime }
          ],
          endTime: [
            { require: true, validator: validateEndTime }
          ],
          description: [
            { require: false, validator: validateDescription }
          ]
        },
        homeworkList: [],
        homeworkRow: 1,
        hideTable: true,
        hideForm: true,
        courseUserList: [],
        addCourseUserForm: {
          username: ''
        },
        addCourseUserRules: {
          name: [
            { require: true, validator: validateUsername }
          ]
        },
        addingCourseUser: false,
        deleteCourseUserInfo: {
          userId: null,
          username: ''
        },
        deletingCourseUser: false,
        deleteCourseUserModal: false,
        courseUserColumns: [
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '姓名',
            key: 'fullname'
          },
          {
            title: '角色',
            key: 'role'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              if (this.userId === params.row.id) return;
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteCourseUserInfo.userId = params.row.id;
                      this.deleteCourseUserInfo.username = params.row.username;
                      this.deleteCourseUserModal = true;
                    }
                  }
                }, 'Delete')
              ]);
            }
          }
        ],
        interval: null,
        descriptionModal: false,
        homeworkDescription: '',
        checkGradeModal: false,
        submitHomeworkModal: false,
        fileList: [],
        uploadData: {
          homeworkId: null
        },
        review: {
          reviewerRole: '',
          comment: '',
          score: null
        },
        homeworkFile: null
      }
    },
    computed: {
      ...mapGetters(['userId', 'username', 'fullname', 'role'])
    },
    watch: {
      '$route' (to, from) {
        this.hideTable = true;
        this.hideForm = true;
        GetCourseName(this.$route.params.courseId).then(res => {
          if (res.data.code === 0) {
            this.courseName = res.data.courseData.name;
          }
        }).catch(err => {
          console.error(err);
        });
        this.$store.dispatch('getCourseName', { courseId: this.$route.params.courseId });
        this.getHomeworkList();
      }
    },
    mounted() {
      const self = this;
      GetCourseName(this.$route.params.courseId).then(res => {
        if (res.data.code === 0) {
          this.courseName = res.data.courseData.name;
        }
      }).catch(err => {
        console.error(err);
      });
      this.getHomeworkList();

      // 每过十秒更新一次作业的状态
      this.interval = setInterval(() => {
        addHomeworkState(self.homeworkList);
      }, 10000);
    },
    beforeDestroy() {
      clearInterval(this.interval);
    },
    methods: {
      rowClassName(row, index) {
        if (row.role === 'student') {

        } else if (row.role === 'teacher') {
          return 'table-teacher-row';
        } else if (row.role === 'ta') {
          return 'table-ta-row';
        } else {
          return 'table-admin-row';
        }
      },

      toggleCourseUserList() {
        this.hideTable = !this.hideTable;
        this.hideForm = true;
        if (!this.hideTable) {
          GetCourseUserList(this.$route.params.courseId).then(res => {
            console.log('res.data', res.data);
            this.courseUserList = res.data.courseUserList;
          }).catch(err => {
            console.log(err);
          });
        }
      },

      showAddHomeworkModal() {
        this.fileList = [];
        this.addHomeworkModal = true;
      },

      addCourseUser() {
        this.$refs.addCourseUserForm.validate(valid => {
          if (valid) {
            if (this.courseUserList.find(user => user.username === this.addCourseUserForm.username)) {
              this.$Message.warning('该用户已在此班级');
            } else {
              this.addingCourseUser = true;
              const courseUserData = {
                courseId: this.$route.params.courseId,
                username: this.addCourseUserForm.username
              };
              AddCourseUser(courseUserData).then(res => {
                this.addingCourseUser = false;
                if (res.data.code === 0) {
                  this.courseUserList.push(res.data.courseUser);
                  this.$Message.success('添加用户成功');
                } else {
                  this.$Message.error(res.data.msg);
                }
              }).catch(err => {
                console.error(err);
              })
            }
          } else {
            this.$Message.error('输入出错，请检查');
          }
        });
      },

      deleteCourseUser() {
        this.deletingCourseUser = true;
        const data = {
          userId: this.deleteCourseUserInfo.userId,
          courseId: this.$route.params.courseId
        };
        DeleteCourseUser(data).then(res => {
          GetCourseUserList(this.$route.params.courseId).then(res => {
            console.log('res.data', res.data);
            this.courseUserList = res.data.courseUserList;
            this.deletingCourseUser = false;
            this.deleteCourseUserModal = false;
            this.$Message.success('删除用户成功');
          }).catch(err => {
            console.log(err);
          });
        })
      },

      addHomework() {
        this.$refs.addHomeworkForm.validate(valid => {
          if (valid) {
            this.addingHomework = true;
            const homeworkData = {
              name: this.addHomeworkForm.name,
              description: this.addHomeworkForm.description,
              courseId: this.$route.params.courseId,
              startTime: moment(this.addHomeworkForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(this.addHomeworkForm.endTime).format('YYYY-MM-DD HH:mm:ss')
            };
            console.log('homeworkData', homeworkData);
            if (homeworkData.startTime >= homeworkData.endTime) {
              this.$Message.warning('结束时间应该大于开始时间');
              this.addingHomework = false;
            } else {
              if (!this.homeworkFile && !this.addHomeworkForm.description) {
                this.$Message.warning('请至少上传作业文件或填写作业描述，不能两项都为空');
                this.addingHomework = false;
              } else {
                AddHomework(homeworkData).then(res => {
                  if (res.data.code === 0) {
                    this.addingHomework = false;
                    this.addHomeworkModal = false;
                    this.uploadData.homeworkId = res.data.homework.id;
                    this.$refs.uploadHomework.post(this.homeworkFile);
                    this.getHomeworkList();
                    this.$Message.success('创建作业成功');
                  }
                }).catch(err => {
                  console.error(err);
                })
              }
            }
          } else {
            this.$Message.error('输入不正确，请检查');
          }
        });
      },

      showDescription(homework) {
        this.homeworkDescription = homework.description;
        this.descriptionModal = true;
      },

      showGrade(homeworkId) {
        const data = {
          homeworkId: homeworkId,
          revieweeId: this.userId
        }
        GetReview(data).then(res => {
          if (res.data.code === 0) {
            this.checkGradeModal = true;
            this.review = res.data.review;
            console.log('res.data.review', res.data.review);
          } else {
            this.$Message.warning(res.data.msg);
          }
        }).catch(err => {
          console.error(err);
        })
      },

      showSubmitModal(homework) {
        this.fileList = [];
        this.uploadData.homeworkId = homework.id;
        this.submitHomeworkModal = true;
      },

      downloadUserHomework(homeworkId) {
        GetFilePath({
          homeworkId: homeworkId,
          userId: this.userId
        }).then(res => {
          if (res.data.code === 0) {
            console.log('res.data.filePath', res.data.filePath)
            const filename = this.username + '-' + this.fullname;
            fileDownload(res.data.filePath, filename);
          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch(err => {
          console.error(err);
        })
      },

      jumpToReview(homeworkId) {
        this.$router.push({ path: '/review/' + homeworkId });
      },

      jumpToTotalMark() {
        this.$router.push({ path: '/totalMark/' + this.$route.params.courseId });
      },

      handleUpload(file) {
        this.homeworkFile = file;
        return false;
      },

      downloadHomework(homework) {
        GetFilePath({
          homeworkId: homework.id,
          isTfile: true // 表示获取老师或TA上传的作业
        }).then(res => {
          if (res.data.code === 0) {
            console.log('res.data.filePath', res.data.filePath)
            const filename = homework.name;
            fileDownload(res.data.filePath, filename);
          } else {
            this.$Message.warning(res.data.msg);
          }
        }).catch(err => {
          console.error(err);
        })
      },

      getHomeworkList() {
        GetHomeworkList(this.$route.params.courseId).then(res => {
          if (res.data.code === 0) {
            let homeworkList = res.data.homeworkList;
            let uploadDataList = res.data.uploadDataList;
            addHomeworkState(homeworkList);
            console.log('homeworkList', homeworkList);
            console.log('uploadDataList', uploadDataList);
            for (let i = 0; i < homeworkList.length; ++i) {
              homeworkList[i].studentNum = uploadDataList[i].studentNum;
              homeworkList[i].submitNum = uploadDataList[i].submitNum;
            }
            this.homeworkList = homeworkList;
            this.homeworkRow = Math.ceil(this.homeworkList.length / 4);
            if (this.homeworkRow === 0) this.homeworkRow = 1;
            console.log('this.homeworkList', this.homeworkList);
          }
        }).catch(err => {
          console.error(err);
        });
      },

      handleSuccessSubmit() {
        this.getHomeworkList();
      }
    }
  }
</script>

<style>
  .ivu-table .table-teacher-row td {
    background-color: #2db7f52e;
  }

  .ivu-table .table-ta-row td {
    background-color: #19be6b2e;
  }

  .ivu-table .table-admin-row td {
    background-color: #ff66002e;
  }

  .ivu-upload-list-remove {
    display: none !important;
  }
</style>

<style scoped>
  .bg-gray {
    background-color: #869fac;
    border: 1px solid #536c79;
  }

  .course-info-container {
    background-color: white;
    padding: 18px;
  }

  .operation-bar {
    margin-bottom: 15px;
  }

  .homework-daterange {
    margin-top: 8px;
  }

  .homework-setting {
    color: white;
  }

  .homework-setting:hover {
    color: #0a3544;
  }

  .course-user-table-container {
    transition: all .5s;
    overflow: hidden;
    width: 100%;
    height: 540px;
    margin-bottom: 10px;
    padding: 0 5%;
    border-top: 1px solid #e4e5e6;
    border-bottom: 1px solid #e4e5e6;
  }

  .hide-table {
    height: 0;
    opacity: 0;
  }

  .form-container {
    transition: all .5s;
    overflow: hidden;
    width: 100%;
    height: 150px;
    margin-top: 20px;
    padding: 0 15%;
    border-top: 1px solid #e4e5e6;
  }

  .hide-form {
    height: 0;
    opacity: 0;
  }

  .homework-container {
    transition: all 2s;
  }

  .homework-dropdown-item {
    font-size: 15px;
    padding: 5px;
  }

  .homework-dropdown-item span {
    display: inline-block;
    position: relative;
    top: -2px;
  }

  .review-box {
    margin-bottom: 15px;
  }

  .review {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items:center;
    height: 70px;
    border-top: 1px solid #187da0c2;
    border-bottom: 1px solid #187da0c2;
    font-size: 15px;
  }

  .comment-container {
    font-weight: normal;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
    border-left: 1px solid #187da0c2;
  }

  .grade-container {
    color: white;
    background-color: #20a8d8c2;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    border-right: 1px solid #187da0c2;
  }

  .download-homework:hover {
    color: white !important;
    cursor: pointer;
  }

</style>
