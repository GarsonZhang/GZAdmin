
export default {
    methods: {
        setMsgLoaction() {
            window.document.getElementsByClassName('ivu-message')[0].style.paddingLeft = window.document.getElementsByClassName('menu')[0].offsetWidth + 'px';
        },
        defaultConfig(content) {
            return {
                content: content,
                duration: 3,
                closable: true
            };
        },
        showInfo(content) {
            this.showInfoCfg(this.defaultConfig(content));
        },
        showInfoCfg(config) {
            this.$Message.info(config);
            this.setMsgLoaction();
        },
        showSuccess(content) {
            this.showSuccessCfg(this.defaultConfig(content));
        },
        showSuccessCfg(config) {
            this.$Message.success(config);
            this.setMsgLoaction();
        },
        showWarning(content) {
            this.showWarningCfg(this.defaultConfig(content));
        },
        showWarningCfg(config) {
            this.$Message.warning(config);
            this.setMsgLoaction();
        },
        showError(content) {
            this.showErrorCfg(this.defaultConfig(content));
        },
        showErrorCfg(config) {
            this.$Message.error(config);
            this.setMsgLoaction();
        },
        showLoading(content) {
            this.showLoadingCfg(this.defaultConfig(content));
        },
        showLoadingCfg(config) {
            this.$Message.loading(config);
            this.setMsgLoaction();
        },
        ask(title, content, onOK, onCancel) {
            this.showAsk(title, content, onOK, onCancel);
        },
        showAsk(title, content, onOK, onCancel) {
            this.$Modal.confirm({
                title: title,
                content: content,
                onOk: onOK,
                onCancel: onCancel
            });
        }
    }
};