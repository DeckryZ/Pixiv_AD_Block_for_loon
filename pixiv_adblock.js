/*
 * Pixiv Pro (User Input Edition - Final)
 * ------------------------------
 * 逻辑：接收 Loon 界面输入的 "t" 或 "f"，不依赖任何自动开关
 */

var body = JSON.parse($response.body);
var url = $request.url;

// === 核心：读取 UI 参数 ===
var hideR18 = false;
var inputArg = "";

if (typeof $argument !== "undefined") {
    // 强制转为字符串并去除首尾空格、引号
    inputArg = $argument.toString().trim().replace(/["']/g, "");
}

// 打印日志：让你在 Loon 日志里看到到底收到了什么
console.log("🛡️ [Pixiv] UI 输入内容: [" + inputArg + "]");

// 只要输入的是 t (不区分大小写)，就开启过滤
if (inputArg.toLowerCase() === "t") {
    hideR18 = true;
}

console.log("🛡️ [Pixiv] 当前模式: " + (hideR18 ? "🚫 隐藏R18 (开启)" : "✅ 显示R18 (默认)"));

// VIP 功能
if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

// 搜索排序逻辑 (只要 URL 包含 word= 且有图片列表)
if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    
    // R-18 过滤
    if (hideR18) {
        var beforeCount = body.illusts.length;
        body.illusts = body.illusts.filter(function(item) {
            // 查属性 x_restrict
            if (item.x_restrict > 0) return false;
            // 查标签 Tags
            if (item.tags) {
                for (var i = 0; i < item.tags.length; i++) {
                    if (item.tags[i].name.indexOf("R-18") !== -1) return false;
                }
            }
            return true;
        });
        console.log("✂️ 已过滤 R18 内容，剩余: " + body.illusts.length + "/" + beforeCount);
    }

    // 排序 (按收藏量降序)
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    
    // 切片 (Top 10)
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
