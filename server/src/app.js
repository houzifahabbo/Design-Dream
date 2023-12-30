import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import apiRoutes from "./routes/index.js";
import "./db/connection.js";
import startAdminJS from "./adminApp.js";

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
  express.static(path.join(dirname, "../../client")),
];

middleware.forEach((item) => {
  app.use(item);
});

app.use("/", apiRoutes);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startAdminJS();

export default app;
