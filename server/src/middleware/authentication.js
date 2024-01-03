import jwt from "jsonwebtoken";
import DesignerModel from "../db/models/designer.js";
import UserModel from "../db/models/user.js";
import path from "path";

const isAdminMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      // Verify and decode the JWT token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Assuming your JWT payload contains a field 'isAdmin' to indicate if the user is an admin
      if (decodedToken.isAdmin) {
        // The user is an admin, so allow access to the route
        req.user = decodedToken; // Attach the decoded user object to the request for later use if needed
        return next();
      }
    } catch (err) {
      // If there's an error while verifying the token, deny access
      res.status(403).json({ message: "Access denied" });
    }
  }

  // The user is not an admin or the token is missing/expired, so deny access
  res.status(403).json({ message: "Access denied" });
};

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    if (
      req.path.includes("/signin") ||
      req.path.includes("/signup") ||
      req.path.includes("/forgotPassword") ||
      req.path.includes("/resetPassword")
    ) {
      // return res.redirect(`${process.env.DOMAIN}/api-docs`);
      return res.redirect(process.env.DOMAIN);
    }
  }
  next();
};

const authMiddleware = (role) => {
  return async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      let userOrDesigner;

      if (role === "user") {
        userOrDesigner = await UserModel.findById(decodedToken.id);
      } else if (role === "designer") {
        userOrDesigner = await DesignerModel.findById(decodedToken.id);
      } else if (role === "userOrDesigner") {
        userOrDesigner = await UserModel.findById(decodedToken.id);
        role = "user";
        if (!userOrDesigner) {
          userOrDesigner = await DesignerModel.findById(decodedToken.id);
          role = "designer";
        }
      }

      if (role && !userOrDesigner) {
        return res.status(403).send("Forbidden");
      }

      req[role] = userOrDesigner;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
};

export default {
  isAdminMiddleware,
  isAuthenticated,
  authMiddleware,
};
