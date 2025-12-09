var body = JSON.parse($response.body);
var url = $request.url;

if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });

    var count = 2;
    if (body.illusts.length > 2) {
        var standard = parseInt(body.illusts[1].total_bookmarks) || 0;
        var limit = standard * 0.7;
        
        for (var i = 2; i < 5 && i < body.illusts.length; i++) {
            var current = parseInt(body.illusts[i].total_bookmarks) || 0;
            if (current >= limit) {
                count++;
            } else {
                break;
            }
        }
    }
    body.illusts = body.illusts.slice(0, count);
}

$done({ body: JSON.stringify(body) });
