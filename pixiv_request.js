/*
 * Pixiv Request: Ultimate Web Disguise (Dynamic + UserID)
 * -----------------------------------
 * 1. 动态提取搜索关键词 -> Referer
 * 2. 伪装 UA, Language
 * 3. 补全 Web 端特有的 x-user-id
 * 4. 彻底移除 App 标识
 */

var url = $request.url;
var headers = $request.headers;
var modifiedHeaders = headers;

// 仅针对搜索接口
if (url.indexOf("search/illust") !== -1) {
    
    console.log("🕵️ [伪装] 开始执行深度 Web 伪装 (含ID)...");

    // === 1. 动态提取搜索词 ===
    var keyword = "artworks"; 
    var wordMatch = url.match(/[?&]word=([^&]+)/);
    if (wordMatch && wordMatch[1]) {
        keyword = wordMatch[1];
    }

    // === 2. URL 净化 ===
    if (url.indexOf("filter=for_ios") !== -1) {
        url = url.replace(/&?filter=for_ios/, "");
        console.log("✂️ [URL] 已移除 iOS 过滤标记");
    }

    // === 3. Headers 深度补全 ===
    
    // A. User-Agent (Firefox)
    var webUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0";
    modifiedHeaders["User-Agent"] = webUA;
    modifiedHeaders["user-agent"] = webUA;

    // B. Referer (动态)
    var webReferer = "https://www.pixiv.net/tags/" + keyword + "/artworks?s_mode=s_tag";
    modifiedHeaders["Referer"] = webReferer;
    modifiedHeaders["referer"] = webReferer;

    // C. Accept-Language (Web)
    var webLang = "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2";
    modifiedHeaders["Accept-Language"] = webLang;
    modifiedHeaders["accept-language"] = webLang;

    // D. ✅ 补全 x-user-id (Web 端特有)
    // 根据你提供的抓包数据，你的 ID 是 33499707
    // 如果以后换号了，记得来这里改
    modifiedHeaders["x-user-id"] = "33499707";

    // E. 销毁 App 身份指纹
    var keysToDelete = ["app-os", "app-version", "App-Os", "App-Version", "x-client-time", "x-client-hash"];
    for (var i = 0; i < keysToDelete.length; i++) {
        delete modifiedHeaders[keysToDelete[i]];
    }

    console.log("🎭 [Headers] 已添加 x-user-id 并完成伪装");
}

$done({ url: url, headers: modifiedHeaders });
