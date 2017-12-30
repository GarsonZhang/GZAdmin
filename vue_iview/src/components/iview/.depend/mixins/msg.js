
export default {
    methods: {
        showInfo(content) {
            this.$Message.info({
                content: content,
                duration: 3,
                closable: true
            });
            window.document.getElementsByClassName('ivu-message')[0].style.paddingLeft = window.document.getElementsByClassName('menu')[0].offsetWidth + 'px';
        },
        ask(title, content, onOK, onCancel) {
            this.$Modal.confirm({
                title: title,
                content: content,
                onOk: onOK,
                onCancel: onCancel
            });
        }
    }
};