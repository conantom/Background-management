<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getgoods"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="getgoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="100px">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-edit"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input3: "",
      goodsList: [],
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
    };
  },
  methods: {
    goAddpage(){
        this.$router.push({
          path:'/goods/add'
        })
    },
    //删除
    removeById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .removegoods(id)
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message.error("删除失败");
              }
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getgoods();
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
    // 页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getgoods();
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getgoods();
    },
    getgoods() {
      this.$http
        .getgoods(this.queryInfo)
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.warning("商品数据获取失败");
          }
          this.$message("商品数据获取成功");
          console.log(res.data.data);
          this.goodsList = res.data.data.goods;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getgoods();
  },
};
</script>

<style>
</style>