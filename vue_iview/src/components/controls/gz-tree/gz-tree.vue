<template>
  <div>
    <div v-if="isLoading">
      <h3>加载中……</h3>
    </div>
      <ul class="nodePanel" v-else>
                    <gz-tree-node
                        v-for="child in treeNodes[treeProps.children]"
                        :node="child"
                        :key="child[treeProps.value]"
                        :multiple="multiple"
                        :currentNodeId="currentNodeId"
                        :treeProps="treeProps"
                        :eventHub="eventHub">
                    </gz-tree-node>
                </ul>
                </div>
</template>
<style lang="less" scoped>
.nodePanel {
  overflow-y: hidden;
}
</style>
<script>
import Clickoutside from "./utils/clickoutside";
import { objArrDeepCopy } from "./utils/tools";
import debounce from "throttle-debounce/throttle";
import Vue from "vue";

import gzTreeNode from "./gz-tree-node.vue";

export default {
  name: "gzTree",
  components: {
    gzTreeNode
  },
  props: {
    treeData: {
      type: Array,
      default: []
    },
    isLoading:{
      type:Boolean,
      default:false
    },
    treeProps: {
      type: Object,
      default: {
        label: "label",
        children: "children"
      }
    },
    multiple: {
      type: Boolean
    },
    query: "",
    value: ""
  },

  data() {
    return {
      isQuering: false,
      treeNodes: {
        [this.treeProps.children]: objArrDeepCopy(this.treeData, {
          visible: true
        }),
        visible: true
      },
      currentNodeId: "",
      eventHub: new Vue()
    };
  },
  watch: {
    treeData(val) {
      if (val) {
        this.treeNodes = {
          [this.treeProps.children]: objArrDeepCopy(val, { visible: true }),
          visible: true
        };
      }
    },
    value(val) {
      // debugger;
      if (this.currentNodeId !== val) {
        this.currentNodeId = val;
        var node = this.getNodeByValue(this.currentNodeId);
        this.$emit("on-afterValueChanged", node);
        setTimeout(() => {
          //这里要延时加载，不然无效
          this.treeResetLayout(this.treeNodes);
        }, 300);
      }
    },
    query(val) {
      // if (isQuering) {
      this.handleFilter();
      // }
    }
  },
  created() {
    // debugger;
    this.eventHub.$on("node-click", this.handleNodeClick);
  },

  methods: {
    handleFilter: debounce(1000, function() {
      this.treeFilterMethod(this.treeNodes);
    }),
    getNodeByValue(value) {
      return this.$utils.jsonSearch.search(
        this.treeNodes,
        this.treeProps.children,
        p => p[this.treeProps.value] === value
      );
    },
    treeResetLayout(node) {
      var flag = 0;
      let self = this;
      let childNodes = node[self.treeProps.children];
      if (!childNodes) return;
      childNodes.forEach(child => {
        if (child[self.treeProps.value] === this.currentNodeId) flag = flag | 1;
        flag = flag | self.treeResetLayout(child);
      });
      // debugger;
      this.$set(node, "expanded", (flag & 1) === 1);
      node.expanded = (flag & 1) === 1;
      return flag;
    },
    treeFilterMethod(node) {
      //1 有子项
      //2 有选中值
      var flag = 0;
      let self = this;
      let childNodes = node[self.treeProps.children];
      if (!childNodes) return;
      childNodes.forEach(child => {
        child.visible =
          self.query === ""
            ? true
            : child[self.treeProps.label]
                .toLowerCase()
                .indexOf(self.query.toLowerCase()) > -1;
        if (child.visible) flag = flag | 1;
        if (child[self.treeProps.value] === this.currentNodeId) flag = flag | 2;

        flag = flag | self.treeFilterMethod(child);
      });
      if (!node.visible && (flag & 1) === 1) {
        node.visible = true;
      }
      if (node.visible) {
        if (self.query === "") {
          this.$set(node, "expanded", (flag & 2) === 2);
          //node.expanded = (flag & 2) === 2;
        } else this.$set(node, "expanded", true);
      }

      return flag;
    },
    handleNodeClick(node, event) {
      this.currentNodeId = node[this.treeProps.value];
      this.$emit("input", this.currentNodeId);
      this.$emit("on-select", node);
    },
    clearSelect(){
      this.currentNodeId ="";
      this.$emit("input", "");
      this.$emit("on-select");
    }
  }
};
</script>

