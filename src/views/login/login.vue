<template>
  <div class="box">
    <div class="box-img">
      <img src="../../assets/img/vvv.png" alt />
    </div>
    <div class="inp">
      <div class="inps">
       
        <el-form
          :model="ruleForm"
          
          :rules="rules"
          ref="ruleForm"
          label-width="50px"
          class="demo-ruleForm"
        >
        <div class="inp-1">
        <el-form-item prop="text">
            <el-input v-model="ruleForm.text" placeholder="请输入用户名" ></el-input>
          </el-form-item>
        </div>
         <div class="inp-2">
         <el-form-item  prop="pass">
                <el-input type="password" v-model="ruleForm.pass" placeholder="请输入密码"></el-input>
          </el-form-item>
        </div>
         
         
        </el-form>
        <div class="but">
          <el-row>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="Chong">重置</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        text:"",
        pass:"",
        
      },
      rules: {
        text: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        pass:[
             { required: true, message: "请输入密码", trigger: "blur" },
             { min: 3, max: 13, message: "长度在 3 到 13 个字符", trigger: "blur" },
        ]
      },
    };
  },
  methods: {
   
   
    Chong() {
      this.$refs.ruleForm.resetFields();
    },
    login(){
      this.$refs.ruleForm.validate(async valid=>{
        if(!valid)return;
        const {data:res}=await this.$http.login({username:this.ruleForm.text,password:this.ruleForm.pass})
        if(res.meta.status!==200)return  this.$message('登录失败');
         this.$message('登录成功');
         console.log(res.data.token);
         
        window.sessionStorage.setItem("took",res.data.token)
         this.$router.push({path:'/home'}) 
         
      })
    }
  },
};
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: #2b4b6b;
  .box-img {
    position: absolute;

    box-sizing: border-box;
    // padding: 10px;
    border-radius: 50%;
    overflow: hidden;
    top: 16%;
    left: 43%;
    z-index: 999;
    border: 10px solid rgb(247, 244, 244);
    width: 100px;
    height: 100px;
    box-shadow: 0 0 5px #ddd;
    img {
      width: 100%;
      height: 100%;
      background: rgb(167, 166, 166);
    }
  }
  .inp {
    width: 300px;
    height: 240px;
    background: white;
    position: relative;
    top: 30%;
    left: 30%;
    .inps {
      width: 100%;
      height: 50%;

      line-height: 30px;
      position: absolute;
      bottom: 0px;
      .but {
        width: 80%;
        height: 40px;
        margin: 0 auto;

        text-align: right;
      }
      .inp-1 {
        width: 80%;
        margin: 0 auto;
      }
      .inp-2 {
        width: 80%;
        margin: 0 auto;
      }
    }
  }
}
</style>