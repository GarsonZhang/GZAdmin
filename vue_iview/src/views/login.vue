<template>
<div>
  <div style="text-align: center;padding-top: 20px;">
  <p>登陆密码：123456，管理员用户名：admin/administrator，此两个管理员不允许更改，作用不同</p>
  <p>github开源地址(前台)：https://github.com/GarsonZhang/GZAdmin</p>
   <p>github开源地址(API)：https://github.com/GarsonZhang/GZAdmin_API</p>

</div>
    <Card class="a">   
        <p slot="title">系统登录</p>
           <p slot="title">QQ：382237285联系作者</p>
        <Form ref="formInline" :model="data" :rules="ruleInline">
            <FormItem prop="user">
                <i-input type='text' v-model='data.user' placeholder='Username'>
                  <Icon type='ios-person-outline' slot='prepend'></Icon>
                </i-input>
            </FormItem>
            <FormItem prop="password">
                <i-input type="password" v-model="data.password" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>
            <FormItem>
                <GzButton type="primary" @click="handleSubmit" :text="$t('login')" loadingText="登录中"></GzButton>
                <Button type="ghost" @click="handleReset('formInline')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </Card>
    </div>
</template>
<style scoped>
html,
body {
  height: 100%;
}

.divContent {
  height: 100%;
}

.a {
  /* width: 320px;
    height: 230px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0; */
  width: 320px;
  height: 230px;
  margin: auto;
  margin-top: 10%;
}
</style>

<script>
import GzButton from "../components/iview/button";
import { requestUser } from "../libs/request";
// import GZStorage from "../libs/GZStorage"

export default {
  data() {
    return {
      data: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [{ required: true, message: "请填写用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          { type: "string", min: 6, message: "密码长度不能小于6位", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    GzButton
  },
  methods: {
    handleSubmit(button) {
      // debugger
      localStorage.setItem("isLogin", false);
      var _this=this;
      this.$refs["formInline"].validate(valid => {
        if (valid) {
          // this.$Message.success('提交成功!');
          //http://www.cnblogs.com/wisewrong/p/6277262.html
          /*
                    //  字符串
                        this.$router.push('/home/first')
                        // 对象
                        this.$router.push({ path: '/home/first' })
                        // 命名的路由
                        this.$router.push({ name: 'home', params: { userId: wise }})
                    */
          requestUser
            .login(_this,_this.data.user, _this.data.password)
            .then(res => {
                // debugger
              if (res.data.Status != 0) {
                _this.$Message.error("用户状态异常，限制登录!");
                button.loading = false;
                return;
              }
              // debugger
              this.$store.dataCache.setToken(res.data.Token);
              this.$store.dataCache.setSecretKey(res.data.rid,res.data.TokenSecret);
              this.$store.dataCache.setAccount(res.data.Account);
              this.$store.dataCache.setUserName(res.data.UserName);
              this.$store.dataCache.setLogin(true);
              _this.$parent.getMenus();
              _this.$router.push({ name: "home" });
            })
            .catch(err => {
              button.loading = false;
            });
        } else {
          _this.$Message.error("表单验证失败!");
          button.loading = false;
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
