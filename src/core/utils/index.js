var _undefined = window.undefined;


export function isPromise(value) {
    if (value !== null && typeof value === 'object') {
        return value.promise && typeof value.promise.then === 'function';
    }
}

export function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

export function getLocalStorage(name) {
    var value = window.localStorage.getItem(name);
    if (value) {
        return JSON.parse(value);
    }
    return null;
}


export function setLocalStorage(name, value) {
    if (value) {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(name, value);
}


export function toQueryParam(paramObject) {
    paramObject = paramObject || {};
    var keys = Object.getOwnPropertyNames(paramObject) || [];

    var paramArray = keys.map(function (key, i) {
        var value = paramObject[key];
        return key + "=" + encodeURIComponent(value);
    });

    if (paramArray && paramArray.length > 0) {
        return "?" + paramArray.join("&");
    }

    return "";
}


/**
 * 对于文章来说,唯一确定一篇文章有两种方法:
 * 1.文章表中的id字段
 * 2.userId + guid 共同确定(同一时刻用户只能在一个终端登录,guid并且是根据时间生成,再随机,所以guid是安全的)
 * @returns {string}
 */
export function createUUID() {
    var randomStr = 'xxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return randomStr + new Date().getTime();
}


//export function getStaticURL(p){
//  return "http://image.coolpeng.cn/static/" + p;
//}

export function getDataFromImmutableOrPlain(obj, key) {
    if (!obj) {
        return null;
    }
    var value = _undefined;
    if (isFunction(obj.get)) {
        value = obj.get(key);
    }
    if (value === _undefined) {
        value = obj[key];
    }

    return value;
}

/**
 * a = {
 *   b:{
 *      c:{
 *          d:1
 *      }
 *   }
 * }
 *
 * str : b.c.d
 * @param obj
 * @param str
 * @demo :
 *  var d = getObjectValue(a,'b.c.d');
 */
export function getObjValueInPath(obj, str) {
    try {
        var propArr = str.split(".");
        var tmpObj = obj;
        var i = 0;
        while (i < propArr.length) {
            if (!tmpObj) {
                return null;
            }
            var prop = propArr[i];
            tmpObj = getDataFromImmutableOrPlain(tmpObj, prop);
            i++;
        }
        return tmpObj;
    } catch (e) {
        console.log('[ERROR]', e);
    }

    return null;
}

export function isFunction(x) {
    return Object.prototype.toString.call(x) === '[object Function]';
}

export function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
}

export function shallowEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
        if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }

    return true;
}


export function isAdmin(u) {
    if (!u) {
        return false;
    }
    if (u.permission === 'admin') {
        return true;
    }
    if (u.userInfo && u.userInfo.permission === 'admin') {
        return true
    }
    return false;
}


export function displayControl(isDisplay, component) {
    if (isDisplay) {
        return component;
    }
    return null;
}

var loadStaticCache = {};
export function loadStaticJS(url, callback) {

    if (loadStaticCache[url]) {
        callback();
        return;
    }

    var script = document.createElement("script");
    script.src = url;
    script.type = 'text/javascript';
    script.language = 'javascript';
    script.onload = script.onreadstatechange = function () {
        callback();
        loadStaticCache[url] = true;
    };
    document.getElementsByTagName("body")[0].appendChild(script);
}


export function loadStaticCSS(url, callback) {

    if (loadStaticCache[url]) {
        callback();
        return;
    }

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.onload = link.onreadstatechange = function () {
        callback();
        loadStaticCache[url] = true;
    };
    document.getElementsByTagName("head")[0].appendChild(link);
}


export function immutableListMap(itemList, callback) {
    var resultList = [];
    if (itemList) {
        itemList.forEach(function (item, i) {
            resultList.push(callback(item, i));
        });
    }
    return resultList;
}


export function className(obj) {
    var arr = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value === true) {
                arr.push(key);
            }
        }
    }
    return arr.join(' ');
}

export function globalVar(key,value){
    window['COOLPENG_TEMP_VAR'] = window['COOLPENG_TEMP_VAR'] || {};
    if(value!=undefined){
        window['COOLPENG_TEMP_VAR'][key] = value;
    }
    return window['COOLPENG_TEMP_VAR'][key];
}