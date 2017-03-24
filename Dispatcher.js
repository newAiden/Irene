/**
 * Project:  Fetch
 * Filename: Dispatcher.js
 */
let fetch = require("node-fetch");

function Dispatcher() {
    // 缓存队列
    const cacheQueue = [];
    // 请求队列
    const requestQueue = [];
    // 是否正在请求
    let isRequesting = false;
    // 每次查找队列的时间间隔
    const FIND_TIME_GAP = 100;

    /*
     循环整个队列，每个FIND_TIME_GAP获取一下request
     由于nodejs好像没有阻塞队列，先通过这种方式实现
     这里默认同一时刻只能进行一次网络请求，如果有多个request，会一直等待
     */
    setInterval(function () {
        if (isRequesting) {
            return;
        }

        const request = requestQueue.shift();

        // 如果没有request，则直接返回
        if (null == request || undefined == request) {
            return;
        }

        if (!isRequesting) {
            doRequest(request);
        }
    }, FIND_TIME_GAP);

    this.pushToQueue = function (request) {
        requestQueue.push(request);
    };

    // 将Request加入到请求队列
    const doRequest = function (request) {
        isRequesting = true;

        let response = findResponse(request.url, request.method);
        if (null != response) {
            if (null != request.onSucceed && undefined != request.onSucceed) {
                request.onSucceed(response);
            }
            isRequesting = false;
            return;
        }

        //noinspection JSUnresolvedFunction
        fetch(request.url,
            {method: request.method, body: request.body, headers: request.headers})
        // 如果直接返回res，再onSucceed函数读取body，会被当成是一个异步的操作。
        // 所以在这里直接返回res的body
            .then(function (res) {
                return res.text();
            })
            .then(function (res) {
                if (null != request.onSucceed && undefined != request.onSucceed) {
                    request.onSucceed(res);
                }
                if (request.shouldCache) {
                    cacheQueue.push({
                        "url": request.url,
                        "response": res,
                        "method": request.method
                    });
                }
                isRequesting = false;
            })
            .catch(function (error) {
                if (null != request.onFailed && undefined != request.onFailed) {
                    request.onFailed(error);
                }
                isRequesting = false;
            });
    };

    // 查找在缓存中是否有该请求
    const findResponse = function (url, method) {
        for (let i = 0; i < cacheQueue.length; i++) {
            if (cacheQueue[i].url == url && cacheQueue[i].method == method) {
                return cacheQueue[i].response;
            }
        }
        return null;
    }
}

exports.Dispatcher = Dispatcher;