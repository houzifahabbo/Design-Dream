const express = require("express");

const routes = express.Router();
const userRoutes = require("./user");
const eventsRoutes = require("./event");
const DesignerRoutes = require("./designer");
const paymentRoutes = require("./payment");
const adminRoutes = require("./admin");
const orderRoutes = require("./order");

routes.use("/user", userRoutes);
routes.use("/events", eventsRoutes);
routes.use("/designer", DesignerRoutes);
routes.use("/payment", paymentRoutes);
routes.use("/admin", adminRoutes);
routes.use("/order", orderRoutes);

module.exports = routes;
