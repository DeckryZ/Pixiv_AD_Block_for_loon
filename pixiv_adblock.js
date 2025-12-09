var body = JSON.parse($response.body);
var url = $request.url;

if (body.response && body.response.user) body.response.user.is_premium = true;
if (body.user) body.user.is_premium = true;

if (url.indexOf("word=") !== -1 && body.illusts && Array.isArray(body.illusts)) {
    body.illusts.sort(function(a, b) {
        return (parseInt(b.total_bookmarks) || 0) - (parseInt(a.total_bookmarks) || 0);
    });
    body.illusts = body.illusts.slice(0, 2);
}

$done({ body: JSON.stringify(body) });
