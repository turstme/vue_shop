<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索栏 -->
        <el-col :span="16">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="primary" @click="changeDialogVisible">
            添加用户</el-button
          >
        </el-col>
        <!-- 添加用户按钮功能 -添加用户对话框-->
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="50%"
          @close="addDialogClosed"
        >
          <!-- 对话框主体部分 -->
          <el-form
            :model="addUserForm"
            :rules="addUserRules"
            ref="addUserFormRef"
            label-width="80px"
          >
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
              <el-input v-model="addUserForm.password"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <!-- 手机 -->
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addUserForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 对话框尾部部分 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 slot-scope 获取该行传入的数据 -->
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作渲染 -->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 加上方文字提示 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <!-- 编辑按钮 -->
              <el-button
                @click="edit(scope.row)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                @click="del(scope)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配用户"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色 -->
              <el-button
                @click="setting(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出编辑用户对话框 -->
    <el-dialog title="" :visible.sync="editDialogVisible" width="50%">
      <!-- 编辑对话框主题部分 -->
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 编辑对话框尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>姓名：{{ setRoleForm.username }}</p>
        <p>角色：{{ setRoleForm.role_name }}</p>
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolelist"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };

    return {
      // 钩子函数渲染页面时发送的请求行
      queryInfo: {
        //搜索关键字
        query: "",
        // 当前显示的页数
        pagenum: 1,
        // 每页显示的条目
        pagesize: 2,
      },
      //删除时用户信息
      delUserInfo: {
        index: 0,
      },
      //用户数据
      usersList: null,
      total: 0,
      // 添加用户按钮功能 -添加用户对话框显示隐藏
      dialogVisible: false,
      //编辑用户对话框
      editDialogVisible: false,
      // 添加用户表单
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 编辑用户表单
      editUserForm: {
        id: "",
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户表单规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名在3-10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码在6-15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },

          // 自定义验证
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请入如正确的手机号码",
            trigger: "blur",
          },
          // 自定义验证
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 编辑用户表单规则
      editUserFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },

          // 自定义验证
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },

          // 自定义验证
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //分配角色对话框
      setRoleDialogVisible: false,
      //分配角色数据
      setRoleForm: {
        id: "",
        username: "",
        role_name: "",
      },
      rolelist: null,
      //已选中的下拉值
      selectedRoleId: "",
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    //解决删除边界问题
    isLastdata(index) {
      // 根据总的数据条数total和一页显示的数据条数，得到总页数
      let lastPage = Math.ceil(this.total / this.queryInfo.pagesize);
      // 判断当前页是否是最后一页,最后一条数据
      if (this.queryInfo.pagenum === lastPage && index === 0) {
        this.queryInfo.pagenum--;
      }
    },
    // 发送请求，获取用户列表
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$Message.error(res.meta.msg);
      //  获取赋值返回的用户数据
      this.usersList = res.data.users;
      //数据用户总数赋值给total
      this.total = res.data.total;
      // console.log(res);
      // console.log(this.usersList);
    },
    // 编辑按钮功能
    edit(data) {
      this.editDialogVisible = true;
      console.log(data);
      this.editUserForm.id = data.id;
      console.log(this.editUserForm.id);
      this.editUserForm.username = data.username;
      this.editUserForm.email = data.email;
      this.editUserForm.mobile = data.mobile;
    },
    // 删除按钮功能
    async del(data) {
      console.log(data.$index);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== `confirm`) {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + data.row.id);
      if (res.meta.status !== 200) return;
      this.$message.success("删除成功");
      this.isLastdata(data.$index);
      this.getUsersList();
    },
    // 分配角色按钮功能
    async setting(data) {
      this.setRoleDialogVisible = true;
      this.setRoleForm.username = data.username;
      this.setRoleForm.role_name = data.role_name;
      this.setRoleForm.id = data.id;

      //获取角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.rolelist = res.data;
      console.log(this.rolelist);
    },
    // 重分配角色按钮确认按钮功能
    async setRoleConfirm() {
      const { data: res } = await this.$http.put(
        `users/${this.setRoleForm.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.setRoleDialogVisible = false;
      this.getUsersList();
    },
    //监听最新的pagesize
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
      // console.log(newSize);
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
      // console.log(newPage);
    },
    //监听用户状态的改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
    },
    //添加用户对话框功能
    changeDialogVisible() {
      this.dialogVisible = true;
    },
    //监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
      this.dialogVisible = false;
    },

    //表单预校验,确定添加
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;

        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.addDialogClosed();
        this.getUsersList();
      });
    },
    //表单预校验,确定修改
    editUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;

        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          this.editUserForm
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.editDialogVisible = false;
        this.getUsersList();
        handleCurrentChange();
      });
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
  margin-top: 30px;
  font-size: 8px;
}
.el-pagination {
  margin-top: 20px;
}
</style>