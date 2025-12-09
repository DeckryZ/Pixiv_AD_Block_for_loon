/*
 * Pixiv Pro (Top 10 Essence)
 * ----------------------
 * 功能：VIP 解锁 + 搜索结果热度排序 + 只显示前 10 张
 */

var body = JSON.parse($response.body);
var url = $request.url;

// 1. VIP 解锁
if (body.response && body.response.user) {
    body.response.user.is_premium = true;
}
if (body.user) {
    body.user.is_premium = true;
}

// 2. 搜索排序 (仅在搜索且有图片时生效)
if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    
    // 按收藏量降序排列 (大的在前)
    body.illusts.sort(function(a, b) {
        var countA = parseInt(a.total_bookmarks) || 0;
        var countB = parseInt(b.total_bookmarks) || 0;
        return countB - countA;
    });
    
    // ✅ 恢复切片：只保留前 10 张精华
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
