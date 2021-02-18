const Koa = require("koa");
const Router = require("koa-router");
const glob = require("glob");
const fs = require("fs");
const logger = require("koa-logger");
const cors = require("@koa/cors");
const { resolve } = require("path");

const app = new Koa();
const router = new Router({ prefix: "/api" });

/***
 * @fileUrl 请求的路径
 * @method  请求的方式
 * @defaultJson 默认显示的json数据
 * @callback 回调函数目的是，动态处理不同条件展示的json数据
 */
const mockConfig = (fileUrl, method, defaultJson, callback) => {
  glob.sync(resolve("./api", `${fileUrl}.json`)).forEach((item, i) => {
    let apiJsonPath = item && item.split("/api")[1];
    let apiPath = apiJsonPath.replace(".json", "");
    router[method || "get"](apiPath, (ctx, next) => {
      try {
        let finallJson = callback && callback(ctx);
        let changeFileUrl =
          finallJson && item && item.replace(defaultJson, finallJson);
        let jsonStr = fs.readFileSync(changeFileUrl || item).toString();
        ctx.body = {
          data: JSON.parse(jsonStr),
          state: 200,
          type: "success",
        };
      } catch (err) {
        ctx.throw("服务器错误", 500);
      }
    });
  });
};

// 注册路由
mockConfig("v1/one", "get", "one.json", (ctx) => {
  //获取get上的参数 ctx.query 直接就是处理好的对象
  const query = ctx.query;
  if (query.age == 2) {
    return "two.json";
  }
});

mockConfig("v2/one", "post", "one.json", (ctx) => {
  const query = ctx.query;
  if (query.name == "小米") {
    return "two.json";
  }
});

app.use(cors()).use(router.routes()).use(router.allowedMethods()).use(logger());
app.listen(3000);
