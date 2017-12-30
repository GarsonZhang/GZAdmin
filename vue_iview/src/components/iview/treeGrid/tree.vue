<template>
  <div style="overflow:auto" class="ivu-table-wrapper">
  <table class="ivu-table ivu-table-small ivu-table-border" cellspacing="0" cellpadding="0" border="0" style="width:100%;" :class="{ 'el-tree--highlight-current': highlightCurrent }" >
    <thead>
      <tr> <th v-if="showRowNum" style="text-align:center;">序号</th>
      <th></th><th v-for="(col,index) in columns" :key="index" :style="{width:col.width+'px',minWidth:col.minWidth+'px'}">{{col.title}}</th></tr>
    </thead>
    <tbody ref="fuck"> 
      <el-tree-node
        v-for="child in store.getAllNodesByDepthFirst()"
        :node="child"
        :key="getNodeKey(child)"
        :render-content="renderContent"
        :columns="columns"
        :showRowNum="showRowNum"
        @node-expand="handleNodeExpand"
        :ref="'node'+getNodeKey(child)"
        :getkey='getNodeKey(child)'
        >
      </el-tree-node>
    </tbody>
  </table>
  </div>
</template>
<style scoped>
th{
  padding-left:10px;padding-right:10px;
}
</style>

<script>
  import TreeStore from './model/tree-store'
  import {t} from '../.depend/locale'
  import emitter from '../.depend/mixins/emitter'

  export default {
    name: 'GzTreeGrid',
    mixins: [emitter],
    components: {
      ElTreeNode: require('./tree-node.vue')
    },
    data() {
      return {
        store: null,
        root: null,
        currentNode: null,
        colTwo: "136464656"
      };
    },
    props: {
      columns: {
        type: Array
      },
      data: {
        type: Array
      },
      emptyText: {
        type: String,
        default() {
          return t('el.tree.emptyText');
        }
      },
      nodeKey: String,
      childrenKey:String,
      showRowNum:{
        type:Boolean,
        default:false
      },


      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      defaultFilter: Array,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      renderContent: Function,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
      currentNodeKey: [String, Number],
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 16
      }     
    },

    computed: {
      children: {
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      }
    },

    watch: {
      defaultCheckedKeys(newVal) {
        this.store.defaultCheckedKeys = newVal;
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      currentNodeKey(newVal) {
        this.store.setCurrentNodeKey(newVal);
        this.store.currentNodeKey = newVal;
      },
      data(newVal) {
        this.store.setData(newVal);
      }
    },

    methods: {
      filter(value) {
        if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        this.store.filter(value);
      },
      getNodeKey(node, index) {
        
        const nodeKey = this.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },
      getCheckedNodes(leafOnly) {
        return this.store.getCheckedNodes(leafOnly);
      },
      getCheckedTree(){
        return this.store.getCheckedTree();
      },
      getCheckedKeys(leafOnly) {
        return this.store.getCheckedKeys(leafOnly);
      },
      getSelectObj() {
        // debugger;
        return this.store.getSelectObj();
      },
      setCheckedNodes(nodes, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedNodes(nodes, leafOnly);
      },
      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedKeys(keys, leafOnly);
      },
      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },
      handleNodeExpand(nodeData, node, instance) {
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        this.$emit('node-expand', nodeData, node, instance);
      }
    },

    created() {
      this.isTree = true;

      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.data,
        lazy: this.lazy,
        props: {
            children: this.childrenKey,
            label: 'title',
            icon: 'icon'
          },
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod
      });

      this.root = this.store.root; 

      if (this.defaultFilter) {
        this.filter(this.defaultFilter[0])
      }
    },
    mounted () {

    }
  };
</script>
