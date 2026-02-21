import express from "express";
const routes = express.Router();
import orderController from "../../controllers/order.js";
import authentication from "../../middleware/authentication.js";
import { dirname } from "../../app.js";
import path from "path";
// Get all orders
routes.get("/", authentication.authMiddleware("userOrDesigner"), (req, res) => {
  res.sendFile(path.join(dirname, "../public", `orders.html`));
});

// Create an order (authentication required)
routes.post(
  "/",
  authentication.authMiddleware("user"),
  orderController.createOrder
);

// Get order by ID
routes.get(
  "/:id",
  authentication.authMiddleware("userOrDesigner"),
  orderController.getOrderById
);

// Update order by ID
routes.put(
  "/:id",
  authentication.authMiddleware("userOrDesigner"),
  orderController.updateOrder
);

export default routes;
