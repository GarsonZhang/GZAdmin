import axiosProvider from './axios';
// axiosProvider.init();
const _ajaxRemote = axiosProvider._getRemote();

const ajax = {
    get(pageContext, url, data) {

        var id = pageContext.$route.meta.id;

        var config = {
            headers: {
                'fid': id,
                'client': 'pc'
            },
            params: data
        };
        return _ajaxRemote.get(url, config);
    },
    post(pageContext, url, data, param) {
        var id = pageContext.$route.meta.id;
        var config = {
            headers: {
                'fid': id,
                'client': 'pc'
            },
            params: param
        };
        return _ajaxRemote.post(url, data, config);
    }
};

//模块请求类
export const requestModule = {
    list(context) {
        return ajax.get(context, '/module/list');
    },
    get(context, rowID) {
        return ajax.get(context, '/module/get', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, '/module/create', data);
    },
    update(context, data) {
        return ajax.post(context, '/module/update', data);
    },
    updateBatch(context, datas) {
        return ajax.post(context, '/module/updatebatch', datas);
    },
    delete(context, rowID) {
        return ajax.get(context, '/module/delete', {
            rowID
        });
    }
};
//模块功能请求类
export const requestForm = {
    list(context, moduleID) {
        return ajax.get(context, '/moduleform/list', {
            moduleID
        });
    },
    get(context, rowID) {
        return ajax.get(context, '/moduleform/get', {
            rowID
        });
    },
    actions(context, rowID) {
        return ajax.get(context, '/moduleform/actions', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, '/moduleform/create', data);
    },
    update(context, data) {
        return ajax.post(context, '/moduleform/update', data);
    },
    updateBatch(context, datas) {
        return ajax.post(context, '/moduleform/updatebatch', datas);
    },
    delete(context, rowID) {
        return ajax.get(context, '/moduleform/delete', {
            rowID
        });
    }
};
export const requestFormAuthorize = {
    list(context, formID) {
        return ajax.get(context, '/moduleformauthorize/list', {
            formID
        });
    },
    get(context, rowID) {
        return ajax.get(context, '/moduleformauthorize/get', {
            rowID
        });
    },
    delete(context, rowID) {
        // debugger
        return ajax.get(context, '/moduleformauthorize/delete', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, '/moduleformauthorize/create', data);
    },
    update(context, data) {
        return ajax.post(context, '/moduleformauthorize/update', data);
    }
};
export const system = {
    getMenu(context) {
        return ajax.get(context, '/menu/all');
    },
    getMenuTree(context, objectID) {
        return ajax.get(context, '/authorize/formTree', {
            objectID
        });
    },
    updateAuthorize(context, category, objectID, data) {
        // debugger;
        return ajax.post(context, '/authorize/update', {
            category,
            objectID,
            data
        });
    }
};
export const ReqCommonDataCompany = {
    list(context) {
        return ajax.get(context, '/company/list');
    },
    cache: [],
    // treeData(context) {
    //     return ajax.get(context, '/company/treedata');
    // },
    search(context, code) {
        //var tag='/company/search'+code;
        return ajax.get(context, '/company/search', {
            code: code
        });
    },
    get(context, rowID) {
        return ajax.get(context, '/company/get', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, '/company/create', data);
    },
    delete(context, rowid) {
        return ajax.get(context, '/company/delete', {
            rowID: rowid
        });
    },
    update(context, data) {
        return ajax.post(context, '/company/update', data);
    }
};
export const requestCommonDataDept = {
    list(context, companyID) {
        return ajax.get(context, '/dept/list', {
            companyID
        });
    },
    treeData(context) {
        return ajax.get(context, '/dept/treedata');
    },
    search(context, companyID, code) {
        return ajax.get(context, '/dept/search', {
            companyID,
            code: code
        });
    },
    get(context, rowID) {
        return ajax.get(context, '/dept/get', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, '/dept/create', data);
    },
    delete(context, rowID) {
        return ajax.get(context, '/dept/delete', {
            rowID
        });
    },
    update(context, data) {
        return ajax.post(context, '/dept/update', data);
    }
};
export const requestCommonDataPosition = {
    list(context, companyID) {
        return ajax.get(context, '/position/list', {
            companyID
        });
    },
    treeData(context) {
        return ajax.get(context, '/position/treedata');
    },
    search(context, companyID, code) {
        return ajax.get(context, '/position/search', {
            companyID,
            code: code
        });
    },
    get(context, rowID) {
        return ajax.get(context, '/position/get', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, '/position/create', data);
    },
    delete(context, rowID) {
        return ajax.get(context, '/position/delete', {
            rowID
        });
    },
    update(context, data) {
        return ajax.post(context, '/position/update', data);
    }
};
export const requestUser = {
    list(context, pageIndex, pageSize) {
        return ajax.get(context, '/user/list', {
            pageSize,
            pageIndex
        });
    },
    get(context, rowID) {
        return ajax.get(context, '/user/get', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, '/user/create', data);

    },
    delete(context, rowID) {
        return ajax.get(context, '/user/delete', {
            rowID
        });
    },
    update(context, data) {
        // debugger
        return ajax.post(context, '/user/update', data);
    },
    login(context, account, pwd) {
        return ajax.get(context, '/user/login', {
            account: account,
            pwd: pwd
        });
    },
    logout(context) {
        return ajax.get(context, '/user/logout');
    }
};
export const requestAPIList = {
    list(context, pageIndex, pageSize, filter) {
        return ajax.get(context, '/apilist/list', {
            pageIndex,
            pageSize,
            filter
        });
    },
    import (context) {
        return ajax.get(context, '/apilist/import');
    },
    get(context, rowID) {
        return ajax.get(context, '/apilist/get', {
            rowID
        });
    },
    update(context, data) {
        return ajax.post(context, '/apilist/update', data);
    },
    delete(context, rowID) {
        return ajax.get(context, '/apilist/delete', {
            rowID
        });
    }
};
export const requestUserRelation = {
    list(context, objectID) {
        return ajax.get(context, '/userrelation/list', {
            objectID
        });
    },
    userList(context, objectID, companyID) {
        return ajax.get(context, '/userrelation/listByCompanyID', {
            objectID,
            companyID
        });
    },
    update(context, objectID, category, data) {
        return ajax.post(context, 'userrelation/update', data, {
            objectID,
            category
        });
    }
};

export const requestOsapCommonDict = {
    list(context) {
        return ajax.get(context, 'SAPCommonDicMain/list');
    },
    mainDelete(context, rowID) {
        return ajax.get(context, 'SAPCommonDicMain/delete', {
            rowID
        });
    },
    mainGet(context, rowID) {
        return ajax.get(context, 'SAPCommonDicMain/get', {
            rowID
        });
    },
    mainCreate(context, data) {
        return ajax.post(context, 'SAPCommonDicMain/create', data);
    },
    mainUpdate(context, data) {
        return ajax.post(context, 'SAPCommonDicMain/update', data);
    },
    mainUpdateBatch(context, data) {
        // debugger
        return ajax.post(context, 'SAPCommonDicMain/updateSort', data);
    },
    detailList(context, mainID) {
        return ajax.get(context, 'SAPCommonDicDetail/list', {
            mainID
        });
    },
    detailGet(context, rowID) {
        return ajax.get(context, 'SAPCommonDicDetail/get', {
            rowID
        });
    },
    detailDelete(context, rowID) {
        return ajax.get(context, 'SAPCommonDicDetail/delete', {
            rowID
        });
    },
    detailCreate(context, data) {
        return ajax.post(context, 'SAPCommonDicDetail/create', data);
    },
    detailUpdate(context, data) {
        return ajax.post(context, 'SAPCommonDicDetail/update', data);
    },
    detailUpdateBatch(context, mainID, data) {
        // debugger
        return ajax.post(context, 'SAPCommonDicDetail/updateSort', data, {
            mainID
        });
    },
};
export const requestOsapWXConfig = {
    data(context) {
        return ajax.get(context, 'wxconfig/data');
    },
    update(context, data) {
        return ajax.post(context, 'wxconfig/update', data);
    }
};
export const requestOsapCommonDataDict = {
    dataModule(context) {
        return ajax.get(context, 'CommonDictMain/dataModule');
    },
    dataMonitorType(context) {
        return ajax.get(context, 'CommonDictMain/dataMonitorType');
    },

    list(context) {
        return ajax.get(context, 'CommonDictMain/list');
    },
    mainDelete(context, rowID) {
        return ajax.get(context, 'CommonDictMain/delete', {
            rowID
        });
    },
    mainGet(context, rowID) {
        return ajax.get(context, 'CommonDictMain/get', {
            rowID
        });
    },
    mainCreate(context, data) {
        return ajax.post(context, 'CommonDictMain/create', data);
    },
    mainUpdate(context, data) {
        return ajax.post(context, 'CommonDictMain/update', data);
    },
    mainUpdateBatch(context, data) {
        // debugger
        return ajax.post(context, 'CommonDictMain/updateSort', data);
    },
    detailList(context, mainID) {
        return ajax.get(context, 'CommonDictDetail/list', {
            mainID
        });
    },
    detailGet(context, rowID) {
        return ajax.get(context, 'CommonDictDetail/get', {
            rowID
        });
    },
    detailDelete(context, rowID) {
        return ajax.get(context, 'CommonDictDetail/delete', {
            rowID
        });
    },
    detailCreate(context, data) {
        return ajax.post(context, 'CommonDictDetail/create', data);
    },
    detailUpdate(context, data) {
        return ajax.post(context, 'CommonDictDetail/update', data);
    },
    detailUpdateBatch(context, mainID, data) {
        // debugger
        return ajax.post(context, 'CommonDictDetail/updateSort', data, {
            mainID
        });
    },
};
export const requestOsapMonitorItem = {
    list(context) {
        return ajax.get(context, 'MonitorItem/list');
    },
    get(context, rowID) {
        return ajax.get(context, 'MonitorItem/get', {
            rowID
        });
    },
    create(context, data) {
        return ajax.post(context, 'MonitorItem/create', data);
    },
    update(context, data) {
        return ajax.post(context, 'MonitorItem/update', data);
    },
    delete(context, rowID) {
        return ajax.get(context, 'MonitorItem/delete', {
            rowID
        });
    }
};

export const requestOsapMonitorItemUserCfg = {
    list(context,userID) {
        return ajax.get(context, 'MonitorITemUserReciveCfg/list',{userID});
    },
    get(context,rowID){
        return ajax.get(context, 'MonitorITemUserReciveCfg/get',{rowID});
    },
    delete(context,rowID){
        return ajax.get(context, 'MonitorITemUserReciveCfg/delete',{rowID});
    },
    create(context,data){
        return ajax.post(context, 'MonitorITemUserReciveCfg/create',data);
    },
    update(context,data){
        return ajax.post(context, 'MonitorITemUserReciveCfg/update',data);
    },
    getMonitorItemKeyDatas(context,monitorItemID){
        return ajax.get(context, 'MonitorITemUserReciveCfg/getMonitorItemKeyDatas',{monitorItemID});
    }
};
// export {
//     requestModule,
//     requestForm,
//     requestFormAuthorize,
//     system,
//     ReqCommonDataCompany,
//     requestCommonDataDept,
//     requestCommonDataPosition,
//     requestUser,
//     requestAPIList,
//     requestUserRelation,
//     requestOsapCommonDict,
//     requestOsapWXConfig,
//     requestOsapCommonDataDict
// };