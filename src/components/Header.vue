<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarMinimize">&#9776;</button>

    <Dropdown class="nav-item" placement="bottom-end">
      <a href="javascript:void(0)">
        <span slot="button">
          <img src="static/img/avatars/6.jpg" class="img-avatar" alt="o">
          <span class="d-md-down-none">{{fullname}}</span>
        </span>
      </a>
      <Dropdown-menu slot="list">
        <Dropdown-item>
          <p class="dropdown-itemp" @click="changePasswordModal = true"><Icon type="ios-unlocked"></Icon> 修改密码</p>
        </Dropdown-item>

        <Dropdown-item > <a href="" @click.prevent="Logout"  ><p  class="dropdown-itemp"><Icon type="power"></Icon> 注销</p></a></Dropdown-item>

      </Dropdown-menu>
    </Dropdown>

    <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" @click="asideToggle">&#9776;</button>

    <Modal
      v-model="changePasswordModal"
      title="修改密码"
      :mask-closable="false">
      <Form ref="changePasswordForm" :model="changePasswordForm" :rules="changePasswordRules">
        <FormItem label="旧密码" prop="oldPassword">
          <Input v-model="changePasswordForm.oldPassword"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
          <Input v-model="changePasswordForm.newPassword"></Input>
        </FormItem>
        <FormItem label="重复密码" prop="repeatPassword">
          <Input v-model="changePasswordForm.repeatPassword"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button :loading="false" @click="changePasswordModal = false">返回</Button>
        <Button type="primary" :loading="changingPassword" @click="changePassword">确定</Button>
      </div>
    </Modal>
  </header>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { ChangePassword } from '@/api/user'
  export default {
    name: 'header',
    data() {
      const validateOldPassword = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入旧密码'));
        } else {
          callback();
        }
      };

      const validateNewPassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'));
        } else {
          callback();
        }
      };

      const validateRepeatPassword = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };

      return {
        changePasswordModal: false,
        changingPassword: false,
        changePasswordForm: {
          oldPassword: '',
          newPassword: '',
          repeatPassword: ''
        },
        changePasswordRules: {
          oldPassword: [
            { require: true, validator: validateOldPassword }
          ],
          newPassword: [
            { require: true, validator: validateNewPassword }
          ],
          repeatPassword: [
            { require: true, validator: validateRepeatPassword }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(['userId', 'fullname', 'role'])
    },
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
      },

      changePassword() {
        this.$refs.changePasswordForm.validate(valid => {
          if (valid) {
            if (this.changePasswordForm.newPassword !== this.changePasswordForm.repeatPassword) {
              this.$Message.error('新密码与重复密码不相同，请重新输入');
            } else {
              this.changingPassword = true;
              ChangePassword({
                userId: this.userId,
                oldPassword: this.changePasswordForm.oldPassword,
                newPassword: this.changePasswordForm.newPassword
              }).then(res => {
                if (res.data.code === 0) {
                  this.$Message.success('修改密码成功');
                } else {
                  this.$Message.error(res.data.msg);
                }
                this.changingPassword = false;
              }).catch(err => {
                this.$Message.error(err);
                this.changingPassword = false;
              })
            }
          } else {
            this.$Message.error('输入出错，请检查');
          }
        })
      }
    }
  }
</script>

<style>
  .ivu-select-dropdown .ivu-dropdown-menu {
    margin-bottom: 0px;
  }
</style>

<style scoped>
  .app-header {
    z-index: 50;
  }

  .nav-item {
    padding-right: 15px;
  }

  .dropdown-itemp {
    font-size: 15px;
    display: table-cell;
    vertical-align:middle;
    padding: 5px 0;
  }
</style>
