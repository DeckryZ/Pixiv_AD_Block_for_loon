

var body = JSON.parse($response.body);
var url = $request.url;

// VIP 功能 (保持不变)
if (body.response && body.response.user) {
    body.response.user.is_premium = true;
}
if (body.user) {
    body.user.is_premium = true;
}

// === 核心修复：更稳健的搜索判断 ===
// 逻辑：只要 URL 里包含 "word="，说明这是带关键词的搜索请求
// 这样能完美覆盖第 2 页、第 N 页以及各种复杂的过滤条件
if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    
    // 1. R-18 过滤 (可选，如果不传参则不触发)
    // 只有当 Loon 插件里开了开关，这里才会生效
    if (typeof $argument !== "undefined" && $argument.indexOf("hide_r18=true") !== -1) {
        body.illusts = body.illusts.filter(function(item) {
            return item.x_restrict === 0;
        });
    }

    // 2. 排序 (按收藏量)
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    
    // 3. 切片 (只取前 10 张)
    // 如果你在第二页看到只有 10 张图，说明脚本生效了
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
