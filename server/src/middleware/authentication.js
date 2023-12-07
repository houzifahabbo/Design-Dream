const jwt = require("jsonwebtoken");
const DesignerModel = require("../db/models/designer");
const EventModel = require("../db/models/order");

//TODO: CHECK IF isUser is needed or not
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
      return res.json({ message: "You are already logged in" });
    }
  }
  next();
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Attach the user to the request object for later uses
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// The `authMiddleware` function is used to protect routes that require authentication.
// By using this middleware, you can ensure that only authorized users can access these routes.

// IMPORTANT!!
// The `authMiddleware` function is assigning req.user to the user object.
// IMPORTANT!!

const isDesigner = async (req, res, next) => {
  const { user } = req;
  try {
    const designer = await DesignerModel.findById(user.id);
    if (!designer) {
      return res.status(403).send("Forbidden");
    }
    req.designer = designer;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const isUser = async (req, res, next) => {
  const { user } = req;
  try {
    const user = await UserModel.findById(user.id);
    if (!user) {
      return res.status(403).send("Forbidden");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// isDesigner is a middleware function that checks if the user is an designer.
// this function should be used after the authMiddleware function.
// means that the user is already authenticated but checks if it's an designer.

// IMPORTANT!!
// The `isDesigner` function is assigning req.designer to the designer object.
// IMPORTANT!!

// now we have access to the designer object after verifying the designer
// and user now we can check its the owner of the event
const isEventOwner = async (req, res, next) => {
  const { designer } = req;
  const { eventId } = req.params;
  try {
    const event = await EventModel.findById(eventId);
    if (!event) {
      res.status(403).send("couldnt find event");
    }
    if (event && event.organizer.equals(designer.id)) {
      // designer is the owner of the event
      req.eventId = eventId;
      next();
    } else {
      // designer is not the owner of the event
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

// isEventOwner is a middleware function that checks if the designer is the owner of the event. :)
// this function should be used after the authMiddleware and isDesigner functions.
// means that the user is already authenticated and is an designer but checks if it's the owner of the event.

// IMPORTANT!!
// The `isEventOwner` function is assigning req.eventId to the eventId.
// IMPORTANT!!

module.exports = {
  isAdminMiddleware,
  authMiddleware,
  isDesigner,
  isEventOwner,
  isAuthenticated,
};
