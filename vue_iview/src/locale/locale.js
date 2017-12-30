const customer = {};

customer.apiReg = {
    'zh-CN': {
        importMsg: '导入成功！新增API数量:{0}',
        deleteConfirm: '确定要删除【{0}】吗?',
        columns: {
            index: '序号',
            APIName: '接口名称',
            url: '接口URL',
            checkTypeName: '权限'
        }
    },
    'zh-TW': {
        importMsg: '導入成功！新增API數量:{0}',
        deleteConfirm: '確定要刪除【{0}】嗎?',
        columns: {
            index: '序號',
            APIName: '接口名稱',
            url: '接口URL',
            checkTypeName: '權限'
        }
    },
    'en-US': {
        importMsg: 'Successful operation！New API quantity:{0}',
        deleteConfirm: 'are you sure delete [ {0} ] ?',
        columns: {
            index: 'index',
            APIName: 'APIName',
            url: 'url',
            checkTypeName: 'type'
        }
    }
};

customer.dictMain = {
    'zh-CN': {
        columns: {
            index: '序号',
            code: '代码',
            description: '描述',
            parentCode: '关联代码',
            parentName: '关联名称'
        },
        form: {
            codeLabel: '代码',
            codePlaceHolder: '请输入代码',
            descriptionLabel: '描述',
            descriptionPlaceHolder: '请输入描述',
            parentIDLable: '父级名称',
            parentCodeLabel: '父级代码'
        },
        validate: {
            emptyCode: '代码不能为空',
            emptyDescription: '描述不能为空',
            errDescription: '描述长度必须介于{0}和{1}之间',
        }
    },
    'zh-TW': {

    },
    'en-US': {

    }
};
customer.dictDetail = {
    'zh-CN': {
        columns: {
            index: '序号',
            code: '代码',
            description: '描述',
            parentCode: '关联代码',
            parentName: '关联名称'
        },
        form: {
            codeLabel: '代码',
            codePlaceHolder: '请输入代码',
            descriptionLabel: '描述',
            descriptionPlaceHolder: '请输入描述',
            parentIDLable: '父级名称',
            parentCodeLabel: '父级代码'
        },
        validate: {
            emptyCode: '代码不能为空',
            emptyDescription: '描述不能为空',
            errDescription: '描述长度必须介于{0}和{1}之间',
        }
    },
    'zh-TW': {

    },
    'en-US': {

    }
};
customer.commonDataDictMain = {
    'zh-CN': {
        columns: {
            index: '序号',
            code: '代码',
            description: '描述'
        },
        form: {
            codeLabel: '代码',
            codePlaceHolder: '请输入代码',
            descriptionLabel: '描述',
            descriptionPlaceHolder: '请输入描述'
        },
        validate: {
            emptyCode: '代码不能为空',
            emptyDescription: '描述不能为空',
            errDescription: '描述长度必须介于{0}和{1}之间',
        }
    },
    'zh-TW': {

    },
    'en-US': {

    }
};
customer.commonDataDictDetail = {
    'zh-CN': {
        columns: {
            index: '序号',
            code: '代码',
            description: '描述'
        },
        form: {
            codeLabel: '代码',
            codePlaceHolder: '请输入代码',
            descriptionLabel: '描述',
            descriptionPlaceHolder: '请输入描述'
        },
        validate: {
            emptyCode: '代码不能为空',
            emptyDescription: '描述不能为空',
            errDescription: '描述长度必须介于{0}和{1}之间',
        }
    },
    'zh-TW': {

    },
    'en-US': {

    }
};

customer.commonMonitorItem = {
    'zh-CN': {
        keys: {
            titleCreate:'项目新增',
            titleModify:'项目修改',
            titleView:'查看',
            index: '序号',
            moduleID:'模块ID',
            moduleDescription:'模块',
            code: '监察代码',
            description: '描述',
            typeID:'监察类型ID',
            typeDescription:'监察类型',
            score:'扣分',
            remark:'说明',
            keyAll:'备注',
            key:'关键字'
        },

    },
    'zh-TW': {

    },
    'en-US': {

    }
};

customer.commonMonitorItemUserCfg = {
    'zh-CN': {
        keys: {
            titleCreate:'新增',
            titleModify:'修改',
            titleView:'查看',
            index: '序号',
            monitorItemCode:'监察代码',
            monitorItemDescription:'监察描述',
            typeDescription: '类型',
            sendEmail:'发送邮件',
            sendWebChat:'发送微信',
            sendAffix:'发送附件',
            columnKey:'关键字'
        },

    },
    'zh-TW': {

    },
    'en-US': {

    }
};


let system = {
    'zh-CN': {
        validateErr:{
            empty:'{0} 不能为空',
            lengthBetween: '{0} 长度必须介于{1}和{2}之间'
        },
        placeHolder:{
            input:'请输入{0}',
            select:'请选择',
        },
        pageSize: '{0} 条/页',
        login: '登陆',
        save: '保存',
        delete: '删除',
        modify: '修改',
        import: '导入',
        create: '新增',
        apply: '应用',
        canccel: '取消',
        refresh: '刷新',
        sortTip: '排序模式已开启',
        dataTitleCreate: '数据新增',
        dataTitleCreateFormat: '{0} - 新增',
        dataTitleModify: '数据编辑',
        dataTitleModifyFormat: '{0} - 编辑',
        dataTitleView: '数据详情',
        dataTitleViewFormat: '{0} - 明细',
        noSelectData: '没有选择数据',
        mainData: '主数据',
        detailData: '明细数据',
        failValidateForm: '表单验证失败', //NO
        saveSuccess: '保存成功', //NO
        deleteSuccess: '删除成功', //NO
        askTitleWarning: '警告',
        deleteWarning: '确定要删除【{0}】吗',
        dataRuleNullMsg: '{0}不能为空',
        deleteWarningWithDetail: '确定要删除【{0}】吗？删除以后明细也会清空',

    },
    'zh-TW': {
        validateErr:{
            empty:'{0} 不能为空',
            lengthBetween: '{0} 长度必须介于{1}和{2}之间'
        },
        placeHolder:{
            input:'请输入 {0}',
            select:'请选择',
        },
        mainData: '主数据',
        detailData: '明细数据',
        pageSize: '{0} 條/葉',
        login: '登陆',
        save: '保存',
        delete: '刪除',
        modify: '修改',
        import: '導入',
        create: '新增',
        apply: '應用',
        canccel: '取消',
        refresh: '刷新',
        sortTip: '排序模式已開啓',
        dataTitleCreate: '數據新增',
        dataTitleCreateFormat: '{0} - 新增',
        dataTitleModify: '數據編輯',
        dataTitleModifyFormat: '{0} - 編輯',
        dataTitleView: '數據詳情',
        dataTitleViewFormat: '{0} - 詳情',
        noSelectData: '沒有選擇數據',
        dataRuleNullMsg: '{0}不能為空',
    },
    'en-US': {
        validateErr:{
            empty:'{0} 不能为空',
            lengthBetween: '{0} 长度必须介于{1}和{2}之间'
        },
        placeHolder:{
            input:'please input {0}',
            select:'请选择',
        },
        mainData: 'mainData',
        detailData: 'detail',
        pageSize: '{0} / page',
        login: 'sign In',
        save: 'save',
        delete: 'delete',
        modify: 'edit',
        import: 'import',
        create: 'create',
        apply: 'apply',
        canccel: 'canccel',
        refresh: 'refresh',
        sortTip: 'sort status',
        dataTitleCreate: 'data create',
        dataTitleCreateFormat: '{0} - create',
        dataTitleModify: 'data modify',
        dataTitleModifyFormat: '{0} - modify',
        dataTitleView: 'data detail',
        dataTitleViewFormat: '{0} - detail',
        noSelectData: 'no select data',
       
    }
};

function hebing() {
    for (var item in customer) {
        system['zh-CN'][item] = customer[item]['zh-CN'];
        system['zh-TW'][item] = customer[item]['zh-TW'];
        system['en-US'][item] = customer[item]['en-US'];
        if (Object.getOwnPropertyNames(system['zh-TW'][item]).length === 0)
            system['zh-TW'][item] = customer[item]['zh-CN'];
        if (Object.getOwnPropertyNames(system['en-US'][item]).length === 0)
            system['en-US'][item] = customer[item]['zh-CN'];

    }
    return system;
}

export default hebing();