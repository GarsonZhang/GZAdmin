<template> 
  <tr
    v-show="node.visible&&node.fatheExpanded"
    :class="{
      'is-expanded': childNodeRendered && expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible,
      'is-checked': node.checked,
      'ivu-table-row-highlight':node.selected,
      'ivu-table-row-hover':mouseOver
      }"
    class="el-tree-node__content"
    @click.stop="handleSelect"
    v-on:mouseenter="handleMouseOver" 
    v-on:mouseleave="handleMouseLeave"
    > 
     <td v-if="showRowNum" style="text-align:center;width:50px;">
        {{rowNum}}
      </td>
    <td style="width:50px; " @click.stop="handleClick" >
    <div style="text-align:center;" :class="{
      'ivu-table-cell-expand':true,
      'ivu-table-cell-expand-expanded':childNodeRendered && expanded
    }">
            <i v-if="node.childNodes.length > 0" class="ivu-icon ivu-icon-ios-arrow-right"></i>
            </div>
    </td>
      <!-- <td :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
         <el-checkbox
          v-if="showCheckbox"
          v-model="node.checked"
          :indeterminate="node.indeterminate"
          @change="handleCheckChange"
          @click.native.stop="handleUserClick">
        </el-checkbox> 
        
        {{node.data[columns[0].key]}}
      </td> -->
     
        <td :style="{ 'padding-left': ((node.level - 1) * tree.indent+10) + 'px' }">
        {{node.data[columns[0].key]}}
      </td>
      <td  v-for="col in columns.slice(1)" :key="col.key">
         {{node.data[col.key]}}
      </td>
  </tr>
</template>


<script type="text/javascript">
import emitter from "../.depend/mixins/emitter";
let isMousedown = false;
export default {
  name: "ElTreeNode",

  componentName: "ElTreeNode",

  mixins: [emitter],

  props: {
    columns: {
      type: Array
    },
    node: {
      default() {
        return {};
      }
    },
    showRowNum:{
      type:Boolean,
      default:false
    }
  },

  components: {
  },

  data() {
    return {
      mouseOver:false,
      tree: null,
      expanded: false,
      childNodeRendered: false,
      showCheckbox: false,
      oldChecked: null,
      oldIndeterminate: null
    };
  },

  watch: {
    "node.indeterminate"(val) {
      this.handleSelectChange(this.node.checked, val);
    },

    "node.checked"(val) {
      this.handleSelectChange(val, this.node.indeterminate);
    },

    "node.expanded"(val) {
      this.expanded = val;
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },
  computed: {
    rowNum(){
      // debugger
      return this.node.parent.childNodes.indexOf(this.node)+1;
    }
  },

  methods: {
    handleMouseOver(){
      this.mouseOver=true;
    },
    handleMouseLeave(){
      this.mouseOver=false;
    },
    getNodeKey(node, index) {
      const nodeKey = this.tree.nodeKey;
      if (nodeKey && node) {
        return node.data[nodeKey];
      }
      return index;
    },

    handleSelectChange(checked, indeterminate) {
      if (
        this.oldChecked !== checked &&
        this.oldIndeterminate !== indeterminate
      ) {
        this.tree.$emit("check-change", this.node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },

    handleClick() {
      const store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit(
        "current-change",
        store.currentNode ? store.currentNode.data : null,
        store.currentNode
      );
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      this.tree.$emit("node-click", this.node.data, this.node, this);
    },

    handleExpandIconClick() {
      if (this.node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit("node-collapse", this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit("node-expand", this.node.data, this.node, this);
      }
    },

    handleUserClick() {
      if (this.node.indeterminate) {
        this.node.setChecked(this.node.checked, !this.tree.checkStrictly);
      }
    },
    handleSelect(){
      // console.log('tree-node.vue.handleSelect');
      this.node.setSelected();
    },

    handleCheckChange(ev) {
        this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast("ElTreeNode", "tree-node-expand", node);
      this.tree.$emit("node-expand", nodeData, node, instance);
    }
  },

  created() {
    const parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;
    if (!tree) {
      // console.warn("Can not find node's tree.");
    }

    const props = tree.props || {};
    const childrenKey = props["children"] || "children";

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    this.showCheckbox = tree.showCheckbox;

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }

    if (this.tree.accordion) {
      this.$on("tree-node-expand", node => {
        if (this.node !== node) {
          this.node.collapse();
        }
      });
    }
  }
};
</script>
<style scoped>
.el-tree-node__content.is-checked {
  background: rgb(228, 233, 241);
}
span {
  margin: 0 5px;
}
.el-tree-node__expand-icon {
  margin-left: 10px;
}
td{
  padding-left:10px;padding-right:10px;
}
</style>