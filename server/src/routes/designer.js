const express = require("express");
const routes = express.Router();
const multer = require("multer");
const DesignerModel = require("../db/models/designer");
const DesignerController = require("../controllers/designer");
const authentication = require("../middleware/authentication");

// const url = "mongodb://localhost:27017/arch";
// const storage = new GridFsStorage({
//   url,
//   file: (req, file) => {
//     console.log(file);
//     //If it is an image, save to photos bucket
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       return {
//         bucketName: "photos",
//         filename: `${Date.now()}_${file.originalname}`,
//       };
//     } else {
//       //Otherwise save to default bucket
//       return `${Date.now()}_${file.originalname}`;
//     }
//   },
// });

// const upload = multer({ storage });

const storage = multer.memoryStorage(); // Configuring multer to use memory storage
const upload = multer({ storage: storage });

routes.get("/test", async (req, res) => {
  res.json(await DesignerModel.find({}));
});

// routes.get('/', DesignerController.getDesigners);
// routes.post('/', DesignerController.createDesigner);

// New routes for designer functionalities related to events

// Create an account (designer)
routes.post(
  "/signup",
  authentication.isAuthenticated,
  upload.single("logo"),
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
  "/signout",
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
  "/",
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
