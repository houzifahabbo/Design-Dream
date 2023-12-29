const express = require("express");
const routes = express.Router();
const userController = require("../controllers/user");
const authentication = require("../middleware/authentication");
const passport = require("../utils/googleAuth");
const googleCallbackMiddleware = require("../middleware/googleAuth");

routes.post("/signin", authentication.isAuthenticated, userController.signin);
routes.post("/signup", authentication.isAuthenticated, userController.signup);
routes.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/user.birthday.read",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
      "https://www.googleapis.com/auth/user.gender.read",
    ],
  })
);
routes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallbackMiddleware
);
// Get user by ID
routes.put("/", authentication.authMiddleware, userController.updateAccount);
routes.delete("/", authentication.authMiddleware, userController.deleteAccount);
routes.post("/signout", authentication.authMiddleware, userController.signout);
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

// routes.post(
//   "/verifyEmail",
//   authentication.isAuthenticated,
//   userController.verifyEmail
// );

module.exports = routes;
