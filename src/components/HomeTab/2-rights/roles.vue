<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="addRoleDialogVisible = true"
          >添加角色</el-button
        >
      </el-row>
      <!-- 列表区 -->

      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column width="50px" type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="[index === 0 ? '' : 'bd_top']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  plain
                  closable
                  @close="closeTag(item1, scope.row)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index) in item1.children"
                  :key="item2.id"
                  :class="[index === 0 ? '' : ' bd_top']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      plain
                      closable
                      @close="closeTag(item2, scope.row)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      plain
                      closable
                      @close="closeTag(item3, scope.row)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <!-- 编辑、删除、分配权限按钮 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="delRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="setRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框区域start -->
    <!-- 添加用户对话框 -->
    <el-dialog title="提示" :visible.sync="addRoleDialogVisible" width="50%">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName">></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="提示" :visible.sync="editRoleDialogVisible" width="50%">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName">></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色权限对话框 -->
    <el-dialog title="提示" :visible.sync="setDialogVisible" width="50%">
      <!-- 树形结构 -->
      <el-tree
        :data="setRoleTree"
        ref="setRoleTreeRef"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultKeys"
        :props="defaultProps"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    //角色列表渲染
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      editRoleForm: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      // 添加角色
      addRoleDialogVisible: false,
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
          },
        ],
      },
      // 编辑角色
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
          },
        ],
      },
      //分配角色
      setDialogVisible: false,
      setRoleTree: null,
      defaultProps: {
        children: "children",
        label: "authName",
      },
      // 默认勾选的权限
      defaultKeys: [],
      setRoleId: null,
    };
  },
  methods: {
    // 渲染列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    // 添加角色按钮功能
    addRole() {
      // 表单预校验
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);

        this.getRolesList();
        this.addRoleDialogVisible = !this.addRoleDialogVisible;
        this.$refs.addRoleFormRef.resetFields();
      });
    },
    //编辑角色按钮功能
    editRole(data) {
      this.editRoleDialogVisible = !this.editRoleDialogVisible;
      this.editRoleForm.id = data.id;
    },
    editRoleConfirm() {
      let roleId = this.editRoleForm.id - 0;
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return console.log(1);
        const { data: res } = await this.$http.put(
          `roles/${roleId}`,
          this.editRoleForm
        );
        console.log(res);
        this.$refs.editRoleFormRef.resetFields();
        this.editRoleDialogVisible = false;
        this.getRolesList();
      });
    },
    // 删除角色按钮功能
    async delRole(data) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(confirmResult);
      if (confirmResult !== "confirm") return this.$message.info("已取消");
      // 发送删除角色请求
      console.log(data);
      const { data: res } = await this.$http.delete(`roles/  ${data.id} `);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getRolesList();
      // role.children = res.data;
    },
    // 删除角色权限
    async closeTag(right, role) {
      //删除confirm对话框
      let confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(confirmResult);
      if (confirmResult !== "confirm") return this.$message.info("已取消");
      // 发送删除权限请求
      const { data: res } = await this.$http.delete(
        `roles/  ${role.id} /rights/  ${right.id}`
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      console.log(role);
      role.children = res.data;
    },
    //递归获取角色默认三级属性
    getDefaultKeys(item, arr) {
      if (!item.children) {
        return arr.push(item.id);
      }
      item.children.forEach((value) => this.getDefaultKeys(value, arr));
    },

    // 分配权限按钮功能
    async setRights(data) {
      this.setDialogVisible = true;
      const { data: res } = await this.$http.get("rights/tree ");
      // console.log(res);
      this.setRoleTree = res.data;
      // console.log(data);
      this.getDefaultKeys(data, this.defaultKeys);
      this.setRoleId = data.id;
    },
    // 确认
    setRoleConfirm() {
      // 获取选中和半选中节点的id;
      const CheckedKeys = this.$refs.setRoleTreeRef.getCheckedKeys();
      const HalfCheckedKeys = this.$refs.setRoleTreeRef.getHalfCheckedKeys();
      const keys = [...CheckedKeys, ...HalfCheckedKeys];
      const keysStr = keys.join(",");
      this.$http.post(`roles/${this.setRoleId}/rights`, { rids: keysStr });
      this.setDialogVisible = false;
      this.getRolesList();
    },
  },
};
</script>


<style lang="less" scoped>
.el-card {
  margin-top: 30px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 20px;
}
.bd_top {
  border-top: 1px solid #ddd;
}
.el-tag {
  margin: 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>