/**
 * Project:  Fetch
 * Filename: Test.js
 */

let Request = require("./Request").Request;
let Client = require("./Client").Client;
let fetch = require("node-fetch");

let one = new Request({
    "url": "http://www.google.com",
    "onSucceed": function (res) {
        console.log("网络请求成功");
        // console.log(res);
    },
    "onFailed": function (error) {
        console.log(error);
    },
    "shouldCache": true
});

let two = new Request({
    "url": "http://npm.taobao.org/package/node-fetch",
    "onSucceed": function (res) {
        console.log("网络请求成功");
        // console.log(res);
    },
    "onFailed": function (error) {
        console.log(error);
    }
});

let client = new Client();
for (let i = 0; i < 2; i ++) {
    client.request(one);
}
for (let i = 0; i < 2; i++) {
    client.request(two);
}