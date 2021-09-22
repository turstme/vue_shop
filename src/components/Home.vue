<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <!-- 图标&title -->
      <div class="home_logo">
        <span>
          <img src="../assets/heima.png" alt="" />
        </span>
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 侧边导航栏 -->
    <el-container>
      <!-- 侧边栏折叠展开 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          default-active="activePath"
        >
          <!-- 折叠功能 -->
          <div class="collapse" @click="Collapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in MenuList"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 二级菜单渲染一级菜单的children属性 -->
            <el-menu-item
              @click="saveNavState('/' + item1.path)"
              :index="'/' + item1.path"
              v-for="item1 in item.children"
              :key="item1.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ item1.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- main区域 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧侧边栏数据
      MenuList: [],
      //   左侧侧边栏图标
      icons: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      //是否折叠
      isCollapse: false,
      //活动路径
      activePath: "",
    };
  },
  //   钩子函数，创建完成时调用getMenuList函数
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    //   退出按钮功能，清空token，编程式导航到登录页面
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 发送请求到menus接口，获得响应数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      //   console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //   得到的data保存到MenuList中
      this.MenuList = res.data;
      // console.log(this.MenuList);
    },
    //折叠功能
    Collapse() {
      this.isCollapse = !this.isCollapse;
    },
    //活动路径
    saveNavState(path) {
      window.sessionStorage.setItem("activePath", path);
      this.activePath = path;
    },
  },
};
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .home_logo {
      display: flex;
      align-items: center;
      > span {
        color: #fff;
      }
    }
  }
}

.el-header {
  background-color: #363c42;
}
.el-aside {
  background-color: #313743;
  .el-menu {
    border-right: 0px;

    .collapse {
      color: #fff;
      background-color: #495065;
      text-align: center;
      letter-spacing: 0.2em;
      font-size: 8px;
      line-height: 20px;
    }
  }
  .iconfont {
    margin-right: 10px;
  }
}
.el-main {
  background: #e9edf1;
}
</style>    