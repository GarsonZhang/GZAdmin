<template>
  <div :class="classes">
      <div :class="topClass" ref="top" :style="_styleTop">
          <slot name="top" ></slot>
      </div>
      <div :class="mainClass" ref="main" :style="_styleMain">
          <slot name="main" class="abc"></slot>
      </div>
      <div :class="bottomClass" ref="bootom" :style="_styleBottom">
          <slot name="bottom"></slot>
      </div>
  </div>
</template>
<script>
import debounce from "throttle-debounce/debounce";
export default {
  name: "gzPanel",
  data() {
    return {
      top_height: 0,
      bottom_height: 0
    };
  },
  props: {
    topStyle: {
      //设置top样式，height设置无效
      type: Object,
      default: this.gobject
    },
    mainStyle: {
      //设置main样式，top和bottom设置无效
      type: Object,
      default: this.gobject
    },
    bottomStyle: {
      //设置bottom样式，height设置无效
      type: Object,
      default: this.gobject
    },
    className: String,
    autoHeight: {
      type: Boolean,
      default: true
    },
    topHeight: 0,
    bottomHeight: 0
  },
  methods: {
    gobject() {
      return {};
    },
    reLayout() {
      // debugger
      this.top_height = this.$refs.top
        ? this.$refs.top.firstChild
          ? this.$refs.top.firstChild.getBoundingClientRect().height + "px"
          : "0px"
        : "0px";
      this.bottom_height = this.$refs.bootom
        ? this.$refs.bootom.firstChild
          ? this.$refs.bootom.firstChild.getBoundingClientRect().height + `px`
          : "0px"
        : "0px";
      var me = this;
      setTimeout(() => {
        var mainHeight = me.$refs.main
          ? me.$refs.main.getBoundingClientRect().height
          : 0;
        var mainWidth = me.$refs.main
          ? me.$refs.main.getBoundingClientRect().height
          : 0;
        me.$emit("onMainResize", mainWidth, mainHeight);
      }, 10);
      // console.log(this.top_height);
    }
  },
  mounted() {
    if (this.autoHeight) {
      this.reLayout();
      var me = this;
      if (this.autoHeight) {
        // var time;
        // debugger;
        // window.addEventListener("resize", function() {
        //   if (time) clearTimeout(time);
        //   time = setTimeout(() => {
        //     me.reLayout();
        //   }, 500);
        // });
        window.addEventListener("resize", debounce(500, () => me.reLayout()));
      }
    }
  },
  computed: {
    _topH() {
      return this.autoHeight ? this.top_height : this.topHeight + "px";
    },
    _bottomH() {
      return this.autoHeight ? this.bottom_height : this.bottomHeight + "px";
    },
    _styleTop() {
      var v = {};
      if (this.topStyle) v = this.$utils.deepCopy(this.topStyle);
      v.height = this._topH;
      return v;
      // console.dir(v);
    },
    _styleMain() {
      var v = {};
      if (this.topStyle) v = this.$utils.deepCopy(this.mainStyle);
      v.top = this._topH;
      v.bottom = this._bottomH;
      return v;
    },
    _styleBottom() {
      var v = {};
      if (this.bottomStyle) v = this.$utils.deepCopy(this.bottomStyle);
      v.height = this._bottomH;
      return v;
    },
    topClass() {
      return [
        `fill-100`,
        {
          [`gz-panel-top`]: true
        }
      ];
    },
    mainClass() {
      return [
        {
          [`gz-panel-main`]: true
        }
      ];
    },
    bottomClass() {
      return [
        {
          [`gz-panel-bottom`]: true
        }
      ];
    },
    classes() {
      return [
        {
          [`gz-panel-layout`]: true
          // [`${this.className}`]: !!this.className
        }
      ];
    }
  }
};
</script>
<style scoped>
.gz-panel-layout {
  /* position: relative; */
  height: 100%;
  width: 100%;
}
.gz-panel-top {
}
.gz-panel-main {
  min-height: 200px;
  overflow: hidden;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
}
.gz-panel-bottom {
  color: #9ea7b4;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
<style lang="less" scoped>
// .gz-top{
//   background-color: red;
// }
</style>
