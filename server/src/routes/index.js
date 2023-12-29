const express = require("express");

const routes = express.Router();
const userRoutes = require("./user");
const designerRoutes = require("./designer");
const paymentRoutes = require("./payment");
const adminRoutes = require("./admin");
const orderRoutes = require("./order");
const ratingRoutes = require("./rating");

routes.use("/user", userRoutes);
routes.use("/designer", designerRoutes);
routes.use("/payment", paymentRoutes);
routes.use("/admin", adminRoutes);
routes.use("/order", orderRoutes);
routes.use("/rating", ratingRoutes);
module.exports = routes;
