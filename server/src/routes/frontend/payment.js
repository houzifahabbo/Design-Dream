import express from "express";
const routes = express.Router();
import paymentController from "../../controllers/payment.js";
import authentication from "../../middleware/authentication.js";

routes.get(
  "/account",
  authentication.authMiddleware("designer"),
  paymentController.getaccount
);
routes.post(
  "/account",
  authentication.authMiddleware("designer"),
  paymentController.accountSetup
);

routes.get(
  "/success",
  authentication.authMiddleware("user"),
  paymentController.success
);
routes.get(
  "/cancel",
  authentication.authMiddleware("user"),
  paymentController.cancel
);
routes.post(
  "/checkout/:designerId/:orderId",
  authentication.authMiddleware("user"),
  paymentController.checkout
);

routes.get("/test", (req, res) => {
  res.sendFile("/TEST.html", { root: "./" });
});

export default routes;
