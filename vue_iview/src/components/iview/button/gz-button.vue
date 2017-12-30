<template>
     <Poptip v-if="showConfirm" transfer confirm :title="confirmTitle" v-model="visible" 
        @on-ok="handleClick">
      <button :type="htmlType" :class="classes" :disabled="disabled" @click="showPoptip">
        <Icon class="ivu-load-loop" type="load-c" v-if="loading"></Icon>
        <Icon :type="icon" v-if="icon && !loading"></Icon>
        <span v-if="showText">
          <span v-if="!loading">{{text}}</span>
          <span v-else>{{loadingText}}</span>
        </span>
      </button>
    </Poptip>
    <button v-else-if="isAuthroize"  :type="htmlType" :class="classes" :disabled="disabled" @click="handleClick">
      <Icon class="ivu-load-loop" type="load-c" v-if="loading"></Icon>
      <Icon :type="icon" v-if="icon && !loading"></Icon>
      <span v-if="showText">
        <span v-if="!loading">{{text}}</span>
        <span v-else>{{loadingText}}</span>
      </span>
    </button>


</template>
<style lang="less" scoped>
.ivu-btn-group:not(.ivu-btn-group-vertical) {
  .ivu-poptip:first-child:not(:last-child) {
    .ivu-btn {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
  }
  .ivu-poptip:last-child:not(:first-child) {
    .ivu-btn {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }
  .ivu-poptip:not(:first-child):not(:last-child) {
    .ivu-btn {
      border-radius: 0px;
    }
  }
}
</style>

<script>
import { oneOf } from "../.depend/utils/assist";
import Authorize from "../../../mixins/authorize";
const prefixCls = "ivu-btn";

export default {
  name: "GzButton",
  mixins: [Authorize],
  components: {},
  props: {
    permission: {
      type: Number,
      default: 0
    },
    type: {
      validator(value) {
        return oneOf(value, [
          "primary",
          "ghost",
          "dashed",
          "text",
          "info",
          "success",
          "warning",
          "error",
          "default"
        ]);
      }
    },
    shape: {
      validator(value) {
        return oneOf(value, ["circle", "circle-outline"]);
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      }
    },
    disabled: Boolean,
    htmlType: {
      default: "button",
      validator(value) {
        return oneOf(value, ["button", "submit", "reset"]);
      }
    },
    icon: String,
    long: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    },
    loadingText: {
      type: String,
      default: "请求中"
    },
    showText: {
      type: Boolean,
      default: true
    },
    confirmTitle: {
      type: String,
      default: ""
    },
    validateShowConfirm: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      loading: false,
      visible: false
    };
  },
  computed: {
    showConfirm() {
      return this.isAuthroize && !this.$utils.isNULL(this.confirmTitle);
    },
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.type}`]: !!this.type,
          [`${prefixCls}-long`]: this.long,
          [`${prefixCls}-${this.shape}`]: !!this.shape,
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-loading`]: this.loading != null && this.loading,
          [`${prefixCls}-icon-only`]: false
        }
      ];
    },
    isAuthroize() { //是否拥有权限，这种就只能用在这个gz-button组件
      if (this.permission > 0) {
        return this.VerifyPermissions(this.permission);
      } else return true;
    }
  },
  methods: {
    handleClick(event) {
      this.loading = true;
      this.$emit("click", this);
    },
    showPoptip() {
      if (this.validateShowConfirm) this.visible = this.validateShowConfirm();
      else this.visible = true;
    }
  },
  mounted() {}
};
</script>
