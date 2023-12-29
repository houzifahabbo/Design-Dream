const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const apiRoutes = require("./routes/index");
require("./db/connection");
require("dotenv").config();
const path = require("path");
const port = process.env.NODE_LOCAL_PORT || 5000;
const app = express();

const middleware = [
  cookieParser(),
  bodyParser.urlencoded({
    extended: false,
  }),
  express.json(),
  express.static(path.join(__dirname, "../../client")),
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


module.exports = app;


  //Todo: edit package.json, remove the comments and remove unnecessary dependencies
