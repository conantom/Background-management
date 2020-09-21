<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>

      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" :align-center="true">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTableave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="CateList"
                :props="CateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabDate" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cd" v-for="(cd,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item) in onlyTabDate" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                :headers="headersObj"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handlesuccess"
            
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce">
                  
              </quill-editor>
              <el-button type="primary" class="addbut" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    
    </el-card>


    <!-- 图片预览 -->
      <el-dialog
        title="图片预览"
        :visible.sync=" previewVisible"
        width="50%">
        <img :src="previewPath" alt="" class="dialogimg">
       
        </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      //添加商品
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品分类数组
        goods_cat: [],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ],
      },
      CateList: [],
      CateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //   动态参数
      manyTabDate: [],
      //   静态属性
      onlyTabDate: [],
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
        headersObj:{
           Authorization:window.sessionStorage.getItem("took") 
        },
        previewPath:'',
        previewVisible:false,
  };
  },
  methods: {
      add(){
        //   console.log(this.addForm);
        this.$refs.addFormRef.validate(vaild=>{
            if(!vaild){
                return this.$message.error("请填写必要的表单项")
            }
            const infos = Object.assign({},this.addForm)
            infos.goods_cat=infos.goods_cat.join(',')
            // 处理动态静态参数
            this.manyTabDate.forEach(item=>{
                const newinfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
                this.addForm.attrs.push(newinfo)
            })
            this.onlyTabDate.forEach(item=>{
                const newinfo={attr_id:item.attr_id,attr_value:item.attr_vals}
                this.addForm.attrs.push(newinfo)
            })
            infos.attrs=this.addForm.attrs
            console.log(infos);

            this.$http.goods(infos).then(res=>{
               if (res.data.meta.status !== 201) {
              return this.$message.error("添加商品失败");
            }
                his.$message("添加商品成功");
                this.$router.push('/goods')
            }).catch(err=>{
                console.log(err);
            })
        })
      },
      handlesuccess(response){
         const picInfo={pic:response.data.tmp_path}
         this.addForm.pics.push(picInfo)
         console.log(this.addForm.pics);
      },
    //   移除图片
    handleRemove(file) {
        const filePath=file.response.data.tmp_path
        const i= this.addForm.pics.findIndex(x=>
        x.pic===filePath)
        this.addForm.pics.splice(i,1)
        console.log(this.addForm.pics);
    },
    //   图片处理
    handlePreview(file) {
        console.log(file.response.data.url);
        this.previewPath=file.response.data.url
        this.previewVisible=true
    },
    tabClicked() {
      if (this.activeIndex == "1") {
        this.$http
          .getattributes(this.cateId, { sel: "many" })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("动态参数获取失败");
            }
            this.$message("动态参数获取成功");
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyTabDate = res.data.data;
            console.log(this.manyTabDate);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.activeIndex == "2") {
        this.$http
          .getattributes(this.cateId, { sel: "only" })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("静态属性获取失败");
            }
            this.$message("静态属性获取成功");
            // res.data.data.forEach((item) => {
            //   item.attr_vals =
            //     item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
            // });
            this.onlyTabDate = res.data.data;
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    beforeTableave(activeName, oldActiveName) {
      //
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择分类");
        return false;
      }
    },
    //级联选择器
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    getCateList() {
      this.$http
        .Scategories()
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.CateList = res.data.data;
          console.log(this.CateList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style scoped lang="scss">
.el-steps {
  margin-top: 10px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.dialogimg{
    width: 100%;
}
.addbut{
    margin: 10px;
}
</style>