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
//   
//   upload.array("photos"),
//   DesignerController.test
// );

routes.post(
  "/",
  authentication.authMiddleware,
  upload.array("photos"),
  DesignerController.createProfile
);

routes.put(
  "/",
  authentication.authMiddleware,
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
  DesignerController.signout
);

routes.get(
  "/account",
  authentication.authMiddleware,
  DesignerController.getAccount
);

routes.put(
  "/account",
  authentication.authMiddleware,
  upload.single("logo"),
  DesignerController.updateAccount
);

routes.delete(
  "/account",
  authentication.authMiddleware,
  DesignerController.deleteAccount
);

module.exports = routes;