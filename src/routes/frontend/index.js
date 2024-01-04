import express from "express";
import userRoutes from "./user.js";
import designerRoutes from "./designer.js";
import paymentRoutes from "./payment.js";
import orderRoutes from "./order.js";
import ratingRoutes from "./rating.js";
import { dirname } from "../../app.js";
import path from "path";
import passport from "../../utils/googleAuth.js";
import googleCallbackMiddleware from "../../middleware/googleAuth.js";
import authentication from "../../middleware/authentication.js";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.sendFile(path.join(dirname, "../public", `index.html`));
});

routes.get("/signin", authentication.isAuthenticated, (req, res) => {
  res.sendFile(path.join(dirname, "../public", `signin.html`));
});

routes.get("/signup", authentication.isAuthenticated, (req, res) => {
  res.sendFile(path.join(dirname, "../public", `signup.html`));
});

routes.get("/about-us", (req, res) => {
  res.sendFile(path.join(dirname, "../public", `about-us.html`));
});
routes.get("/contact", (req, res) => {
  res.sendFile(path.join(dirname, "../public", `contact.html`));
});

routes.get(
  "/google",
  authentication.isAuthenticated,
  passport.authenticate("google", {
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ],
  })
);

routes.get(
  "/google/callback",
  authentication.isAuthenticated,
  passport.authenticate("google", {
    session: false,
  }),
  googleCallbackMiddleware
);

routes.use("/user", userRoutes);
routes.use("/designer", designerRoutes);
routes.use("/payment", paymentRoutes);
routes.use("/order", orderRoutes);
routes.use("/rating", ratingRoutes);

export default routes;
