import express from "express";
const routes = express.Router();
import multer from "multer";
import DesignerController from "../../controllers/designer.js";
import authentication from "../../middleware/authentication.js";

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

routes.post(
  "/",
  authentication.authMiddleware("designer"),
  upload.array("photos"),
  DesignerController.createProfile
);

routes.put(
  "/",
  authentication.authMiddleware("designer"),
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
  authentication.authMiddleware("designer"),
  DesignerController.signout
);

routes.get(
  "/account",
  authentication.authMiddleware("designer"),
  DesignerController.getAccount
);

routes.put(
  "/account",
  authentication.authMiddleware("designer"),
  upload.single("logo"),
  DesignerController.updateAccount
);

routes.delete(
  "/account",
  authentication.authMiddleware("designer"),
  DesignerController.deleteAccount
);

routes.post(
  "/verifyEmail",
  authentication.isAuthenticated,
  DesignerController.verifyEmail
);

export default routes;
