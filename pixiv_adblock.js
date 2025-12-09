var body = JSON.parse($response.body);

// 1. VIP 解锁功能 (保持全局生效)
if (body.response && body.response.user) {
    body.response.user.is_premium = true;
}
if (body.user) {
    body.user.is_premium = true;
}

// 2. 排序功能 (⚠️ 严格限制：仅在搜索页面生效)
// 只有当 URL 包含 "search/illust" 时才排序
// 主页 (illust/recommended) 会直接跳过，保持默认
if ($request.url.indexOf("search/illust") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    body.illusts.sort(function(a, b) {
        var countA = parseInt(a.total_bookmarks) || 0;
        var countB = parseInt(b.total_bookmarks) || 0;
        // 降序：收藏多的排前面
        return countB - countA;
    });
}

$done({ body: JSON.stringify(body) });
