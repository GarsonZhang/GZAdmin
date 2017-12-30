<template>
  <div class="divContent">
    <router-view>
    </router-view>
  </div>
</template>
<style lang="less">
  @import "./main.less";
</style>

<script>
  import {
    system
  } from "./libs/request";

  export default {
    data() {
      return {
        dataMenus: []
      };
    },
    created() {
      // debugger
      //判断是否登录，如果登录就获取，如果没登录，则在登录后获取
      // debugger
      if (window.location.pathname != "/login") {
        if (localStorage.getItem("isLogin") == "true") {
          //判断登陆是否过期,
          this.getMenus();
          // var serverTime = localStorage.getItem("item");
          // var current = Math.round(new Date().getTime() / 1000);
          // var guoqi = current > serverTime;
          // if (guoqi) {
          //   localStorage.setItem("isLogin", false);
          //   this.$router.push({ name: "login" });
          // } else this.getMenus();
        } else {
          this.$router.push({
            name: "login"
          });
        }
      }
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      getMenus() {
        system.getMenu(this).then(res => {
          this.dataMenus = res.data;
          // this.
          // debugger

          var customer_router = this.$utils.convertRouteMap(res.data);
          var v = {
            children: customer_router
          };
          this.$router.options.routes.push(v);
          this.$router.addRoutes(customer_router);

          var dict = [];
          res.data.forEach(element => {
            this.getAuthorize(dict, element);
          });
          this.$store.authorizeDataCache = dict;
        });
      },

      getAuthorize(dict, menu) {
        if (menu.type === 2) {
          dict[menu.name] = menu.authorize;
        } else {
          if (menu.items) {
            menu.items.forEach(element => {
              this.getAuthorize(dict, element);
            });
          }
        }
      },

      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate =
          date.getFullYear() +
          seperator1 +
          month +
          seperator1 +
          strDate +
          " " +
          date.getHours() +
          seperator2 +
          date.getMinutes() +
          seperator2 +
          date.getSeconds();
        return currentdate;
      }
    }
  };
</script>