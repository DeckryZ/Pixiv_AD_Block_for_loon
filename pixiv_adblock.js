var body = JSON.parse($response.body);

if (body.response && body.response.user) {
    body.response.user.is_premium = true;
}

if (body.user) {
    body.user.is_premium = true;
}

$done({ body: JSON.stringify(body) });
