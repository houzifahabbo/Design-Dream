import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { DefaultAuthProvider } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import express from "express";
import OrderModel from "./db/models/order.js";
import OptionModel from "./db/models/option.js";
import UserModel from "./db/models/user.js";
import DesignerModel from "./db/models/designer.js";
import RatingModel from "./db/models/rating.js";
import PaymentModel from "./db/models/payment.js";
import accountModel from "./db/models/account.js";
import tokenModel from "./db/models/token.js";
import adminModel from "./db/models/admin.js";

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const startAdminJS = async () => {
  const app = express();
  const PORT = 3000;

  const resources = [
    OrderModel,
    OptionModel,
    UserModel,
    DesignerModel,
    RatingModel,
    PaymentModel,
    accountModel,
    tokenModel,
    adminModel,
  ];

  const adminOptions = {
    resources: resources.map((resource) => ({
      resource,
      options: {},
    })),
  };
  const admin = new AdminJS(adminOptions);

  const authenticate = async ({ email, password }, ctx) => {
    const admin = await adminModel.findOne({ email });
    if (admin) {
      const account = await accountModel.findOne({ user: admin.id });
      if (account) {
        const isMatch = await account.comparePassword(password);
        if (isMatch) {
          return admin.toJSON();
        }
      }
    }
    return null;
  };

  const authProvider = new DefaultAuthProvider({
    authenticate,
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      cookieName: "AdminJS",
      cookiePassword: "Secret",
      provider: authProvider,
    },
    null,
    {
      secret: "test",
      resave: true,
      saveUninitialized: true,
      secret: "Secret",
      name: "adminjs",
    }
  );

  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(
      `Listening on port ${PORT}, AdminJS server started on URL: http://localhost:${PORT}${admin.options.rootPath}`
    );
  });
};

export default startAdminJS;
