import express from "express";

const routes = express.Router();
import paymentController from "../controllers/payment.js";
import authentication from "../middleware/authentication.js";

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

export default routes;
