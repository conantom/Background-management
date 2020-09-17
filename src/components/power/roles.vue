<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdottom',l1===0? 'topbom':'','vcenter']"
              v-for="(item1,l1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightByid(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[l2===0 ? '':'topbom','vcenter']"
                  v-for="(item2,l2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByid(scope.row,item2.id)"
                    >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, l3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightByid(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre></pre>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="330px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="ShowrightDig(scope.row)"
              >权限分配</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="提示" :visible.sync="setRightdialogVisible" width="50%" @close="setrightclose">
      <el-tree
        :data="Rightlisttree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defuaKeys"
        ref="reftree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Btnright">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setRightdialogVisible: false,
      Rightlisttree: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defuaKeys: [],
      roleId:'',
    };
  },
  methods: {
    setrightclose(){
      this.defuaKeys=[]
    },
    getLeatKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeatKeys(item, arr);
      });
    },
    Btnright() {
      const keys=[
        ...this.$refs.reftree.getCheckedKeys(),
        ...this.$refs.reftree.getHalfCheckedKeys()
      ]
      const idstr=keys.join(',');
      console.log(idstr);
      this.$http.rights({rids:idstr},this.roleId).then(res=>{
        console.log(res.data);
        if(res.data.meta.status!==200){
          return  this.$message.error("更新权限失败")
        }
        this.$message.success("更新成功")
        this.roles()
      }).catch(err=>{
        console.log(err);
      })

      this.setRightdialogVisible = false;
    },
    ShowrightDig(role) {
      this.roleId=role.id
      this.$http
        .rightslisttree()
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取权限列表失败");
          }
          this.Rightlisttree = res.data.data;
          this.getLeatKeys(role, this.defuaKeys);
          this.$message.success("获取权限列表成功");

          this.setRightdialogVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeRightByid(roles, rightId) {
      console.log(roles);
      //  console.log(rightId);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.roleId(roles.id, rightId).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "success",
                message: "删除失败!",
              });
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            roles.children = res.data.data;
          });
        })
        .catch((err) => {
          this.$message({
            type: "success",
            message: "取消删除!",
          });
        });
    },
    async roles() {
      const { data: res } = await this.$http.roles();
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.$message({
        message: "获取角色列表成功",
        type: "success",
      });

      console.log(res.data);
      this.rolesList = res.data;
    },
  },
  created() {
    this.roles();
  },
};
</script>

<style scoped lang="scss">
.el-tag {
  margin-top: 10px;
}
.bdottom {
  border-bottom: 1px solid #eee;
}
.topbom {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 3px;
}
</style>