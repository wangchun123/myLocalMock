###

启动步骤 
1.下载 node
2.npm i
3.npm i -g nodemon
4.nodemon app.js

###

操作流程 
1.打开 app.js 
2.简单的 get 请求例如:mockConfig("v1/one")配置完，直接访问可以看到数据127.0.0.1:3000/api/v1/one
3.负责的get 请求配置例如：mockConfig("v1/one", "get", "one.json", (ctx) => {
  //获取get上的参数 ctx.query 直接就是处理好的对象
  const query = ctx.query;
  if (query.age == 2) {
    return "two.json";
  }
});
当请求的参数age等于2时给前端返回two.json数据,此时访问地址可以看到数据127.0.0.1:3000/api/v1/one?age=2&name='小王'
4.post请求同上是一样的，app.js里面有样例。

####
目的

我们可以在本地mock数据
