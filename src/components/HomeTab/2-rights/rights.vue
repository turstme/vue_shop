<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 权限列表渲染 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    // 渲染列表
    this.getrightsList();
  },
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    // 渲染列表
    async getrightsList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);
      this.rightsList = res.data;
    },
  },
};
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 30px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>