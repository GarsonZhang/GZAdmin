import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import './locale'; //你这个咋不解析@ 我也不知道啊 什么原因？ 双引号也不行

//import axios from 'axios';
import gziview from './components/global';


// import Locales from './locale/locale.js';
// import zhLocale from 'iview/src/locale/lang/zh-CN';
// import enLocale from 'iview/src/locale/lang/en-US';
// import zhTLocale from 'iview/src/locale/lang/zh-TW';

// // 自动设置语言
// const navLang = navigator.language;
// const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
// const lang = window.localStorage.lang || localLang || 'zh-CN';

// Vue.config.lang = lang;

// // 多语言配置
// const locales = Locales;
// const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
// const mergeEN = Object.assign(enLocale, locales['en-US']);
// const mergeTW = Object.assign(zhTLocale, locales['zh-TW']);
// Vue.locale('zh-CN', mergeZH);
// Vue.locale('en-US', mergeEN);
// Vue.locale('zh-TW', mergeTW);



import GZStorage from './libs/GZStorage';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);

Vue.use(gziview);

// Vue.prototype.$axios = axios;
// axios.defaults.baseURL = 'http://' + window.location.hostname + ':' + window.location.port + '/data/';
// axios.defaults.timeout = 3000;

Vue.prototype.$utils = Util;

// 路由配置
const RouterConfig = {
    mode: 'hash',// "hash" | "history" | "abstract"
    routes: Routers
    //routes: Util.convertRouteMap()
};
const router = new VueRouter(RouterConfig);


router.beforeEach((to, from, next) => {
    // console.log('router.beforeEach');
    // console.dir(to);
    // console.dir(from);
    iView.LoadingBar.start();
    var title = '';
    switch (Vue.config.lang) {
        case 'zh-CN':
            title = to.meta.title;
            break;
        case 'zh-TW':
            title = to.meta.title_tw;
            break;
        case 'en-US':
            title = to.meta.title_en;
            break;
        default:
            title = to.meta.title_other;
            break;
    }
    // Util.title(to.meta.title);
    Util.title(title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
const store = new Vuex.Store({
    state: {
        cachePage: []
    },
    getters: {

    },
    mutations: {
        closePage(state, name) {
            console.log('closePage');
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        increateTag(state, tagObj) {
            console.log('increateTag');
            state.cachePage.push(tagObj.name);
        },
        clearAllTags(state) {
            console.log('clearAllTags');
            state.cachePage.splice(1, state.cachePage.length);
        },
        clearOtherTags(state, name) {
            let currentIndex = -1;
            console.log('clearOtherTags');
            for (var i = 0; i < state.cachePage.length; i++) {
                if (state.cachePage[i] === name) {
                    currentIndex = i;
                    break;
                }
            }
            if (currentIndex === 0) {
                this.clearAllTags(state);
            } else {
                state.cachePage.splice(currentIndex + 1);
                state.cachePage.splice(1, currentIndex - 1);
            }
        },
    },
    actions: {

    }
});

store.dataCache = GZStorage;


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    created() {
        // console.log('main.js   created');

        // var menuData=[{
        //     name:'system',
        //     path: '/system',
        //     meta: {
        //         title: '系统'
        //     },
        //     component: (resolve) => require(['./views/index.vue'], resolve),
        //     children: [{
        //         name: 'about',
        //         path: '/system/about',
        //         meta: {
        //             title: '关于'
        //         },
        //         component: resolve => {
        //             return require(['./components/page/about.vue'], resolve);
        //         }
        //     }]
        // }];
        // debugger
        // this.$router.options.routes.push(menuData);
        // this.$router.addRoutes(menuData);
    }
});