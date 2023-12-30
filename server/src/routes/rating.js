import express from "express";
const routes = express.Router();
import authentication from "../middleware/authentication.js";
import RatingController from "../controllers/rating.js";

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
  authentication.authMiddleware("designer"),
  RatingController.addReply
);

routes.delete(
  "/reply/:ratingId",
  authentication.authMiddleware("designer"),
  RatingController.deleteReply
);

routes.put(
  "/reply/:ratingId",
  authentication.authMiddleware("designer"),
  RatingController.editReply
);

export default routes;
