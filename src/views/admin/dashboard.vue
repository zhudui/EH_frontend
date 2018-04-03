<template>
  <div class="animated fadeIn admin-dashboard-container">
    <div class="clearfix">
      <Button class="right" type="primary" @click="hideForm = !hideForm">添加新用户</Button>
    </div>
    <div :class="{ 'form-container': true, 'hide-form': hideForm }">
      <Form ref="addUserForm" :model="addUserForm" :rules="userRules" :label-width="80" style="margin-top: 24px">
        <FormItem label="用户名" prop="username">
          <Input v-model="addUserForm.username" placeholder="请输入用户名..."></Input>
        </FormItem>
        <FormItem label="姓名" prop="fullname">
          <Input v-model="addUserForm.fullname" placeholder="请输入姓名..."></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="addUserForm.password" placeholder="请输入密码..."></Input>
        </FormItem>
        <FormItem label="角色" prop="role">
          <RadioGroup v-model="addUserForm.role">
            <Radio label="student">学生</Radio>
            <Radio label="teacher">老师</Radio>
            <Radio label="ta">TA</Radio>
            <Radio label="admin">管理员</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addUser">添加</Button>
          <Button type="ghost" style="margin-left: 8px" @click="hideForm = true">取消</Button>
        </FormItem>
      </Form>
    </div>
    <Table :row-class-name="rowClassName" :columns="userColumns" :data="userList" style="margin-top: 15px"></Table>
    <Modal
      v-model="editUserModel"
      title="编辑用户"
      :loading="editingUser"
      @on-ok="editUser">
      <Form ref="editUserForm" :model="editUserForm" :rules="userRules" :label-width="80" style="margin-top: 24px">
        <FormItem label="用户名" prop="username">
          <Input v-model="editUserForm.username" disabled></Input>
        </FormItem>
        <FormItem label="姓名" prop="fullname">
          <Input v-model="editUserForm.fullname" placeholder="请输入姓名..."></Input>
        </FormItem>
        <FormItem label="角色" prop="role">
          <RadioGroup v-model="editUserForm.role">
            <Radio label="student" disabled>学生</Radio>
            <Radio label="teacher" disabled>老师</Radio>
            <Radio label="ta" disabled>TA</Radio>
            <Radio label="admin" disabled>管理员</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="deleteUserModel" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>删除用户后将不可复原</p>
        <p>你确定要删除用户 {{ deleteUserInfo.username }} 吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="deletingUser" @click="deleteUser">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { AddUser, GetAllUser, EditUser, DeleteUser } from '@/api/user'
  export default {
    name: 'AdminDashboard',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('用户名不能小于3位'));
        } else {
          callback();
        }
      };

      const validateFullname = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入姓名'));
        } else {
          callback();
        }
      };

      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'));
        } else {
          callback();
        }
      };

      return {
        hideForm: true,
        editingUser: false,
        editUserModel: false,
        deleteUserModel: false,
        deleteUserInfo: {
          username: ''
        },
        deletingUser: false,
        userColumns: [
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
              if (params.row.role === 'admin') return;
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
                      this.editUserModel = true;
                      const user = params.row;
                      console.log('user', user);
                      this.editUserForm = {
                        username: user.username,
                        fullname: user.fullname,
                        role: user.role
                      }
                    }
                  }
                }, 'Edit'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteUserInfo.username = params.row.username;
                      this.deleteUserModel = true;
                    }
                  }
                }, 'Delete')
              ]);
            }
          }
        ],
        userList: [],
        addUserForm: {
          username: '',
          fullname: '',
          password: '',
          role: 'student'
        },
        editUserForm: {
          username: '',
          fullname: '',
          role: 'student'
        },
        userRules: {
          username: [
            { require: true, trigger: 'blur', validator: validateUsername }
          ],
          fullname: [
            { require: true, trigger: 'blur', validator: validateFullname }
          ],
          password: [
            { require: true, trigger: 'blur', validator: validatePassword }
          ]
        }
      }
    },
    mounted() {
      GetAllUser().then(res => {
        console.log('res.data', res.data);
        this.userList = res.data.userList;
      }).catch(err => {
        console.log(err);
      });
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

      addUser() {
        console.log('addUserForm', this.addUserForm);
        this.$refs.addUserForm.validate(valid => {
          if (valid) {
            AddUser(this.addUserForm).then((res) => {
              if (res.data.code === 0) {
                GetAllUser().then(res => {
                  console.log('res.data', res.data);
                  this.userList = res.data.userList;
                  this.$Message.success('添加用户成功');
                }).catch(err => {
                  this.$Message.error(err);
                });
              } else {
                this.$Message.info(res.data.msg);
              }
            }).catch(err => {
              this.$Message.error(err);
            });
          } else {
            this.$Message.error('输入出错，请检查');
          }
        });
      },

      editUser() {
        EditUser({
          username: this.editUserForm.username,
          fullname: this.editUserForm.fullname
        }).then(res => {
          if (res.data.code === 0) {
            GetAllUser().then(res => {
              this.userList = res.data.userList;
              this.$Message.success('修改用户成功');
            }).catch(err => {
              this.$Message.error(err);
            });
          }
        }).catch(err => {
          this.$Message.error(err);
        })
      },

      deleteUser() {
        this.deletingUser = true;
        DeleteUser(this.deleteUserInfo).then(res => {
          if (res.data.code === 0) {
            GetAllUser().then(res => {
              this.userList = res.data.userList;
              this.deletingUser = false;
              this.deleteUserModel = false;
              this.$Message.success('删除用户成功');
            }).catch(err => {
              this.$Message.error(err);
            });
          }
        }).catch(err => {
          this.$Message.error(err);
        })
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
</style>

<style scoped>
  .admin-dashboard-container {
    margin-top: 15px;
    background-color: white;
    padding: 15px;
  }

  .form-container {
    transition: all .5s;
    overflow: hidden;
    width: 100%;
    height: 340px;
    margin-top: 20px;
    padding: 0 15%;
    border-top: 1px solid #e4e5e6;
    border-bottom: 1px solid #e4e5e6;
  }

  .hide-form {
    height: 0;
    opacity: 0;
  }

</style>
