<template>
    <li @click.stop="handleClick(node,$event)">
        <div class="itemContent"
            v-show="node.visible"
            :style="{ 'padding-left': (node[treeProps.level] - 1) * 16 + 'px' }"
            :class="{'is-current':currentNodeId===node[treeProps.value],'is-checked':node.checked}">
            <span class="icon" :class="arrowClasses" @click.stop="expandToggle(node,$event)">
                    <Icon type="arrow-right-b"  v-if="node[treeProps.children]&&node[treeProps.children].length"></Icon>
                </span>
            <span
                class="ats-tree-node__label"
                :title="handleTitleVisible(node[treeProps.label])">{{node[treeProps.label]}}</span>
        </div>
        <ul v-if="node.expanded">
            <gz-tree-node
                v-for="child in node[treeProps.children]"
                :node="child"
                :key="child[treeProps.value]"
                :treeProps="treeProps"
                :currentNodeId="currentNodeId"
                :eventHub="eventHub"
                >
            </gz-tree-node>
        </ul>
    </li>
</template>

<script>
import Vue from "vue";

export default {
  name: "gzTreeNode",
  props: {
    node: {
      type: Object,
      defautl: {}
    },
    treeProps: {},
    multiple: {},
    eventHub: {},
    currentNodeId: ""
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    arrowClasses() {
      return [
        `ivu-tree-arrow`,
        {
          [`ivu-tree-arrow-open`]: this.node.expanded
        }
      ];
    }
  },
  methods: {
    expandToggle(node, event) {
      if (node.expanded) {
        this.$set(node, "expanded", false);
      } else {
        this.$set(node, "expanded", true);
      }
    },
    handleClick(node, event) {
      this.eventHub.$emit("node-click", node, event);
      // debugger;
      // let targetClass = event.target.getAttribute("class");

      // if (!(targetClass.indexOf("icon") > -1)) {
      //   this.eventHub.$emit("node-click", node, event);
      // } else {
      //   if (node.expanded) {
      //     this.$set(node, "expanded", false);
      //   } else {
      //     this.$set(node, "expanded", true);
      //   }
      // }
    },
    handleTitleVisible(title) {
      let titleLen = title.replace(/[^\x00-\xff]/g, "..").length;
      if (titleLen > 28) {
        return title;
      } else {
        return "";
      }
    }
  }
};
</script>


<style lang="less" scoped>
.itemContent {
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 3px;
  padding-right: 15px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: rgb(228, 232, 241);
    color: #495060;
  }
  &.is-current {
    // background-color: rgb(4, 137, 224);
    background-color: #ebf7ff;
    // color: #fff;
  }
  .icon {
    padding-left: 5px;
    padding-right: 10px;
    font-size: 1.2em;
  }
}
// .ats-tree-node {
//   .ats-tree-node__content {
//     text-indent: 5px;
//     line-height: 36px;
//     height: 36px;
//     cursor: pointer;
//     white-space: nowrap;
//     padding-right: 15px;
//     &:hover {
//       background-color: rgb(228, 232, 241);
//       color: #495060;
//     }
//     .ats-tree-node__icon {
//       display: inline-block;
//       width: 22px;
//       height: 36px;
//       vertical-align: top;
//     }
// .ats-tree-node__expand-icon {
//   display: inline-block;
//   vertical-align: middle;
//   cursor: pointer;
//   width: 0;
//   height: 0;
//   margin-left: 10px;
//   border: 6px solid transparent;
//   border-right-width: 0;
//   border-left-color: rgb(151, 169, 190);
//   border-left-width: 7px;
//   transform: rotate(0);
//   transition: transform 0.3s ease-in-out;
//   &.expanded {
//     transform: rotate(90deg);
//   }
// }

// .expanded {
//         transform: rotate(90deg);
//       }
//     .ats-tree-node__label {
//       max-width: 230px;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       display: inline-block;
//     }
//   }

//   .ats-tree-node__content.is-checked .ats-tree-node__label {
//     &::after {
//       color: #20a0ff;
//       content: "\E608";
//       font-family: element-icons;
//       right: 10px;
//       font-size: 11px;
//       position: absolute;
//       -webkit-font-smoothing: antialiased;
//     }
//   }
// }
</style>
