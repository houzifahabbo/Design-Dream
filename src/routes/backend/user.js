import express from "express";
const routes = express.Router();
import userController from "../../controllers/user.js";
import authentication from "../../middleware/authentication.js";
import passport from "../../utils/googleAuth.js";
import googleCallbackMiddleware from "../../middleware/googleAuth.js";

routes.post("/signin", authentication.isAuthenticated, userController.signin);
routes.post("/signup", authentication.isAuthenticated, userController.signup);

routes.put(
  "/",
  authentication.authMiddleware("user"),
  userController.updateAccount
);
routes.delete(
  "/",
  authentication.authMiddleware("user"),
  userController.deleteAccount
);
routes.post(
  "/signout",
  authentication.authMiddleware("user"),
  userController.signout
);
routes.get("/", userController.getUserByUsername);
routes.post(
  "/forgotPassword",
  authentication.isAuthenticated,
  userController.forgotPassword
);
routes.put(
  "/resetPassword",
  authentication.isAuthenticated,
  userController.resetPassword
);

routes.post(
  "/verifyEmail",
  authentication.isAuthenticated,
  userController.verifyEmail
);

export default routes;
