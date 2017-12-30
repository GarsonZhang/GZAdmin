<template>
  <!-- <Cascader ref="control" :data="data" @on-change="selected" v-model="currentValue"  change-on-select></Cascader> -->
   <gz-tree-select clearable  :treeData="data" :treeProps="dataProps" @on-select="selected" v-model="currentValue" :dropDownMaxHeight="500" placeholder="请选择部门"
    :width="width">
  </gz-tree-select>
</template>
<style lang="less" scoped>

</style>
<script>
import { requestCommonDataDept } from "../../libs/request";
export default {
  name: "SelectDept",
  data() {
    return {
      data: [],
      dataProps: {
        label: "label",
        children: "children",
        level: "deep",
        value: "value"
      },
      currentValue: ""
    };
  },
  props: {
    value: String,
    companyID: String,
     width: 0
  },
  created() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      if (this.$utils.isNULL(this.companyID)) {
        this.data = [];
        return;
      }
      var me = this;
      requestCommonDataDept.list(this, this.companyID).then(
        res => {
          me.data = this.convert2Data(1, res.data);
          //me.$refs.control.updateSelected(true);
          // debugger;
          // setTimeout(() => {
          //   me.currentValue = me.currentValue;
          //   me.$refs.control.updateSelected(true);
          // }, 50);
        },
        err => {
          me.data = [];
        }
      );
    },
    convert2Data(deep, lst) {
      var v = [];
      lst.forEach(function(element) {
        var item = {
          value: element.rowID,
          label: element.deptName,
          levelID: element.levelID,
          parentID: element.parentFullID,
          deep: deep,
          parentName: element.parentFullName
        };
        if (element.children)
          item.children = this.convert2Data(deep + 1, element.children);
        v.push(item);
      }, this);
      return v;
    },
    selected(node) {
      if (node != null) {
        //debugger
        //this.$emit("input", node[this.dataProps.value]);
        // debugger
        this.$emit("onSelected", node[this.dataProps.value], node);
      } else this.$emit("onSelected");
    }
  },
  watch: {
    currentValue(val){
      if(this.value!=val)
         this.$emit("input", val);
    },
    value(val) {
      this.currentValue = val;
    },
    companyID(val) {
      // debugger;
      this.currentValue = "";
      this.refreshData();
    }
  }
};
</script>


