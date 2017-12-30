let jsonSearch = {
};


jsonSearch.test1 = function (id) {
    var json = [
        { 'id': 1, 'name': 't1' },
        { 'id': 2, 'name': 't2' },
        { 'id': 3, 'name': 't3' },
        { 'id': 4, 'name': 't4' },
        { 'id': 5, 'name': 't5' },
        { 'id': 6, 'name': 't6' },
        { 'id': 7, 'name': 't7' }
    ];

    var v = this.search(json, null, p => p.id === id);
    return v;
};

jsonSearch.test2 = function (id) {
    var json = [
        { 'id': 1, 'name': 't1', children: { 'id': 11, 'name': 'c1' } },
        { 'id': 2, 'name': 't2', children: { 'id': 12, 'name': 'c2' } },
        { 'id': 3, 'name': 't3', children: { 'id': 13, 'name': 'c3' } },
        { 'id': 4, 'name': 't4', children: { 'id': 14, 'name': 'c4' } },
        { 'id': 5, 'name': 't5', children: { 'id': 15, 'name': 'c5' } },
        { 'id': 6, 'name': 't6', children: { 'id': 16, 'name': 'c6' } },
        { 'id': 7, 'name': 't7', children: { 'id': 17, 'name': 'c7' } },
    ];

    var v = this.search(json, 'children', p => p.id === id);
    return v;
};
jsonSearch.test3 = function (id) {
    var json = [
        { 'id': 1, 'name': 't1', children: [{ 'id': 11, 'name': 'c1' }, { 'id': 12, 'name': 'c1-2' }] },
        { 'id': 2, 'name': 't2', children: [{ 'id': 21, 'name': 'c2' }, { 'id': 22, 'name': 'c2-2' }] },
        { 'id': 3, 'name': 't3', children: [{ 'id': 31, 'name': 'c3' }, { 'id': 32, 'name': 'c3-2' }] },
        { 'id': 4, 'name': 't4', children: [{ 'id': 41, 'name': 'c4' }, { 'id': 42, 'name': 'c4-2' }] },
        { 'id': 5, 'name': 't5', children: [{ 'id': 51, 'name': 'c5' }, { 'id': 52, 'name': 'c5-2' }] },
        { 'id': 6, 'name': 't6', children: [{ 'id': 61, 'name': 'c6' }, { 'id': 62, 'name': 'c6-2' }] },
        { 'id': 7, 'name': 't7', children: [{ 'id': 71, 'name': 'c7' }, { 'id': 72, 'name': 'c7-2' }] },
    ];

    var v = this.search(json, 'children', p => p.id === id);
    return v;
};

jsonSearch.test4 = function (id) {
    var json = { 'id': 1, 'name': 't1', children: { 'id': 11, 'name': 'c1' } };
    // debugger
    var v = this.search(json, 'children', p => {
        return p.id === id;
    });
    return v;
};

jsonSearch.test5 = function (id) {
    var json = { 'id': 1, 'name': 't1', children: [{ 'id': 11, 'name': 'c1' }, { 'id': 12, 'name': 'c1-2' }] };

    var v = this.search(json, 'children', p => p.id === id);
    return v;
};

jsonSearch.test6 = function (id) {
    var json = { 'id': 1, 'name': 't1', children: [{ 'id': 11, 'name': 'c1', children: { 'id': 111, 'name': '111' } }, { 'id': 12, 'name': 'c1-2', 'children': [{ 'id': 121, 'name': '121' }, { 'id': 122, 'name': '122', 'children': { 'id': 1221, 'name': '1221' } }] }] };

    var v = this.search(json, 'children', p => p.id === id);
    return v;
};

jsonSearch.typeOf = function (obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
};


jsonSearch.search = function (objData, childKey, filter) {
    //判断是Array还是Object
    const t = this.typeOf(objData);
    // console.log(t);
    if (t === 'array') {
        for (var i = 0; i < objData.length; i++) {
            if (filter(objData[i])) return objData[i];
            else {
                var v = this._searchJson(objData[i], childKey, filter);
                if (v) return v;
            }
        }
    } else if (t === 'object') {

        if (filter(objData)) return objData;
        else {
            // console.log('obj.childern');
            var c = this._searchJson(objData, childKey, filter);
            if (c) return c;
        }
    }
    return null;

};


jsonSearch._searchJson = function (objdata, childKey, filter) {
    //1.第一层 root 深度遍历整个JSON
    var childrendata = objdata[childKey];
    if (!childrendata) return null;
    const t = this.typeOf(childrendata);
    // console.log(t);
    switch (t) {
        case 'array': {
            for (var i = 0; i < childrendata.length; i++) {
                var obj = childrendata[i];
                //2.有节点就开始找，一直递归下去
                if (filter(obj)) {
                    //找到了与nodeId匹配的节点，结束递归
                    // debugger;
                    obj.parentNode = objdata;
                    return obj;
                } else {
                    if (childKey) {
                        //3.如果有子节点就开始找
                        var v = this._searchJson(obj, childKey, filter);
                        if (v) {
                            obj.parentNode = objdata;
                            return v;
                        }
                    }
                }
            }
        } break;
        case 'object': {
            if (filter(childrendata)) {
                //找到了与nodeId匹配的节点，结束递归
                childrendata.parentNode = objdata;
                return childrendata;
            } else {
                if (childKey) {
                    //3.如果有子节点就开始找
                    var c = this._searchJson(childrendata, childKey, filter);
                    if (c) {
                        c.parentNode = objdata;
                        return c;
                    }
                }
            }
        } break;
    }
    return null;
};

export default jsonSearch;