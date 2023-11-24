const express = require("express");

const routes = express.Router();
const DesignerController = require("../controllers/designer");
const authentication = require("../middleware/authentication");

// routes.get('/', DesignerController.getDesigners);
// routes.post('/', DesignerController.createDesigner);

// New routes for designer functionalities related to events

// Create an account (designer)
routes.post(
  "/signup",
  authentication.isAuthenticated,
  DesignerController.createAccount
);

// Signin to the designer account
routes.post(
  "/signin",
  authentication.isAuthenticated,
  DesignerController.signin
);

// Sign out from designer account
routes.post(
  "/signOut",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.signout
);

// PUBLIC Get designer by ID
routes.get("/:DesignerId", DesignerController.getDesignerById);

// PUBLIC Get all events created by the designer
routes.get("/:DesignerId/events", DesignerController.getDesignerEvents);

// Update designer details
routes.put(
  "/updateAccount",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.updateAccount
);

// Delete designer account
routes.delete(
  "/",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.deleteAccount
);

// Create an event for the designer
routes.post(
  "/createEvent",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.createEvent
);

// Update an event created by the designer
routes.put(
  "/events/:eventId",
  authentication.authMiddleware,
  authentication.isDesigner,
  authentication.isEventOwner,
  DesignerController.updateEvent
);

// Delete an event created by the designer
routes.delete(
  "/events/:eventId",
  authentication.authMiddleware,
  authentication.isDesigner,
  authentication.isEventOwner,
  DesignerController.deleteEvent
);

// PUBLIC Get users attending the designer's events
routes.get(
  "/:DesignerId/attending-users",
  DesignerController.getAttendingUsersOfOrgEvents
);

// Notify users attending the designer's events
routes.post(
  "/notify-attending-users",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.notifyAttendingUsers
);

// Notify users attending the designer's events about event changes
routes.post(
  "/:eventId/notify-event-changes",
  authentication.authMiddleware,
  authentication.isDesigner,
  authentication.isEventOwner,
  DesignerController.notifyEventChanges
);

// Filter events by category, location and dates
routes.get(
  "/events/filter",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.filterEvents
);

// Search for events
routes.get(
  "/events/search",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.searchEvents
);

// POST route to add a rating for an designer
routes.post(
  "/rate/:DesignerId",
  authentication.authMiddleware,
  DesignerController.addRating
);

// GET route to get ratings for an designer
routes.get("/rating/:DesignerId", DesignerController.getRatings);

module.exports = routes;
