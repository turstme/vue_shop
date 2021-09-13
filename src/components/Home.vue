<template>
  <div>
    <div>home</div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    //   退出按钮功能，清空token，编程式导航到登录页面
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="less" scoped>
</style>