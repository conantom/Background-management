<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="230px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status"></el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogValid"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="shopBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tota"
      ></el-pagination>
    </el-card>

    <el-dialog title="修改地址" :visible.sync="addVisible" width="50%" @close="addressdialog">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="CityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="propVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in propressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import CityData from "./citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      tota: 0,
      orderlist: [],
      addVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: {
          required: true,
          message: "请输入修改的地址",
          trigger: "blur",
        },
        address2: {
          required: true,
          message: "请输入详细地址",
          trigger: "blur",
        },
      },
      CityData,
      propVisible: false,
      propressInfo: [],
    };
  },
  methods: {
    shopBox() {
      this.$http
        .kuaidi()
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("物流进度获取失败");
          }
          this.propressInfo = res.data.data;
          console.log(this.propressInfo);
        })
        .catch((err) => {
          console.log(err);
        });
      this.propVisible = true;
    },
    handleChange() {},
    addressdialog() {
      this.$refs.addressFormRef.resetFields();
    },
    dialogValid() {
      this.addVisible = true;
    },
    confirmVisible() {
      this.addVisible = false;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    getOrderList() {
      this.$http
        .orders(this.queryInfo)
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message("获取列表失败");
          }
          this.orderlist = res.data.data.goods;
          this.tota = res.data.data.total;
          // console.log(res.data.data.total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style scoped lang="scss">
.el-input {
  width: 230px;
}
.el-cascader {
  width: 100px;
}
</style>