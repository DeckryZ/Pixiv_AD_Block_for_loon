/*
 * Pixiv Pro (Smart Next & Detection)
 * ------------------------------
 * 1. 自动检测并打印实际获取的图片数量
 * 2. 修改下一页链接 (next_url)，尝试索要 100 张
 * 3. 排序并保留 Top 10
 */

var body = JSON.parse($response.body);
var url = $request.url;

// 1. VIP 解锁
if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

// 2. 搜索逻辑
if (url.indexOf("word=") !== -1) {

    // === 📊 探针：检测拿到了多少张 ===
    var count = 0;
    if (body.illusts && Array.isArray(body.illusts)) {
        count = body.illusts.length;
        // 打印到 Loon 日志
        console.log("📊 [Pixiv检测] 本次实际获取: " + count + " 张");
        
        if (count > 30) {
            console.log("🎉 [Pixiv检测] 成功突破限制！服务器返回了 " + count + " 张！");
        }
    }

    // === 😈 注入：修改下一页请求 ===
    // 逻辑：保持 offset 不变 (别跳页)，但是追加 limit=100 (多拿点)
    if (body.next_url) {
        if (body.next_url.indexOf("limit=") === -1) {
             body.next_url += "&limit=100";
        } else {
             body.next_url = body.next_url.replace(/limit=\d+/, "limit=100");
        }
        // 打印修改后的下一页链接，确认 offset 没乱跑
        console.log("🔗 [Pixiv翻页] 下一页目标: " + body.next_url);
    }

    // 3. 排序与切片
    if (body.illusts && Array.isArray(body.illusts)) {
        body.illusts.sort(function(a, b) {
            return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
        });
        
        // 切片 Top 10
        body.illusts = body.illusts.slice(0, 10);
    }
}

$done({ body: JSON.stringify(body) });
