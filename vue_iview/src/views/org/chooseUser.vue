<template>
  <Modal class-name="vertical-center-modal dialog-modal user" :ref="refNames_modal" title="添加成员" v-model="modalStatus" width=80
    :styles="{'max-width':'800px'}" :mask-closable="false" :loading="(true)" @on-ok="event_submit" @on-cancel="event_cancel">
    
    <div class="nav border" >
      <gz-panel :topHeight="40" :autoHeight="false">
      <div slot="top" >
        <SelectCompany @onSelected="onCompanySelected" v-model="companyID" :width="200"></SelectCompany>
      </div>
      <div slot="main">
        <treeDept :companyID="companyID"  @on-select="onDeptSelected"></treeDept>
      </div>
      </gz-panel>
    </div>
    <div class="main">

    <gz-panel :topHeight="40" :autoHeight="false">
      <div slot="top" style="height:100%;">
        <Button class="cache" @click="showCache=true">已选人员</Button>
        <div class="search">
          <i-input  v-model="query">
              <Button  slot="append" @click="doSearch" icon="ios-search" />
          </i-input>
        </div>
      </div>
      <div slot="main">
        <div>
          <Card class="userCard" @click.native="onUserSelect(item)"  v-for="item in filterUserList" :key="item.userID" :class="{'active':item.isSelect}">
            <div class="userImg">
            <img src="../../assets/UserCard01.png">
            </div>
            <div class="userContent">
            <div>账户：{{item.account}}</div>
            <div>姓名：{{item.userName}}</div>
            <div>部门：{{item.deptName}}</div>
            </div>
          </Card>
        </div>

      </div>
      </gz-panel>

      <div class="userCache" v-show="showCache">
        <div>
          <div class="title">已选人员
              <span class="close" title="关闭">
                <Icon type="close"  @click.native="showCache=false"></Icon>
              </span>
          </div>
        </div>
        <div>
          <div class="selectItem"  v-for="item in selectUserList" :key="item.userID">
            <p>{{item.companyName}}</p>
            <p>{{item.deptName}} 【{{item.userName}}】</p>
            <span class="userReomve" title="移除选中人员" @click.native="onUserSelect(item)">
              <Icon type="close"  @click.native="onUserSelect(item)"></Icon>
            </span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<style lang="less">
.user {
  .ivu-modal-body {
    padding: 0px;
  }
}
.userCard {
  .ivu-card-body {
    padding: 3px;
  }
}
</style>
<style lang="less" scoped>
.selectItem {
  position: relative;
  /* width: 160px; */
  height: 44px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: auto;
  margin: 10px;
  padding: 5px 0 0 10px;
  .userReomve {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 12px;
    height: 13px;
    display: block;
    // background: url(../../assets/tab_close.png) no-repeat;
    cursor: pointer;
    &:hover {
      background-position: 0 -12px;
    }
    .close {
      color: #999;
      float: right;
      cursor: pointer;
      &:hover {
        color: black;
      }
    }
  }
}
.userCache {
  width: 220px;
  float: right;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 99999;
  background-color: white;
  border: 1px solid #e9eaec !important;

  .title {
    height: 32px;
    border: 1px solid #e9eaec;
    font-size: 1.2px;
    padding: 5px 10px 5px 10px;
    .close {
      color: #999;
      float: right;
      cursor: pointer;
      &:hover {
        color: black;
      }
    }
  }
}
.userCard {
  width: 190px;
  margin: 5px;
  height: 60px;
  float: left;
  // background-position: right top;
  //   -moz-user-select: none;
  // -webkit-user-select: none;
  // -ms-user-select: none;
  // -khtml-user-select: none;
  user-select: none;
  .ivu-card-body {
    padding: 3px;
    .userImg {
      float: left;
      width: 45px;
    }
    .userContent {
      float: left;
      font-size: 0.5em;
    }
  }
  &.active {
    border: 2px solid #ff5d5b;
    padding: 0 0px;
    background: url(../../assets/duihao_03.png) right top no-repeat;
  }
}

.cache {
  float: right;
}
.search {
  overflow: hidden;
  height: 100%;
}

.nav,
.main {
  height: 100%;
}

.nav {
  width: 200px;
  float: left;
  position: relative;
}

.main {
  overflow: hidden; // background-color: green;
  position: relative;
}
.tools {
  padding-top: 3px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 3px;
  height: 40px;
}
</style>

<script>
import Msg from "../../mixins/msg";
import SelectCompany from "./selectCompany";
import treeDept from "./treeDept";
import { ReqCommonDataCompany, requestUserRelation } from "../../libs/request";
export default {
  name: "ChooseUser",
  mixins: [Msg],
  components: {
    SelectCompany,
    treeDept
  },
  data() {
    return {
      showCache: false,
      objectID: "",
      type: 0,
      companyID: "",
      deptID: "",
      query: "",
      queryStr: "",
      queryType: 0,
      refNames_modal: "refNames_modal",
      modalStatus: false,
      userList: []
    };
  },

  props: {},
  mounted() {
    this.refreshData();
  },
  computed: {
    filterUserList: function() {
      var _this = this;
      if (this.$utils.isNULL(this.queryStr))
        if (this.queryType === 0)
          return this.userList.filter(function(item) {
            return false;
          });
        else return this.userList;

      if (this.queryType === 1) {
        return this.userList.filter(function(item) {
          return item.deptID === _this.queryStr;
        });
      }
      if (this.queryType === 2) {
        return this.userList.filter(function(item) {
          return (
            item.account.indexOf(_this.queryStr) > -1 ||
            item.userName.indexOf(_this.queryStr) > -1
          );
        });
      }
      if (this.queryType === 3) {
        return this.userList.filter(function(item) {
          return item.companyID === _this.queryStr;
        });
      }
    },
    selectUserList: function() {
      return this.userList.filter(function(item) {
        return item.isSelect;
      });
    }
  },

  methods: {
    doSearch() {
      // debugger;
      this.queryType = 2;
      // console.log("this.queryType = 2;");
      this.queryStr = this.query;
    },
    refreshData() {},

    onCompanySelected(value, e) {
      this.queryType = 3;
      // console.log("this.queryType = 3;");
      this.queryStr = value;
    },
    onDeptSelected(node) {
      // console.log("this.queryType = 1;");
      this.queryType = 1;
      this.queryStr = node.rowID;
    },
    onUserSelect(item) {
      item.isSelect = !item.isSelect;
    },

    show(objectID, category) {
      this.objectID = objectID;
      this.category = category;
      this.modalStatus = true;

      requestUserRelation
        .list(this, this.objectID)
        .then(res => {
          this.userList = res.data;
        })
        .catch(err => {});
    },
    hide(){
this.modalStatus = false;
this.userList=[];
    },
    updateData(_category, _objectID) {},
    event_submit() {
      requestUserRelation
        .update(this, this.objectID, this.category, this.selectUserList)
        .then(res => {
          this.hide();
        }).catch(err=>{
          this.$refs[this.refNames_modal].buttonLoading = false;
        });
    },
    event_cancel() {
      this.hide();
    }
  },

  watch: {}
};
</script>
