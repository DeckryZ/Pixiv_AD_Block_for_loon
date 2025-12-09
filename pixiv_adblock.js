/*
 * Pixiv Pro (Final Argument Fix)
 * ------------------------------
 * 适配 Loon 标准 Argument 传参逻辑
 */

var body = JSON.parse($response.body);
var url = $request.url;

// === 关键修改：直接判断 argument 是否等于字符串 "true" ===
// Loon 的 switch 参数开启时会传入 "true"，关闭时传入 "false"
var hideR18 = false;
if (typeof $argument !== "undefined" && $argument === "true") {
    hideR18 = true;
}

// 调试日志 (可选，确认是否生效)
console.log("🛡️ [Pixiv] R-18 Filter: " + hideR18 + " (Arg: " + $argument + ")");

// VIP 功能
if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

// 搜索逻辑
if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    
    // R-18 过滤
    if (hideR18) {
        body.illusts = body.illusts.filter(function(item) {
            // 查属性
            if (item.x_restrict > 0) return false;
            // 查标签
            if (item.tags) {
                for (var i = 0; i < item.tags.length; i++) {
                    if (item.tags[i].name.indexOf("R-18") !== -1) return false;
                }
            }
            return true;
        });
    }

    // 排序 (按收藏量)
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    
    // 切片 (Top 10)
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
