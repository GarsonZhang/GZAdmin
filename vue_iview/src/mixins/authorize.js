export default {
    // name:'Authorize',
    directives: {
        permission: {
            bind(el, binding,vnode) {
                // debugger
                if (!vnode.context.VerifyPermissions(binding.value)) {
                    el.remove();
                }
            }
        }
    },
    data() {
        return {
            _authorize: 0,
        };
    },
    created() {
        // debugger
        // 获取用户功能下权限值
        if (this.$store.authorizeDataCache)
            this._authorize = this.$store.authorizeDataCache[this.$route.name];
        // console.log('routeName:'+this.$route.name+'  Authorize:'+this._authorize);
    },
    methods: {
        // 判断是否i拥有权限
        VerifyPermissions(authorize) {
            // debugger
            return (this._authorize & authorize) === authorize;
        }
    }
};