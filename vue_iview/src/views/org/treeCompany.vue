<template>
<!-- <div></div>
   <gz-tree :data="companyData" @on-select-change="event_onCompanySelectChanged"></gz-tree>   -->
   <gz-tree :treeData="companyData" :treeProps="treeProps" v-model="currentValue" @on-select="onSelect"></gz-tree>
</template>
<style lang="less" scoped>

</style>

<script>
import { ReqCommonDataCompany } from "../../libs/request";
export default {
  name:"treeCompany",
  data() {
    return {
      currentValue:'',
      companyData: [],
      treeProps: {
        label: "companyName_chs",
        children: "children",
        level: "deep",
        value: "rowID"
      }
    };
  },
  mounted() {
    debugger;
    ReqCommonDataCompany.list(this).then(
      res => {
        this.companyData = res.data;
        // debugger;
      },
      err => {
        this.data = [];
      }
    );
  },
  methods: {
     onSelect(node){
      this.$emit("on-select", node);
    }
  }
};
</script>

