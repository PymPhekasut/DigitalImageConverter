import bodyParser from "koa-bodyparser";
import Koa from "koa";
import Router from "koa-router";
import render from "koa-ejs";
import * as path from "path";

const app = new Koa();
render(app, {
  root: path.join(__dirname, "/"),
  layout: "index",
  viewExt: "html",
  cache: false,
  debug: true,
});
const router = new Router();

router.get("/", getAddImage);

//extract data into 2D array
//create 2D arary with a grayscale
//save to .png

async function getAddImage(ctx: Koa.ParameterizedContext) {
  try {
    ctx.body = await addImage();
  } catch (error) {
    console.log(error);
    ctx.status = error.status;
    ctx.body = { status: error.message };
  }
}

async function addImage() {
  try {
    const img: HTMLImageElement = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/image1.jpg";

    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };

    const grayScale = function () {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; //red
        data[i + 1] = avg; //green
        data[i + 2] = avg; //blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    // const fileImageOne = path.join(__dirname, "image1.png");
    // const firstImage = Buffer.from(fs.readFileSync(fileImageOne)).toString(
    //   "base64"
    // )
  } catch (error) {
    console.log(error);
  }
}

const PORT = 3000;

app.use(bodyParser());
//app.use(router.routes());
app.use(async function (ctx) {
  await ctx.render("index");
});

app.listen(PORT, async () => {
  console.log(`Server is listening on ${PORT}`);
});
