<template>
<div class="content">
  <div class="company borderPanel">
    <gz-panel>
      <div slot="top" class="title">
        公司信息
      </div>
      <div slot="main" class="main">
        <!-- <Tree :data="companyData" @on-select-change="event_onCompanySelectChanged"></Tree>  -->
        <treeCompany @on-select="event_onCompanySelectChanged"></treeCompany>
      </div>
    </gz-panel>
  </div>
  <div class="dept borderPanel">
     <gz-panel>
      <div slot="top" class="title">
        {{currentCompanyName}} - 岗位信息
      </div>
      <div slot="main" class="main">
        <position :companyID="currentCompanyID"></position>
      </div>
    </gz-panel>
  </div>
</div>
</template>
<style lang="less" scoped>
.company {
  width: 190px;
  float: left;
  margin-right: 10px;
}
.dept {
  overflow: hidden;
}

.company,
.dept {
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;
  .title {
    height: 32px;
    line-height: 32px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    color: #666;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    padding-left: 9px;
    font-size: 12px;
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    -khtml-user-select: text;
    user-select: text;
  }
  .main {
    padding-left: 5px;
    padding-right: 5px;
  }
}

.borderPanel {
  border: 1px solid #e9eaec !important;
}
.content {
  background: #f5f7f9;
}
</style>
<script>

import position from "./position";
import treeCompany from './treeCompany'


export default {
  data() {
    return {
      currentCompanyID: "",
      currentCompanyName: "",
      companyData: []
    };
  },
  components: {
    position,treeCompany
  },
  created() {
    // debugger;
    // ReqCommonDataCompany.treeData(this).then(res => {
    //   this.companyData = res.data;
    // });
  },
  methods: {
    event_onCompanySelectChanged(node) {
      if(node){
       this.currentCompanyName = node.companyName_chs;
        this.currentCompanyID = node.rowID;
}else
{
  this.currentCompanyName = '';
        this.currentCompanyID = '';
}
      // debugger
      // if (node.length > 0) {
      //   // debugger
      //   this.currentCompanyName = node.companyName_chs;
      //   this.currentCompanyID = node.rowID;
      // } else {
      //   this.currentCompanyName = "";
      //   this.currentCompanyID = "";
      // }
    }
  }
};
</script>


