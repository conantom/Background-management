<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="ShowBtnaddcate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="carelist"
        class="treeTable"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        show-index
        border
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <template slot="opt" scope-row="scope">
          <el-button class="el-icon-edit" type="primary" size="mini">编辑</el-button>
          <el-button class="el-icon-delete" type="danger" size="mini">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addcateVisible" width="50%" @close="dialogClose">
      <el-form ref="addCateRef" :model="addCateform" label-width="100px" :rules="addCateRules">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
          <el-cascader
          expand-trigger="hover"
            v-model="selectadOpen"
            :options="categoList"
            :props="categoProps"
            @change="parentChange"
            :clearable="true"
            :change-on-select="true"

          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcateVisible = false">取 消</el-button>
        <el-button type="primary" @click="Btnaddcate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carelist: [],
      //控制添加对话框显示隐藏
      addcateVisible: false,
      querInfo: {
        caretype: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        ,
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],

      addCateform: {
        // 添加分类名称
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      //添加分类格式
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      categoList: [],
      //级联配置对象
      categoProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectadOpen: [],
    };
  },
  methods: {
    dialogClose(){
      this.$refs.addCateRef.resetFields();
       this.selectadOpen=[]
      this.addCateform.cat_pid=0
      this.addCateform.cat_level=0
    },
    //选这项发生变化
    parentChange(){
      console.log(this.selectadOpen);
      if(this.selectadOpen.length>0){
        this.addCateform.cat_pid=this.selectadOpen[this.selectadOpen.length-1]
        this.addCateform.cat_level=this.selectadOpen.length;
        return
      }else{
        this.addCateform.cat_pid=0
        this.addCateform.cat_level=0
      }
    },
    //点击显示对话框
    ShowBtnaddcate() {
      this.categories();
      this.addcateVisible = true;
    },
    categories() {
      this.$http
        .categories({ type: 2 })
        .then((res) => {
          console.log(res.data);
          if (res.data.meta.status!== 200) {
            return this.$message.error("获取分类失败");
          }
          this.categoList = res.data.data;
          console.log(this.categoList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //添加分类商品
    Btnaddcate() {
      console.log(this.addCateform);
      this.$refs.addCateRef.validate(valid=>{
        if(!valid) return
      this.$http.setcategories(this.addCateform).then(res=>{
        if(res.data.meta.status!==201){
          return this.$message.success("创建失败")
        }
        this.$message.success("创建成功")
        this.saveCare();
      }).catch(err=>{
        console.log(err);
      })
      })
      this.addcateVisible=false
    },
    handleSizeChange(newsize) {
      this.querInfo.pagesize = newsize;
      this.saveCare();
    },
    handleCurrentChange(newpage) {
      this.querInfo.pagenum = newpage;
      this.saveCare();
    },
    saveCare() {
      this.$http
        .cateList({
          type: this.querInfo.caretype,
          pagenum: this.querInfo.pagenum,
          pagesize: this.querInfo.pagesize,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.warning("获取商品列表失败");
          }
          this.carelist = res.data.data.result;
          // console.log(res.data.data);
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.saveCare();
  },
};
</script>

<style scoped lang="scss">
.treeTable {
  margin-top: 5px;
}
.el-cascader{
  width: 100%;
}
</style>