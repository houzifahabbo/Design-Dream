import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import apiRoutes from "./routes/backend/index.js";
import frontendRoutes from "./routes/frontend/index.js";
// import startAdminJS from "./adminApp.js";
import "./db/connection.js";
const port = process.env.NODE_LOCAL_PORT || 5000;
const app = express();
const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);
dotenv.config();

const middleware = [
  cookieParser(),
  bodyParser.urlencoded({
    extended: false,
  }),
  express.json(),
];


middleware.forEach((item) => {
  app.use(item);
});

app.get("/test", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});
app.use("/api", apiRoutes);

app.use("/", frontendRoutes);


if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// startAdminJS();

export { app, dirname };
