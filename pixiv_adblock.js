/*
 * Pixiv Response: Clean & Sort
 * ----------------------------
 * 1. 清洗 next_url (防止翻页带回 iOS 标记)
 * 2. VIP 解锁
 * 3. 搜索结果 Top 10 排序
 */

var body = JSON.parse($response.body);
var url = $request.url;

// 1. VIP 解锁
if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

// 2. 搜索逻辑
if (url.indexOf("word=") !== -1) {

    // === 🧹 清洗 next_url ===
    if (body.next_url) {
        // 确保下一页链接里没有 filter=for_ios
        if (body.next_url.indexOf("filter=for_ios") !== -1) {
            body.next_url = body.next_url.replace(/&?filter=for_ios/, "");
        }
    }

    // 3. 排序与切片
    if (body.illusts && Array.isArray(body.illusts)) {
        // 按收藏量降序
        body.illusts.sort(function(a, b) {
            return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
        });
        
        // 只取前 10 张精华
        body.illusts = body.illusts.slice(0, 10);
    }
}

$done({ body: JSON.stringify(body) });
