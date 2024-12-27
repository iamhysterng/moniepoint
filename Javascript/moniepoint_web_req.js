let req = $request;

// 如果请求方法是 OPTIONS，直接保持请求原样
if (req.method === "OPTIONS") {
    $done({}); // 不修改，直接返回原请求
} else {
    // 修改请求地址和方法
    req.url = "https://moniepoint.argun.cc/test";

    // 返回修改后的请求
    $done(req);
}