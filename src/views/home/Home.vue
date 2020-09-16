<template>
  <div>
    <el-container>
      <el-header>
        <div class="heade-title">
          <img src="../../assets/img/heima.png" alt />
          <div class="header-text">电商后台管理系统</div>
        </div>
        <el-button type="info" @click="addout">退出登录</el-button>
      </el-header>
      <el-container>
        <el-aside :width="toggle ? '64px':'200px'">
          <div class="container-top" @click="toggleComp">|||</div>
          <el-menu
          :default-active="avtive"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="toggle"	
            :collapse-transition="false"
            router
          >
            
            <el-submenu v-for="item in leftList" :key="item.id" :index="item.id+''">
              <template slot="title">
                <i :class="ioclist[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="subitem in item.children"
                  :key="subitem.id"
                  :index="'/'+subitem.path"
                  @click="group('/'+subitem.path)"
                >
                  <i class="el-icon-menu"></i>
                  {{subitem.authName}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggle:false,
      leftList: [],
      ioclist: {
        125: "el-icon-s-custom",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-platform",
      },
      avtive:""
    };
  },
  methods: {
    group(avtive){
      
      window.sessionStorage.setItem("active",avtive)
      this.avtive=avtive
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toggleComp(){
      this.toggle=!this.toggle
    },
    addout() {
      window.sessionStorage.clear();
      this.$router.push({ path: "/login" });
    },
    leftListtext() {
      this.$http
        .menus()
        .then((res) => {
          // console.log(res.data.data);
          this.leftList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.leftListtext();
    this.avtive=window.sessionStorage.getItem("active")
  },
};
</script>

<style scoped lang="scss">
.is-vertical {
  height: 100%;
}
.container-top {
  width: 100%;
  color: white;
  height: 15px;
  text-align: center;
  letter-spacing:2px;
  background: #4a5064;
  cursor: pointer;
}
.el-header {
  width: 100%;
  background: #373d41;
  display: flex;
  justify-content: space-between;
  .el-button {
    height: 80%;
    margin-top: 5px;
  }
  .heade-title {
    width: 200px;
    height: 100%;
    // background: white;
    display: flex;
    .header-text {
      width: 80%;
      height: 100%;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      color: white;
    }
    img {
      width: 20%;
      height: 100%;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #eaedf1;
}
</style>
