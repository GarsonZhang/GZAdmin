<template>
  <div class="layout fullH">
    <div class="left" v-bind:class="classLeft">
      <div class="divFlag">
        <gz-menu active-name="1-2" theme="dark" class="menu" accordion :width="menuWidth" :open-names="['1']" v-on:mouseenter="showMenu()"
          v-on:mouseleave="hideMenu()" @on-select="routeTo">
          <div class="menuHeader">
            <div class="menuHeaderContent" @click="toggleClick"></div>
          </div>
          <div v-show="isMinMenu" :class="{'menu-hide-text': true}">
            <div v-for="item in $parent.dataMenus" :key="item.name">
              <MenuItem :name="item.name">
              <Icon :type="item.icon" :size="iconSize"></Icon>
              <span class="layout-text">{{getLang(item)}}</span>
              </MenuItem>
            </div>
          </div>
          <div v-show="isMinMenu===false">
            <div v-for="item in $parent.dataMenus" :key="item.name">
              <Submenu :name="item.name">
                <template slot="title">
                  <Icon :type="item.icon"></Icon>
                  <span>{{getLang(item)}}</span>
                </template>
                <div v-for="c in item.items" :key="c.name">
                  <MenuItem :name="c.name">
                  <Icon :type="c.icon"></Icon>
                  <span>{{getLang(c)}}</span>
                  </MenuItem>
                </div>
              </Submenu>
            </div>
          </div>

        </gz-menu>
      </div>
    </div>
    <div class="main">
      <div class="layout-header ">
        <Button type="text" @click="toggleClick">
          <Icon type="navicon" size="32"></Icon>
        </Button>
        <div class="layout-breadcrumb">
          <Breadcrumb>
            <BreadcrumbItem v-for="item in dataBreadcrumb" :key="item">{{item}}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="header-avator-con">
          <span class="item" >
             <Row type="flex" justify="end" align="middle" >
              <Dropdown transfer trigger="click" @on-click="handleClickLangDropdown">
                <a href="javascript:void(0)">
                  <span>{{langText}}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="item in langOptions" :key="item.value" :name="item.value" :selected="lang===item.value">{{item.text}}</DropdownItem>
                  <!-- <DropdownItem name="en-US" :selected="lang==='en-US'" divided>英文</DropdownItem> -->
                </DropdownMenu>
              </Dropdown>
            </Row>
          </span>
          <span class="item end">
            <Row type="flex" justify="end" align="middle" >
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span>{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">个人中心</DropdownItem>
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
          </span>
        </div>
      </div>


      <tags-page-opened></tags-page-opened>


      <div class="layout-content">

        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
      <div class="layout-copy ">
        2017-2027 &copy; GarsonZhang   QQ：382237285
      </div>

    </div>
  </div>
</template>
<style>
.content {
  position: relative;
}

.fill-height,
.fill-height.ivu-row {
  height: 100%;
}

.fill-width {
  width: 100%;
}

.fill-all {
  height: 100%;
  width: 100%;
}
</style>
<style  lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
}

.left {
  float: left;
  height: 100%;
  overflow: hidden;
}

.left {
  transition: width 0.2s ease-in-out;
}

.leftNormal {
  width: 250px;
}

.leftFull {
  width: 50px;
}

.main {
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #f5f7f9;
}

.main {
  transition: width 0.2s;
}

.divFlag {
  width: 100%;
  height: 100%;
}

.menuHeader {
  width: 100%;
  height: 60px;
  padding-top: 15px;
}

.menuHeader .menuHeaderContent {
  width: 90%;
  background: #5b6270;
  margin-left: auto;
  border-radius: 3px;
  height: 30px;
  margin-right: auto;
}

.menu {
  height: 100%;
}

.menu-hide-text .layout-text {
  display: none;
}

.menu-hide-text li {
  padding-left: 15px;
  padding-right: auto;
}

.layout-header {
  // height: 60px;
  width: 100%;
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); */
  box-shadow: 0 2px 1px 1px hsla(0, 0%, 39%, 0.1);
  background-color: white;
  line-height: 30px;
  //   .ivu-breadcrumb {
  //   padding: 8px 15px 0;
  // }
  .layout-breadcrumb {
    /* padding: 10px; */
    top: 0px;
    position: absolute;
    left: 60px;
    right: 340px;
    padding: 8px 15px 0;
  }

  .header-avator-con {
    float: right;
    padding: 8px 15px 0;
    .item {
      display: inline-block;
      margin-left: 5px;
      margin-right: 5px;
      &.end {
        margin-right: 30px;
      }
    }
  }
}

.layout-content {
  min-height: 200px;
  overflow: hidden;
  border-radius: 4px;
  width: 100%;
  top: 92px;
  bottom: 48px;
  position: absolute;
  left: 0;
  right: 0;
  padding-left: 10px;
}

.content {
  background: #fff;
  width: 100%;
  height: 100%;
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
  height: 48px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>

<script>
import { tagsPageOpened } from "../components/customer";

import { requestUser } from "../libs/request";
import Vue from "vue";
// import GZStorage from "../libs/GZStorage";

export default {
  components: {
    tagsPageOpened
  },
  data() {
    return {
      langOptions: [
        {
          value: "zh-CN",
          text: "中文简体"
        },
        {
          value: "zh-TW",
          text: "中文繁體"
        },
        {
          value: "en-US",
          text: "english"
        }
      ],
      bkStatus: false,
      isMinMenu: false,
      dataBreadcrumb: [],
      pageTagsList: []
    };
  },
  created() {
    //debugger;f
    //this.$route.path
    // console.log("app.vue   created");

    if (this.$route.path.length > 1) {
      // console.log("index.vue  created");
      var item = this.$utils.jsonSearch.search(
        this.$parent.dataMenus,
        "items",
        parm => parm.routeName === this.$route.path
      );
      if (item) this.setBreadcrumb(item);
    }
  },
  computed: {
    lang() {
      return Vue.config.lang;
    },
    langText() {
      var v = this.$utils.jsonSearch.search(
        this.langOptions,
        null,
        p => p.value === this.lang
      );
      if (v) {
        return v.text;
      } else return "选择语言";
    },
    userName() {
      // debugger
      return this.$store.dataCache.getUserName();
    },
    cachePage() {
      // console.log("判断是否需要keep-alive");
      //console.dir(this.$store.state.cachePage);
      return this.$store.state.cachePage;
    },
    menuWidth() {
      return this.isMinMenu ? "100%" : "250px";
      //return '100%';
    },
    iconSize() {
      return this.isMinMenu ? 24 : 14;
    },
    classLeft() {
      if (this.isMinMenu === true)
        return {
          leftFull: true
        };
      else
        return {
          leftNormal: true
        };
    }
  },
  methods: {
    getLang(item){
      // debugger
      var text='';
      switch(this.$lang){
        case 'zh-CN':
        text= item.text;
        break;
        case 'zh-TW':text= item.text_tw;
        break
        case 'en-US':text= item.text_en;
        break;
        default: text= item.text_other;break;
      }
      if(this.$utils.isNULL(text))
        text=item.text;
        return text;
    },
    handleClickLangDropdown(name) {
      // debugger;
      window.localStorage.lang=name;
      Vue.config.lang = name;
    },
    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        util.openNewPage(this, "ownspace_index");
        this.$router.push({
          name: "ownspace_index"
        });
      } else if (name === "loginout") {
        // 退出登录
        this.$store.dataCache.clear();
        requestUser.logout(this);
        this.$router.push({
          name: "login"
        });
      }
    },
    showMenu() {
      this.bkStatus = this.isMinMenu;
      this.isMinMenu = false;
    },
    hideMenu() {
      if (this.bkStatus == true) {
        this.isMinMenu = true;
      }
    },
    toggleClick() {
      if (this.bkStatus === true) {
        this.isMinMenu = false;
        this.bkStatus = false;
      } else {
        this.isMinMenu = this.isMinMenu === false;
      }
    },
    handleStart() {
      this.$Modal.info({
        title: "Bravo",
        content: "Now, enjoy the convenience of iView."
      });
    },
    routeTo(e) {
      // console.log("routeTo");
      // console.dir(e);
      var item = this.$utils.jsonSearch.search(
        this.$parent.dataMenus,
        "items",
        parm => parm.name === e
      );
      // console.log("this.$router.push({ name: " + item.name + " });");
      this.setBreadcrumb(item);

      this.$router.push({
        name: item.name
      });
      // console.log("route结束:");
    },
    setBreadcrumb(item) {
      this.dataBreadcrumb = [];
      var v = item;
      this.dataBreadcrumb.splice(0, 0, v.text);
      var num = 0;
      while (v.parentNode) {
        console.log(num++);
        if (num > 40) debugger; //这里或许就死循环了
        this.dataBreadcrumb.splice(0, 0, v.parentNode.text);
        v = v.parentNode;
      }
    }
  }
};
</script>