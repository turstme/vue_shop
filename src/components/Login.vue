<template>
  <div class="login_container">
    <div class="login">
      <!-- 插入用户头像 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 用户登陆表单 -->
      <el-form
        ref="loginFormRef"
        class="login_form"
        label-width="0px"
        :rules="loginFormRules"
        :model="loginForm"
      >
        <el-form-item class="input" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon=" iconfont icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item class="input" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon=" iconfont icon-3702mima"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- 登录重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //登录账户数据
      loginForm: {
        username: "",
        password: "",
      },
      // 表单验证规则
      loginFormRules: {
        // 用户名规则
        username: [
          { required: true, message: "请输入登陆用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 密码规则
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置按钮功能
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },

    // 登录功能，validate：验证表单的方法，验证结束会执行（）里面的回调函数，valid验证成功为true，
    // 验证失败为false
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        // this为该组件，axios在main.js中已添加到Vue的原型中，故各组件均可访问，async,await搭配使用
        // await接收promise返回的data对象，内置data为响应体
        const { data: res } = await this.$http.post("login", this.loginForm);
        // 验证成功(即符合密码规则)后，根据返回状态码弹框
        if (res.meta.status !== 200) return this.$message.error("登陆失败");
        this.$message.success("登录成功");
        //保存token到Session Stroge
        window.sessionStorage.setItem("token", res.data.token);
        // 编程式导航，使页面跳转到指定路由
        this.$router.push("/home");
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  position: relative;
  height: 100%;
  background-color: #2b4b6b;
  box-sizing: border-box;
}
.login {
  position: absolute;
  width: 400px;
  height: 350px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 0 3px;
  .logo {
    position: absolute;
    left: 50%;
    top: 15px;
    width: 100px;
    height: 100px;
    padding: 3px;
    border: 1px solid #ddd;
    border-radius: 50%;
    background-color: #eee;
    transform: translate(-50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .login_form {
    position: absolute;
    padding: 30px;
    bottom: 0;
    .input {
      display: inline-block;
      width: 100%;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>