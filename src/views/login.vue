<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-body">
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <Form ref="loginForm" :model="loginForm" :rules="loginRules" autoComplete="on" class="card-box login-form">
                  <Form-item prop="username">
                    <Input type="text" v-model="loginForm.username" placeholder="Username" autoComplete="on">
                      <i class="icon-user" slot="prepend"></i>
                    </Input>
                  </Form-item>
                  <Form-item prop="password">
                    <Input type="password" v-model="loginForm.password" placeholder="Password">
                      <i class="icon-lock" slot="prepend"></i>
                    </Input>
                  </Form-item>
                  <Form-item>
                    <Button type="primary" @click="handleLogin" long>登录</Button>
                  </Form-item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('用户名不能小于3位'));
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
      loginForm: {
        username: 'qweqwe',
        password: 'qweqwe'
      },
      loginRules: {
        username: [
          { require: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { require: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('loginByUsername', this.loginForm).then(() => {
            this.$Message.success('登录成功');
            this.$router.push({ path: '/' });
          }).catch(err => {
            console.log('err', err);
            this.$Message.error(err);
          });
        } else {
          this.$Message.error('error submit!');
        }
      });
    }
  }
}
</script>
