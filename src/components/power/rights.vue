<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightList" border style="width: 100%" stripe>
        <el-table-column type="index"  label="#" ></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.level=='0'">一级</el-tag>
            <el-tag v-if="scope.row.level=='1'" type="success">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level=='2'">三级</el-tag>

        </template>
      </el-table-column>
      </el-table>
      
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: [],
    };
  },
  methods: {
    async rightslist() {
      const { data: res } = await this.$http.rightslist();
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightList = res.data;
    },
  },
  created() {
    this.rightslist();
  },
};
</script>

<style >
</style>