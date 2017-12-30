<template>
    <div ref="scrollCon" @mousewheel="handlescroll" class="tags-outer-scroll-con">
        <div class="close-all-tag-con">
            <Dropdown trigger="click" @on-click="handleTagsOption">
                <Button size="small" type="primary" >
                    标签选项
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
            <!-- <transition-group name="taglist-moving-animation"> -->
                <!-- <Tag type="dot" closable color="blue" @click.native="linkTo(item)">标签一</Tag>
                <Tag type="dot" closable color="blue">标签二</Tag>
                <Tag type="dot" closable color="blue">标签三</Tag>
                <Tag type="dot" closable color="blue">标签四</Tag> -->
                <Tag type="dot" v-for="item in pageTagsList" :key="item.name" :name="item.name" 
                    :closable="item.name!='home'"
                    @click.native="linkTo(item)"
                    @on-close="closePage"
                     :color="item.name===currentPageName?'blue':'default'">
                {{getLang(item.meta)}}    
                </Tag>
                <!-- <Tag 
                    type="dot"
                    :key="item.name" 
                    :name="item.name" 
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.name==='home_index'?false:true"
                    :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
                >{{ item.title }}</Tag> -->
            <!-- </transition-group> -->
        </div>
    </div>
</template>
<style scoped>
.tags-outer-scroll-con {
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  position: relative;
  box-shadow: 0 2px 1px 1px hsla(0, 0%, 39%, 0.1);
}
.close-all-tag-con {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 8px;
  text-align: center;
  width: 110px;
  height: 100%;
  /* background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1); */
  background:transparent;
  z-index: 500;
}
</style>

<script>
export default {
  name: "tagsPageOpened",
  data() {
    return {
      currentPageName: this.$route.name,
      tagBodyLeft: 0,
      currentScrollBodyWidth: 0,
      refsTag: [],
      tagsCount: 1,
      pageTagsList: []
    };
  },
  computed: {
    title() {
      return this.$store.state.currentTitle;
    },
    tagsList() {
      return this.$store.state.pageOpenedList;
    }
  },
  created() {
    // debugger
    this.clearRouter();
    var item = this.$utils.jsonSearch.search(
      this.$router.options.routes,
      "children",
      parm => parm.name === "home"
    );
    this.addRouter(item);

    //
    item = this.$utils.jsonSearch.search(
      this.$router.options.routes,
      "children",
      parm => parm.name === this.$route.name
    );
    // console.dir(this.$route.name);
    // console.dir(item);
    if (item) this.addRouter(item);
    //console.log('tag create');
  },
  methods: {
    getLang(item){
      // debugger
      var text='';
      switch(this.$lang){
        case 'zh-CN':
        text= item.title;
        break;
        case 'zh-TW':text= item.title_tw;
        break
        case 'en-US':text= item.title_en;
        break;
        default: text= item.title_other;break;
      }
      if(this.$utils.isNULL(text))
        text=item.title;
        return text;
    },
    addRouter(item) {
      // debugger
      var v = this.$utils.jsonSearch.search(
        this.pageTagsList,
        null,
        parm => parm.name === item.name
      );
      if (v) return;
      else {
        //debugger;
        this.$store.commit("increateTag", item);
        this.pageTagsList.push(item);
      }
    },
    clearRouter() {
      this.$store.commit("clearAllTags");
    },
    removeTags(name) {
      //this.$store.commit('closePage', item.name);
      var v = this.$utils.jsonSearch.search(
        this.pageTagsList,
        null,
        parm => parm.name === name
      );
      if (v) {
        var index = this.pageTagsList.indexOf(v);
        if (index > -1) {
          this.pageTagsList.splice(index, 1);
        }
      }
    },
    removeAllTags() {
      this.pageTagsList.splice(1);
    },
    removeOtherTags(name) {
      let currentIndex = -1;
      for (var i = 0; i < this.pageTagsList.length; i++) {
        if (this.pageTagsList[i].name === name) {
          currentIndex = i;
          break;
        }
      }
      if (currentIndex === 0) {
        this.removeAllTags();
      } else {
        this.pageTagsList.splice(currentIndex + 1);
        this.pageTagsList.splice(1, currentIndex - 1);
      }
    },
    closePage(event, name) {
      this.$store.commit("closePage", name);
      this.removeTags(name);
      if (name === this.$route.name) {
        this.$router.push({
          name: this.pageTagsList[0].name
        });
      }
    },
    linkTo(item) {
      if (item.path.indexOf(":") > -1) {
        this.$router.push({
          name: item.name,
          params: item.argu
        });
      } else {
        this.$router.push({
          name: item.name
        });
      }
    },
    handlescroll(e) {
      let left = 0;
      if (e.wheelDelta > 0) {
        left = Math.min(0, this.tagBodyLeft + e.wheelDelta);
      } else {
        if (
          this.$refs.scrollCon.offsetWidth - 100 <
          this.$refs.scrollBody.offsetWidth
        ) {
          if (
            this.tagBodyLeft <
            -(
              this.$refs.scrollBody.offsetWidth -
              this.$refs.scrollCon.offsetWidth +
              100
            )
          ) {
            left = this.tagBodyLeft;
          } else {
            left = Math.max(
              this.tagBodyLeft + e.wheelDelta,
              this.$refs.scrollCon.offsetWidth -
                this.$refs.scrollBody.offsetWidth -
                100
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
      this.tagBodyLeft = left;
    },
    handleTagsOption(type) {
      if (type === "clearAll") {
        this.$store.commit("clearOtherTags", this.$route.name);
        this.removeOtherTags(this.$route.name);
        if (this.$route.name != this.pageTagsList[0].name)
          this.closePage(null,this.$route.name);
      } else {
        this.$store.commit("clearOtherTags", this.$route.name);
        this.removeOtherTags(this.$route.name);
      }
      this.tagBodyLeft = 0;
    },
    moveToView(tag) {
      if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + 10;
      } else if (
        tag.offsetLeft + 10 > -this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth <
          -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100
      ) {
        // 标签在可视区域
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(
          tag.offsetLeft -
          (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) +
          20
        );
      }
    }
  },
  mounted() {
    // this.refsTag = this.$refs.tagsPageOpened;
    // setTimeout(() => {
    //     this.refsTag.forEach((item, index) => {
    //         if (this.$route.name === item.name) {
    //             let tag = this.refsTag[index].$el;
    //             this.moveToView(tag);
    //         }
    //     });
    // }, 1);  // 这里不设定时器就会有偏移bug
    // this.tagsCount = this.tagsList.length;
  },
  watch: {
    $route(to) {
      // this.currentPageName = to.name;
      // this.$nextTick(() => {
      //     this.refsTag.forEach((item, index) => {
      //         if (to.name === item.name) {
      //             let tag = this.refsTag[index].$el;
      //             this.moveToView(tag);
      //         }
      //     });
      // });
      // this.tagsCount = this.tagsList.length;
      //this.pageTagsList.push(to);
      this.currentPageName = this.$route.name;
      this.addRouter(to);
      //console.dir( to);
    }
  }
};
</script>
