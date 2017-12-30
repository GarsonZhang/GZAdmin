<template>
  <!-- <Cascader :data="data" trigger="hover" @on-change="selected" v-model="currentValue"  change-on-select></Cascader> -->
  <gz-tree-select clearable  :treeData="data" :treeProps="dataProps" @on-select="selected" v-model="currentValue" :dropDownMaxHeight="500" placeholder="请选择公司"
    :width="width">
  </gz-tree-select>

</template>
<style lang="less" scoped>

</style>
<script>
import { ReqCommonDataCompany } from "../../libs/request";
export default {
  name: "SelectCompany",
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
    width: 0
  },
  created() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      // debugger
      ReqCommonDataCompany.list(this).then(
        res => {
          this.data = this.convert2Data(1, res.data);
          // debugger;
        },
        err => {
          this.data = [];
        }
      );
    },
    convert2Data(deep, lst) {
      var v = [];
      lst.forEach(function(element) {
        var item = {
          value: element.rowID,
          label: element.companyName_chs,
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
        this.$emit("input", node[this.dataProps.value]);
        // debugger
        this.$emit("onSelected", node[this.dataProps.value], node);
      } else this.$emit("onSelected");
    }
  },
  watch: {
    value(val) {
      // var v = [];
      // if (!this.$utils.isNULL(val)) v.push(val);
      this.currentValue = val;
    }
  }
};
</script>
