const express = require("express");

const routes = express.Router();
const adminController = require("../controllers/admin");
const authentication = require("../middleware/authentication");

// Admin-only route example
routes.get(
  "/admin-only",
  authentication.isAdminMiddleware,
  adminController.adminOnlyRoute
);

routes.get(
  "/users",
  authentication.isAdminMiddleware,
  adminController.getAllUsers
);

routes.get(
  "/users/:userId",
  authentication.isAdminMiddleware,
  adminController.getUserById
);

// Routes for managing users (admin privilege)
routes.delete(
  "/users/:userId",
  authentication.isAdminMiddleware,
  adminController.deleteUserById
);
routes.put(
  "/users/:userId",
  authentication.isAdminMiddleware,
  adminController.updateUserById
);

// Routes for managing Designers (admin privilege)
routes.get(
  "/Designers",
  authentication.isAdminMiddleware,
  adminController.getAllDesigners
);
routes.get(
  "/Designers/:DesignerId",
  authentication.isAdminMiddleware,
  adminController.getDesignerById
);
routes.post(
  "/Designers",
  authentication.isAdminMiddleware,
  adminController.createDesigner
);
routes.put(
  "/Designers/:DesignerId",
  authentication.isAdminMiddleware,
  adminController.updateDesignerById
);
routes.delete(
  "/Designers/:DesignerId",
  authentication.isAdminMiddleware,
  adminController.deleteDesignerById
);

// Routes for managing events (admin privilege)
routes.get(
  "/events",
  authentication.isAdminMiddleware,
  adminController.getAllEvents
);
routes.get(
  "/events/:eventId",
  authentication.isAdminMiddleware,
  adminController.getEventById
);
routes.post(
  "/events",
  authentication.isAdminMiddleware,
  adminController.createEvent
);
routes.put(
  "/events/:eventId",
  authentication.isAdminMiddleware,
  adminController.updateEventById
);
routes.delete(
  "/events/:eventId",
  authentication.isAdminMiddleware,
  adminController.deleteEventById
);

module.exports = routes;
