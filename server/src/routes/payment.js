const express = require("express");

const routes = express.Router();
const paymentController = require("../controllers/payment");
const authentication = require("../middleware/authentication");

routes.get(
  "/success",
  authentication.authMiddleware,
  paymentController.success
);
routes.get("/cancel", authentication.authMiddleware, paymentController.cancel);
routes.post(
  "/checkout",
  authentication.authMiddleware,
  paymentController.checkout
);
routes.get("/", authentication.authMiddleware, paymentController.getpayments);
routes.get(
  "/:id",
  authentication.authMiddleware,
  paymentController.getpaymentById
);

module.exports = routes;
