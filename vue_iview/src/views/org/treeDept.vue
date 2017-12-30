<template>
    <!-- <gz-tree-grid :ref="refName_dataList" :columns="columns" :data="data" :nodeKey='dataKey' :childrenKey="dataChildrenKey" :showRowNum="true"></gz-tree-grid> -->
    <gz-tree :isLoading="isLoading" :treeData="data" :treeProps="treeProps" v-model="currentValue" @on-select="onSelect"></gz-tree>
</template>
<style lang="less" scoped>

</style>
<script>
import { requestCommonDataDept } from "../../libs/request";
export default {
  name: "treeDept",
  data() {
    return {
      isLoading:false,
      currentValue: "",
      data: [],
      treeProps: {
        label: "deptName",
        children: "children",
        level: "deep",
        value: "rowID"
      }
    };
  },
  props: {
    companyID: "",
  },
  watch: {
    companyID(val) {
      this.isLoading=true;
      this.refreshData(val);
    }
  },
  methods: {
    refreshData() {
      this.currentValue="";
      if (this.$utils.isNULL(this.companyID)) {
        this.isLoading=false;
        this.data = [];
        return;
      }
      requestCommonDataDept.list(this, this.companyID).then(
        res => {
          this.isLoading=false;
          this.data = res.data;
        },
        err => {
          this.isLoading=false;
          this.data = [];
        }
      );
    },
    onSelect(node) {
      // debugger
      this.$emit("on-select", node);
    }
  }
};
</script>

