import axios from 'axios';
import env from '../config/env';
import Routers from '../router';
import menuData from '../data/menu.js'
import Promise from 'Promise';
import axiosProvider from './axios'
import jsonSearch from './jsonSearch'
import md5 from './md5'

let util = {

};


util.jsonSearch = jsonSearch;

util.md5 = function (str) {
	return md5.hex_md5(str);
};

util.title = function (title) {
	title = title ? title + ' - Home' : 'iView project';
	window.document.title = title;
};

// util.searchJsonFromArray = function (arrayData, childKey, filter) {
// 	for (var i = 0; i < arrayData.length; i++) {
// 		var v = this.searchJsonEx(arrayData[i], childKey, filter);
// 		if (v)
// 			return v;
// 	}
// };

// util.searchJsonEx = function (objdata, childKey, filter) {
// 	var node;
// 	//1.第一层 root 深度遍历整个JSON
// 	var jsondata = objdata[childKey];
// 	if (!jsondata) return null;
// 	for (var i = 0; i < jsondata.length; i++) {
// 		var obj = jsondata[i];
// 		//2.有节点就开始找，一直递归下去
// 		if (filter(obj)) {
// 			//找到了与nodeId匹配的节点，结束递归
// 			// debugger;
// 			obj.parentNode = objdata;
// 			return obj;
// 		} else {

// 			if (childKey) {
// 				//3.如果有子节点就开始找
// 				if (obj[childKey] && obj[childKey].length > 0) {
// 					//4.递归前，记录当前节点，作为parent 父亲
// 					//递归往下找
// 					var v = this.searchJsonEx(obj, childKey, filter);
// 					if (v) {
// 						obj.parentNode=objdata;
// 						return v;
// 					}
// 				}
// 			}
// 		}
// 	}
// };
util.searchJsonIndex = function (jsondata, filter) {
	for (var i = 0; i < jsondata.length; i++) {
		var obj = jsondata[i];
		if (filter(obj)) {
			return i;
		}
	}
	return -1;
};
util.searchObserver = function (data, childKey, filter) {
	let selectionIndexes = [];
	for (let i in data) {
		var obj = data[i];
		if (filter(obj)) {
			return obj;
		}
		if (childKey && obj[childKey]) {
			this.searchObserver(obj[childKey], childKey, filter);
		}
	}
}

util.convertRouteMap = function (menuData) {

	var _route = [];
	//var route = this.searchJson(_route, null, item => item.name === "home");
	menuData.forEach(function (module) {

		var menuModule = {
			name: module.name,
			meta: {
				title: module.text,
				title_tw:module.text_tw,
				title_en:module.text_en,
				title_other:module.text_other
			},
			path: '/authority' + module.name,
			component: getPromisedComponent(module.componentPath, module.componentName),
			children: []
		};

		module.items.forEach(function (item) {
			menuModule.children.push({
				name: item.name,
				path: item.routeName,
				meta: {
					title: item.text,
					title_tw:item.text_tw,
					title_en:item.text_en,
					title_other:item.text_other,
					id:item.id
				},
				component: getPromisedComponent(item.componentPath, item.componentName)
			});
		})

		_route.push(menuModule);

	});
	function getPromisedComponent(module, url) {
		return function (resolve, reject) {
			if (module === "components")
				require(["../components/" + url], resolve)
			else if (module === "views") {
				require(["../views/" + url], resolve)
			}
		}
	}

	return _route
};
const ajaxUrl = env === 'development' ?
	window.location.origin :
	env === 'production' ?
		window.location.origin :
		window.location.origin;

util.ajax = axios.create({
	baseURL: ajaxUrl,
	timeout: 10000
});


util.ajaxRemote = axiosProvider._getRemote();



util.deepCopy = function (obj) {
	if (typeof obj != 'object') {
		return obj;
	}
	var newobj = {};
	for (var attr in obj) {
		newobj[attr] = this.deepCopy(obj[attr]);
	}
	return newobj;
};


util.typeOf = function (obj) {
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

util.deepCopyEx = function (data) {
	const t = this.typeOf(data);
	let o;
	if (t === 'array') {
		o = [];
	} else if (t === 'object') {
		o = {};
	} else {
		return data;
	}
	if (t === 'array') {
		for (let i = 0; i < data.length; i++) {
			o.push(this.deepCopy(data[i]));
		}
	} else if (t === 'object') {
		for (let i in data) {
			o[i] = this.deepCopy(data[i]);
		}
	}
	return o;
};

util.isNULL = function (obj) {
	var v = obj === null || obj === undefined || obj.length < 1;
	return v;
}

export default util;