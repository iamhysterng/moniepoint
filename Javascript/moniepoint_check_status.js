// 确保响应是成功的并且内容类型是 HTML
if ($response.status === 200) {
    // 获取响应体
    let body = $response.body;

    // 使用正则表达式替换目标内容
    body = body.replace('❌ 未开启 Moniepoint 模块 ❌', '✅ 已开启 Moniepoint 模块 ✅');

    // 返回修改后的响应体
    $done({ body: body });
} else {
    // 如果响应不符合条件，保持原样
    $done({});
}