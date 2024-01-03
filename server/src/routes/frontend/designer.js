import express from "express";
import path from "path";
import { dirname } from "../../app.js";
const routes = express.Router();

routes.get("/", (req, res) => {
  res.sendFile(path.join(dirname, "../../public", `designers.html`));
});

routes.get("/:id", (req, res) => {
  res.sendFile(path.join(dirname, "../../public", `designer.html`));
});

export default routes;
