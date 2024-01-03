import express from "express";
const routes = express.Router();
import orderController from "../../controllers/order.js";
import authentication from "../../middleware/authentication.js";

// Get all orders
routes.get(
  "/",
  authentication.authMiddleware("userOrDesigner"),
  orderController.getOrders
);

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
