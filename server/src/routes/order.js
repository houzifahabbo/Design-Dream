const express = require("express");
const routes = express.Router();
const orderController = require("../controllers/order");
const authentication = require("../middleware/authentication");

// Get all orders
routes.get("/", authentication.authMiddleware, orderController.getOrders);

// Create an order (authentication required)
routes.post(
  "/",
  authentication.authMiddleware,
  authentication.isUser,
  orderController.createOrder
);

// Get order by ID
routes.get("/:id", orderController.getOrderById);

// Update order by ID
routes.put("/:id", orderController.updateOrder);

// Delete order by ID
routes.delete("/:id", orderController.deleteOrder);

module.exports = routes;
