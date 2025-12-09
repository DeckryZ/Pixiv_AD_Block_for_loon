var body = JSON.parse($response.body);

// 原有 VIP 功能
if (body.response && body.response.user) {
    body.response.user.is_premium = true;
}

if (body.user) {
    body.user.is_premium = true;
}

// 新增功能：仅搜索页生效，按收藏排序，只取前10
if ($request.url.indexOf("search/illust") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    // 1. 排序
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    
    // 2. 只保留前10张
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
