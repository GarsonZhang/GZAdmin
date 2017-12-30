<template>
  <Poptip 
    placement="bottom-start" 
    class="gz" 
    v-model="visible">
    <Input 
      class="arrow" 
      type="text" 
      :class="{'expanded':visible}" 
      v-if="!multiple"
      :readonly="!allowQuery" 
      v-model="currentLabel" 
      :placeholder="placetext" 
      :icon="iconName" 
      @input="handleFilter" 
      @on-blur="handleAutoComplete"
      @on-click.stop="handleClear"
      v-on:mouseenter.native="mouseenter()" v-on:mouseleave.native="mouseleave()" />
    <div 
      slot="content" 
      :style="contextClass">
        <gzTree 
          ref="tree" 
          :treeData="treeData" 
          :treeProps="treeProps" 
          :query="query" 
          v-model="currentValue" 
          :multiple="multiple"
          @on-select="onSelect"
          @on-afterValueChanged="onAfterValueChanged">
        </gzTree>
    </div>
  </Poptip>
</template>   

<style lang="less">
.gz {
  .ivu-poptip-rel {
    width: 100%;
  }
  .ivu-poptip-body {
    padding: 3px;
  }

  .arrow {
    i {
      transition: transform 0.3s ease-in-out;
    }
  }
  .expanded {
    i {
      &.ivu-icon-arrow-down-b {
        transform: rotate(180deg);
      }
    }
  }
}
</style>

<style lang="less" scoped>
.gz {
  width: 100%;
}
</style>

<script>
import gzTree from "../gz-tree";
export default {
  name: "gzTreeSelect",
  components: {
    gzTree
  },
  props: {
    placetext: {
      type: String,
      default: ""
    },
    allowQuery: false,
    treeData: {
      type: Array,
      default: []
    },
    width: 0,
    treeProps: {
      type: Object,
      default: {
        label: "label",
        children: "children"
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    dropDownMaxHeight: 0,
    dropDownHeight: 0,
    value: ""
  },
  watch: {
    value(val) {
      // debugger;
      if (this.currentValue !== val) {
        // 外部赋值
        this.currentValue = val;
        // if (this.$utils.isNULL(val)) {
        //   this.currentNode = null;
        //   this.currentLabel = "";
        // } else {
        //   this.currentNode = this.$refs["tree"].getNodeByValue(val);
        //   this.currentLabel = this.currentNode[this.treeProps.label];
        // }
      }
    }
  },
  data() {
    return {
      query: "",
      isQuery: false,
      visible: false,
      currentValue: "",
      currentLabel: "",
      currentNode: {},
      iconName: "arrow-down-b"
    };
  },
  computed: {
    contextClass() {
      //在这计算就好了   直接返回 ‘max-height：200px’ 这种格式
      var c = {};
      if (this.dropDownMaxHeight > 0)
        c["max-height"] = this.dropDownMaxHeight + "px";
      if (this.dropDownHeight > 0) c["height"] = this.dropDownHeight + "px";
      return c;
    }
  },
  methods: {
    mouseenter() {
      // console.log("mouseneter");
      this.iconName = this.$utils.isNULL(this.currentValue)
        ? "arrow-down-b"
        : "ios-close";
    },
    mouseleave() {
      // console.log("mouseleave");
      this.iconName = "arrow-down-b";
    },
    handleFilter() {
      // debugger;
      if (!this.visible) this.visible = true;
      this.isQuery = true;
      this.query = this.currentLabel;
    },
    handleAutoComplete() {
      if (this.isQuery) {
        this.clearQuery();
        this.currentLabel = this.currentNode[this.treeProps.label];
      }
    },
    handleClear() {
      if(this.$utils.isNULL(this.currentValue)){
          this.visible=!this.visible;
      }else{
        this.$refs["tree"].clearSelect();
        this.iconName = "arrow-down-b";
      }
    },
    clearQuery() {
      this.query = "";
      this.isQuery = false;
    },
    handleCloseTree() {},
    onSelect(node) {
      this.currentNode = node;
      // debugger
      if (node) this.currentLabel = node[this.treeProps.label];
      else this.currentLabel = "";
      // debugger;
      this.$emit("input", this.currentValue);
      this.visible = false;
      this.clearQuery();
      this.$emit("on-select", node);
    },
    onAfterValueChanged(node) {
      // debugger
      this.currentNode = node;
      if (node) this.currentLabel = node[this.treeProps.label];
      else this.currentLabel = "";
    }
  }
};
</script>
