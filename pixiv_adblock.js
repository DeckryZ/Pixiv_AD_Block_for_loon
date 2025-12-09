/*
 * Pixiv Pro (Debug & Robust Filter)
 * --------------------------------
 * 1. 增加控制台日志，用于排查传参问题
 * 2. 增强参数解析逻辑
 * 3. 增强 R-18 过滤逻辑
 */

var body = JSON.parse($response.body);
var url = $request.url;

// === 1. 强力参数解析 & 日志 ===
var hideR18 = false;
var argStr = (typeof $argument !== "undefined") ? $argument : "无参数";

// 打印日志：请在 Loon -> 仪表盘 -> 日志 中搜索 "Pixiv" 查看
console.log("🔍 [Pixiv] 脚本启动，当前参数: " + argStr);

if (typeof $argument !== "undefined") {
    // 兼容各种写法: hide_r18=true, hide_r18 = true, "true"
    if (/hide_r18\s*=\s*true/.test($argument) || $argument === "true") {
        hideR18 = true;
    }
}
console.log("🛡️ [Pixiv] R-18 过滤开关状态: " + (hideR18 ? "开启 ✅" : "关闭 ❌"));

// VIP 功能
if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

// === 核心逻辑 ===
if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    
    var originalCount = body.illusts.length;

    // 2. 过滤逻辑
    if (hideR18) {
        body.illusts = body.illusts.filter(function(item) {
            // A. 查户口 (官方字段)
            if (item.x_restrict > 0) return false;
            // B. 查标签 (只要包含 R-18 字样就杀)
            if (item.tags && Array.isArray(item.tags)) {
                for (var i = 0; i < item.tags.length; i++) {
                    var tagName = item.tags[i].name;
                    // 使用 indexOf 模糊匹配，杀掉 R-18, R-18G, R-18...
                    if (tagName.indexOf("R-18") !== -1) {
                        return false; 
                    }
                }
            }
            return true;
        });
        console.log("✂️ [Pixiv] 过滤后剩余: " + body.illusts.length + " / " + originalCount);
    }

    // 3. 排序 (按收藏量降序)
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    
    // 4. 切片 (只取前 10 张)
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
