/*
 * Pixiv Pro (Response Handler)
 * ----------------------------
 * 功能：
 * 1. VIP 解锁
 * 2. 监测实际加载数量 (日志+弹窗)
 * 3. 搜索结果热度排序
 * 4. 只保留 Top 10
 */

var body = JSON.parse($response.body);
var url = $request.url;

// 1. VIP 解锁
if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

// 2. 搜索逻辑
if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    
    // === 📊 数量检测 ===
    var totalCount = body.illusts.length;
    console.log("📊 [Pixiv] 本次加载图片数量: " + totalCount);

    // 如果成功突破 30 张，发个弹窗庆祝一下 (防止刷屏，只有>30才弹)
    if (totalCount > 30) {
        $notification.post("Pixiv Pro", "请求增强成功", "服务器返回了 " + totalCount + " 张图片进行排序！");
    }

    // === 3. 排序 (按收藏量降序) ===
    body.illusts.sort(function(a, b) {
        var countA = parseInt(a.total_bookmarks) || 0;
        var countB = parseInt(b.total_bookmarks) || 0;
        return countB - countA;
    });
    
    // === 4. 切片 (只取前 10 张) ===
    // 即使拿到了 100 张，也只给你看最火的 10 张
    body.illusts = body.illusts.slice(0, 10);
}

$done({ body: JSON.stringify(body) });
