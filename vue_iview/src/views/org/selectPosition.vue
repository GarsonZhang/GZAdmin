<template>
  <Cascader ref="control" :data="data" @on-change="selected" v-model="currentValue"  change-on-select></Cascader>
</template>
<style lang="less" scoped>

</style>
<script>
import { requestCommonDataPosition } from "../../libs/request";
export default {
  name: "SelectPosition",
  data() {
    return {
      data: [],
      currentValue: []
    };
  },
  props: {
    value: String,
    companyID: String
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
      requestCommonDataPosition.list(this,this.companyID).then(
        res => {
          me.data = this.convert2Data(res.data);
          //me.$refs.control.updateSelected(true);
          // debugger;
          setTimeout(() => {
            me.currentValue = me.currentValue;
            // debugger
            me.$refs['control'].updateSelected(true);
          }, 50);
        },
        err => {
          me.data = [];
        }
      );
    },
    convert2Data(lst) {
      var v = [];
      lst.forEach(function(element) {
        var item = {
          value: element.rowID,
          label: element.posName,
          levelID: element.levelID,
          parentID: element.parentFullID,
          parentName: element.parentFullName
        };
        if (element.children)
          item.children = this.convert2Data(element.children);
        v.push(item);
      }, this);
      return v;
    },
    selected(a, b) {
      // debugger;
      if (a.length > 0) {
        this.$emit("input", a[a.length - 1]);
        this.$emit("onSelected", a[a.length - 1], b[b.length - 1]);
      } else {
        this.$emit("input", "");
        this.$emit("onSelected");
      }
    }
  },
  watch: {
    value(val) {
      var v = [];
      if (!this.$utils.isNULL(val)) v.push(val);
      this.currentValue = v;
    },
    companyID(val) {
      // debugger;
      this.refreshData();
    }
  }
};
</script>


