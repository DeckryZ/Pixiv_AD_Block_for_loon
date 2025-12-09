/*
 * Pixiv Pro (Deep Filter Edition)
 * --------------------------------
 * 1. 搜索判断：检测 URL 是否包含 word=
 * 2. 双重过滤：x_restrict + Tags 扫描
 * 3. 纯净排序：Top 10 精华，无显数修改
 */

var body = JSON.parse($response.body);
var url = $request.url;

// VIP 功能 (保持不变)
if (body.response && body.response.user) {
    body.response.user.is_premium = true;
}
if (body.user) {
    body.user.is_premium = true;
}

// === 核心功能：仅在搜索时生效 ===
if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    
    // 1. R-18 过滤 (双重保险)
    // 检查 Loon 是否传入了开启参数
    if (typeof $argument !== "undefined" && $argument.indexOf("hide_r18=true") !== -1) {
        body.illusts = body.illusts.filter(function(item) {
            // 第一道防线：官方字段 x_restrict (1=R18, 2=R18G)
            if (item.x_restrict > 0) return false;

            // 第二道防线：遍历 Tags 抓漏
            if (item.tags && Array.isArray(item.tags)) {
                for (var i = 0; i < item.tags.length; i++) {
                    var tagName = item.tags[i].name;
                    if (tagName === "R-18" || tagName === "R-18G") {
                        return false; // 发现违禁标签，剔除
                    }
                }
            }
            // 通过安检
            return true;
        });
    }

    // 2. 排序 (按收藏量降序)
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    
    // 3. 切片 (只取前 10 张精华)
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
