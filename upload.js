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

/*
 flag: 是否是多个文件上传
*/
const uploadFilePublic = function (ctx, files, flag) {
  const filePath = path.join(__dirname, "/static/upload/");
  let fileReader, fileResource, writeStream;

  const fileFunc = function (file) {
    // 读取文件流
    fileReader = fs.createReadStream(file.path);
    // 组装成绝对路径
    fileResource = filePath + `/${file.name}`;
    /*
       使用 createWriteStream 写入数据，然后使用管道流pipe拼接
      */
    writeStream = fs.createWriteStream(fileResource);
    fileReader.pipe(writeStream);
  };
  const returnFunc = function (flag) {
    console.log(flag);
    console.log(files);
    if (flag) {
      let url = "";
      for (let i = 0; i < files.length; i++) {
        url += uploadUrl + `/${files[i].name},`;
      }
      url = url.replace(/,$/gi, "");
      ctx.body = {
        url: url,
        code: 0,
        message: "上传成功",
      };
    } else {
      ctx.body = {
        url: uploadUrl + `/${files.name}`,
        code: 0,
        message: "上传成功",
      };
    }
  };
  if (flag) {
    // 多个文件上传
    for (let i = 0; i < files.length; i++) {
      const f1 = files[i];
      fileFunc(f1);
    }
  } else {
    fileFunc(files);
  }

  returnFunc(flag);
};

router.post("/upload", (ctx) => {
  let files = ctx.request.files.file;
  if (files.length === undefined) {
    // 上传单个文件，它不是数组，只是单个的对象
    uploadFilePublic(ctx, files, false);
  } else {
    uploadFilePublic(ctx, files, true);
  }
});

app.listen(3000, () => {
  console.log("启动成功");
});
