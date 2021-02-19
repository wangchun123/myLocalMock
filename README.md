### 启动步骤

1.下载 node 2.npm i 3.npm i -g nodemon 4.nodemon app.js

### 操作流程

1.打开 app.js 2.简单的 get 请求例如:mockConfig("v1/one")配置完，直接访问可以看到数据 127.0.0.1:3000/api/v1/one 3.复杂的 get 请求配置例如：mockConfig("v1/one", "get", "one.json", (ctx) => {
//获取 get 上的参数 ctx.query 直接就是处理好的对象
const query = ctx.query;
if (query.age == 2) {
return "two.json";
}
});
当请求的参数 age 等于 2 时给前端返回 two.json 数据,此时访问地址可以看到数据 127.0.0.1:3000/api/v1/one?age=2&name='小王'
4.post 请求同上是一样的，app.js 里面有样例。

#### 目的

我们可以在本地 mock 数据
