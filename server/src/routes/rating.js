const express = require("express");
const routes = express.Router();
const authentication = require("../middleware/authentication");
const RatingController = require("../controllers/rating");

routes.get("/:DesignerId", RatingController.getRatings);

routes.get("/:ratingId", RatingController.getRating);

routes.post(
  "/:DesignerId",
  authentication.authMiddleware("user"),
  RatingController.addRating
);

routes.put(
  "/:ratingId",
  authentication.authMiddleware("user"),
  RatingController.updateRating
);

routes.delete(
  "/:ratingId",
  authentication.authMiddleware("user"),
  RatingController.deleteRating
);

routes.post(
  "/reply/:ratingId",
  authentication.authMiddleware,
  RatingController.addReply
);

routes.delete(
  "/reply/:ratingId",
  authentication.authMiddleware,
  RatingController.deleteReply
);

routes.put(
  "/reply/:ratingId",
  authentication.authMiddleware,
  RatingController.editReply
);

module.exports = routes;
