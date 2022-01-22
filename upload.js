const koa = require("koa");
const app = new koa();
const path = require("path");
const koaBody = require("koa-body");
const Router = require("koa-router");
const fs = require("fs");

const router = new Router();

/**使用koaBody中间件 */
app.use(
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      //   uploadDir: path.join(__dirname, "public/uploads"),
      // 保留文件扩展名
      keepExtensions: true,
      // 设置上传文件大小最大限制，默认2M
      maxFileSize: 200 * 1024 * 1024,
    },
  })
);

/**跨域 */
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (ctx.method == "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});

/**route */
app.use(router.routes());

const uploadUrl = "http://localhost:3000/static/upload";

router.post("/upload", (ctx) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件

  // 读取文件流
  const fileReader = fs.createReadStream(file.path);

  const filePath = path.join(__dirname, "/static/upload/");
  // 组装成绝对路径
  const fileResource = filePath + `/${file.name}`;

  /*
   使用 createWriteStream 写入数据，然后使用管道流pipe拼接
  */
  const writeStream = fs.createWriteStream(fileResource);

  // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个

  fileReader.pipe(writeStream);
  ctx.body = {
    url: uploadUrl + `/${file.name}`,
    code: 0,
    message: "上传成功",
  };
});

app.listen(3000, () => {
  console.log("启动成功");
});
