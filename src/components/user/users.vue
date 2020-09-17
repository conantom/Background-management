<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="cle"
            v-model="input3"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="butsou"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表表格 -->
      <el-table ref="multipleTable" :data="userList" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
        <el-table-column prop="mobile" label="电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="role_name" label="角色" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mg_state" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="chan(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="buttedit(scope.row.id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="removopen(scope.row.id)"
            ></el-button>

            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="primary" icon="el-icon-setting" size="mini" @click="RightsetDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageber"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addrules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="addForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="emil">
          <el-input v-model="addForm.emil"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogkidin">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户数据 -->
    <el-dialog title="提示" :visible.sync="todialogVisible" width="50%" @close="editClose">
      <el-form :model="editFrom" :rules="editFromrules" ref="editFromRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="todialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogedit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加权限 -->
    <el-dialog title="分配角色" :visible.sync="setrightDialog" width="50%" >
     <div>
       <p>当前用户：{{userInfo.username}}</p>
       <p>当前角色：{{userInfo.role_name}}</p>
       <p>分配新角色：
           <el-select v-model="seteRight" placeholder="请选择">
            <el-option
              v-for="item in relolist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
       </p>
     </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setrightDialog = false">取 消</el-button>
        <el-button type="primary" @click="seveRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkemail = (rule, value, cb) => {
      const regemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regemail.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的邮箱格式"));
    };
    return {
      input3: "",
      userList: [],
      userList2: [],
      total: 0,
      pageber: 1,
      pagesize: 5,
      dialogVisible: false,
      todialogVisible: false,
      setrightDialog:false,
      addrules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        emil: [
          { required: true, message: "请输入邮箱号", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkemail, trigger: "blur" },
        ],
        tel: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { min: 3, max: 13, message: "不符合电话格式", trigger: "blur" },
        ],
      },
      addForm: { name: "", pass: "", emil: "", tel: "" },
      editFrom: {},
      editFromrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],

        email: [
          { required: true, message: "请输入邮箱号", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { min: 3, max: 13, message: "不符合电话格式", trigger: "blur" },
        ],
      },
      userInfo:{},
      relolist:[],
      seteRight:"",
    };
  },
  methods: {
    seveRight(){
      // console.log(this.userInfo);
      if(!this.setrightDialog){
        return this.$message.error("请选择一个新角色")
      }
      this.$http.tousers(this.userInfo.id,{rid:this.seteRight}).then(res=>{
        if(res.data.meta.status!==200){
          return this.$message.success("设置失败")
        }
        this.$message.success("设置成功")
        this.save()

      }).catch(err=>{
        console.log(err);
      })
      this.setrightDialog=false
    },
    RightsetDialog(userInfo){
      this.userInfo=userInfo
      this.$http.toroles().then(res=>{
          if(res.data.meta.status!==200){
            return this.$message.error("获取错误");
          }
          this.relolist=res.data.data
      }).catch(err=>{
        console.log(err);
      })
      this.setrightDialog=true
    },
    removopen(id) {
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.removeuse(id).then((res) => {
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.save();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    buttedit(id) {
      this.$http
        .usert(id)
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message("查询失败");
          }
          console.log(res.data.data);
          this.editFrom = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.todialogVisible = true;
    },
    dialogedit() {
      this.$refs.editFromRef.validate((valid) => {
        if (!valid) return;
        this.$http
          .putuse(this.editFrom)
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message("更新失败");
            }
            this.save();
            this.$message("更新信息成功");
          })
          .catch((err) => {
            console.log(err);
          });
      });

      this.todialogVisible = false;
    },
    dialogkidin() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.$http
          .use({
            username: this.addForm.name,
            password: this.addForm.pass,
            email: this.addForm.emil,
            mobile: this.addForm.tel,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.meta.status !== 201) {
              this.$message("用户创建失败");
            }
            this.$message("用户创建成功");

            this.dialogVisible = false;
            this.save();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    addDialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    editClose() {
      this.$refs.editFromRef.resetFields();
    },
    cle() {
      this.userList = [];
      this.userList = this.userList2;
    },
    butsou() {
      this.userList.map((item) => {
        console.log(item);
        if (this.input3 == item.username) {
          this.userList2 = [...this.userList];
          this.userList = [];
          this.userList.push(item);
        }
      });
    },
    chan(info) {
      console.log(info);
      this.$http
        .state(info)
        .then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message("设置失败");
            info.mg_state = !info.mg_state;
          } else {
            this.$message("设置成功");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSizeChange(newsize) {
      this.pagesize = newsize;
      this.save();
    },
    handleCurrentChange(newpage) {
      this.pageber = newpage;

      this.save();
    },
    save() {
      this.$http
        .users({
          pagenum: this.pageber,
          pagesize: this.pagesize,
        })
        .then((res) => {
          // console.log(res.data.data);
          if (res.data.meta.status !== 200)
            return this.$message("获取数据失败");

          this.userList = res.data.data.users;

          this.total = res.data.data.total;
          // console.log( res.data.data.total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.save();
  },
};
</script>

<style>
</style>