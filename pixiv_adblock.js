/*
 * Pixiv Pro (Persistent Store 版)
 * ------------------------------
 * 直接读取 Loon 的存储设置，绕过参数传递 Bug
 */

var body = JSON.parse($response.body);
var url = $request.url;

// === 核心修改：从持久化存储读取开关 ===
// 这里的 key "R18Switch" 必须和插件配置里的变量名一致
var hideR18 = false;
var switchValue = $persistentStore.read("R18Switch");

// 打印日志方便调试
console.log("🔍 [Pixiv] 读取开关状态: " + switchValue);

// 兼容字符串 "true" 和布尔值 true
if (switchValue === "true" || switchValue === true) {
    hideR18 = true;
}

// VIP 功能 (保持不变)
if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

// 搜索排序逻辑
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

    // 排序
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    
    // 切片 (Top 10)
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
