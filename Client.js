/**
 * Project:  Fetch
 * Filename: Client.js
 */

let Request = require("./Request").Request;
let Dispatcher = require("./Dispatcher").Dispatcher;

function Client() {
    // 请求队列
    let dispatcher = new Dispatcher();

    // 发送请求
    this.request = function (request) {
        if (!request instanceof Request || undefined == request || null == request) {
            throw "request muse be Request";
        }

        dispatcher.pushToQueue(request);
    };
}

exports.Client = Client;