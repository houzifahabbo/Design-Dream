const express = require("express");
const routes = express.Router();
const multer = require("multer");
const DesignerController = require("../controllers/designer");
const authentication = require("../middleware/authentication");

const storage = multer.memoryStorage(
  { limits: { files: 10, fileSize: 16 * 1024 * 1024 } },
  {
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      if (!filetypes.test(path.extname(file.originalname).toLowerCase())) {
        return cb(new Error("Only image files are allowed!"));
      }
      cb(null, true);
    },
  }
);
const upload = multer({ storage: storage });

// routes.post(
//   "/test",
//   authentication.authMiddleware,
//   authentication.isDesigner,
//   upload.array("photos"),
//   DesignerController.test
// );

routes.post(
  "/",
  authentication.authMiddleware,
  authentication.isDesigner,
  upload.array("photos"),
  DesignerController.editProfile
);

routes.get("/", DesignerController.getDesigners);

routes.get("/:DesignerName", DesignerController.getDesignerByName);

routes.post(
  "/signin",
  authentication.isAuthenticated,
  DesignerController.signin
);

routes.post(
  "/signup",
  authentication.isAuthenticated,
  upload.single("logo"),
  DesignerController.signup
);

routes.post(
  "/signout",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.signout
);

routes.get(
  "/account",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.getAccount
);

routes.put(
  "/account",
  authentication.authMiddleware,
  authentication.isDesigner,
  upload.single("logo"),
  DesignerController.updateAccount
);

routes.delete(
  "/account",
  authentication.authMiddleware,
  authentication.isDesigner,
  DesignerController.deleteAccount
);

routes.get("/:DesignerId/events", DesignerController.getDesignerEvents);
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
