/**
 * Project:  Fetch
 * Filename: Request.js
 */
function Request(map) {

    // 默认的网络请求是GET
    const DEFAULT_METHOD = "GET";

    if (null == map || undefined == map) {
        throw "map must not be null";
    }

    this.url = map.url;
    this.headers = map.headers;
    this.data = map.data;
    if (undefined != map.method && null != map.method) {
        this.method = map.method;
    } else {
        this.method = DEFAULT_METHOD;
    }
    this.onSucceed = map.onSucceed;
    this.onFailed = map.onFailed;
    this.shouldCache = map.shouldCache;
}

exports.Request = Request;