/*
 * Pixiv Request Injector
 * ----------------------
 * 功能：检测 URL，如果没写 limit，就强制加上 &limit=100
 */

var url = $request.url;

if (url.indexOf("search/illust") !== -1) {
    // 打印原始 URL 方便对比
    console.log("🔍 [请求前] URL: " + url);

    // 1. 如果本来就有 limit (比如翻页时)，把它改成 100
    if (url.indexOf("limit=") !== -1) {
        url = url.replace(/limit=\d+/, "limit=100");
    } 
    // 2. 如果根本没有 limit (这就是你现在的情况)，直接追加
    else {
        // 检查 URL 里有没有问号，有问号就加 &，没问号就加 ?
        var separator = url.indexOf("?") !== -1 ? "&" : "?";
        url += separator + "limit=100";
    }

    console.log("🚀 [请求后] 已注入: " + url);
}

$done({ url: url });
