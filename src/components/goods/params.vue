<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            v-model="selectCateKey"
            :options="CateList"
            :props="CateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="idBdtnDis"
            @click="addDidgvidel=true"
          >添加参数</el-button>

          <el-table :data="manyTabList" border stripe>
            <!-- //展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleclose(i,scope.row)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="ShowEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="DeleEditDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="idBdtnDis"
            @click="addDidgvidel=true"
          >添加属性</el-button>
          <el-table :data="onlyTabList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleclose(i,scope.row)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="ShowEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="DeleEditDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDidgvidel"
      width="50%"
      @close="addDidgClose"
    >
      <el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDidgvidel = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="EditDidgvidel"
      width="50%"
      @close="EditDidgClose"
    >
      <el-form :model="EditForm" :rules="EditFormrules" ref="EditFormref" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="EditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDidgvidel = false">取 消</el-button>
        <el-button type="primary" @click="EditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CateList: [],
      //级联配置对象
      CateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联 双向绑定数据
      selectCateKey: [],
      activeName: "many",
      //动态参数
      manyTabList: [],
      //静态参数
      onlyTabList: [],

      addDidgvidel: false,
      addForm: {},
      //添加表单验证
      addFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      EditDidgvidel: false,
      EditFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      EditForm: {},
    };
  },
  computed: {
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      }
      return "静态属性";
    },
    idBdtnDis() {
      if (this.selectCateKey.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectCateKey.length == 3) {
        return this.selectCateKey[2];
      }
      return null;
    },
  },
  methods: {
    //算出对应参数
    handleclose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    saveAttrVals(row) {
      this.$http
        .addcategories(this.cateId, row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message("添加失败");
          }

          this.$message("修改成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 展示文办框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      (row.inputValue = ""), (row.inputVisible = false);
      this.saveAttrVals(row);
    },
    DeleEditDialog(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delecategories(this.cateId, id)
            .then((res) => {
              // console.log(res.data);
              if (res.data.meta.status !== 200) {
                return this.$message("删除失败");
              }
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.cascader();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    EditParams() {
      this.$refs.EditFormref.validate((valid) => {
        if (!valid) return;

        this.$http
          .setattributes(this.cateId, this.EditForm.attr_id, {
            attr_name: this.EditForm.attr_name,
            attr_sel: this.activeName,
          })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message("更新失败");
            }
            this.$message("更新成功");
            this.cascader();
          })
          .catch((err) => {
            console.log(res);
          });
      });
      this.EditDidgvidel = false;
    },
    EditDidgClose() {
      this.$refs.EditFormref.resetFields();
    },
    ShowEditDialog(id) {
      this.$http
        .attrId(this.cateId, id, { attr_sel: this.activeName })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message("参数获取失败");
          }
          this.EditForm = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.EditDidgvidel = true;
    },
    addParams() {
      this.$refs.addFormref.validate((valid) => {
        if (!valid) return;
        this.$http
          .postattributes(this.cateId, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
          .then((res) => {
            if (res.data.meta.status !== 201) {
              return this.$message.error("添加失败");
            }
            this.$message("添加成功");
            this.cascader();
          })
          .catch((err) => {
            console.log(err);
          });
      });
      this.addDidgvidel = false;
    },
    addDidgClose() {
      this.$refs.addFormref.resetFields();
    },
    handleTabClick() {
      if (this.selectCateKey.length !== 3) {
        return this.$message.success("请先选择商品分类");
      }
      this.cascader();
    },
    //级联选中项变化
    handleChange() {
          console.log(this.selectCateKey.length);
      if (this.selectCateKey.length !== 3) {
    
       
        this.manyTabList = [];

        this.onlyTabList = [];
        this.selectCateKey = [];
         return;
      }
      this.cascader();
    },
    cascader() {
      this.$http
        .attributes(this.cateId, { sel: this.activeName })

        .then((res) => {
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            item.inputVisible = false;
            item.inputValue = "";
          });
          console.log(res.data.data);
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取失败");
          }
          if (this.activeName == "many") {
            this.manyTabList = res.data.data;
          } else {
            this.onlyTabList = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCateList() {
      this.$http
        .getcategories()
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("商品分类数据列表获取失败");
          }
          this.CateList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style scoped lang="scss">
.cat_opt {
  margin: 5px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 100px;
}
</style>