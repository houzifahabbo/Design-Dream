import UserModel from "../db/models/user.js";
import AccountModel from "../db/models/account.js";
import TokenModel from "../db/models/token.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import resetPasswordTemplate from "../emailTemplates/resetPassword.js";
import welcomeTemplate from "../emailTemplates/welcome.js";
const userController = {};

const generateJWT = (user, jwtExp) => {
  return jwt.sign(
    {
      id: user.id,
      exp: jwtExp,
      iat: Math.floor(Date.now() / 1000), // Issued at date
    },
    process.env.JWT_SECRET
  );
};

const checkErorrCode = (err, res) => {
  if (err.code === 11000) {
    return res.status(400).json({
      error: `${Object.keys(err.keyValue)} already used`,
    });
  }
  return res.status(400).json({
    error: err.message,
  });
};

userController.getUserByUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const profile = await UserModel.findOne({
      username,
    });
    if (!profile) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

userController.signin = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const jwtExp = rememberMe
    ? Math.floor(Date.now() / 1000) + 1209600
    : Math.floor(Date.now() / 1000) + 86400; // 14 days expiration : 1 day expiration
  try {
    const user = await UserModel.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        error: "Wrong username or password",
      });
    }
    if (!user.verified) {
      return res.status(400).json({
        error: "Please verify your email",
      });
    }
    const account = await AccountModel.findOne({
      user: user._id,
    });
    if (!account) {
      return res.status(400).json({
        error: "Couldn't find your account",
      });
    }
    const passwordMatches = await account.comparePassword(password);
    if (!passwordMatches) {
      return res.status(400).json({
        error: "Wrong username or password",
      });
    }
    const token = await generateJWT(user, jwtExp);
    res.cookie("jwt", token, {
      httpOnly: false,
    });
    res.redirect("/");
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
};

userController.signup = async (req, res) => {
  const jwtExp = Math.floor(Date.now() / 1000) + 86400; // 1 day expiration
  const {
    username,
    firstname,
    lastname,
    password,
    confirmPassword,
    phoneNumber,
    countryCode,
    email,
  } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "passwords do not match",
      });
    }
    let user = await UserModel.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        error: `${email} already used`,
      });
    }
    const phoneNumberWithCountryCode = `+${countryCode}${phoneNumber}`;
    user = await UserModel.create({
      username,
      firstname,
      lastname,
      phoneNumber: phoneNumberWithCountryCode,
      email,
    });
    try {
      const account = new AccountModel({
        user: user._id,
        model_type: "User",
        password_hash: password,
      });
      await account.save();
    } catch (err) {
      await user.deleteOne();
      throw err;
    }

    const verifyToken = await TokenModel.create({
      account: user._id,
      model_type: "User",
    });
    const emailText = `Click on this link to verify your email: ${process.env.DOMAIN}/user/verifyEmail?token=${verifyToken.token}`;
    sendEmail(email, "Vrify your email", emailText);
    const token = await generateJWT(user, jwtExp);
    res.cookie("jwt", token, {
      httpOnly: false,
    });
    res.redirect("/");
  } catch (err) {
    checkErorrCode(err, res);
  }
};

userController.signout = (req, res) => {
  try {
    res.clearCookie("jwt");
    // res.redirect(process.env.DOMAIN);
    res.json({ message: "Signout successfully" });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

userController.updateAccount = async (req, res) => {
  const user = req.user;
  const {
    password,
    confirmPassword,
    phoneNumber,
    countryCode,
    username,
    firstname,
    lastname,
    email,
  } = req.body;
  try {
    const phoneNumberWithCountryCode = `+${countryCode}${phoneNumber}`;
    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      {
        username,
        firstname,
        lastname,
        phoneNumber: phoneNumberWithCountryCode,
        email,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({
          error: "passwords do not match",
        });
      }
      const updatedAccount = await AccountModel.findOne({
        user: user.id,
      });
      if (!updatedAccount) {
        return res.status(404).json({
          message: "Account not found",
        });
      }
      updatedAccount.password_hash = password;
      await updatedAccount.save();
    }
    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    if (
      error.message ===
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long."
    ) {
      return res.status(400).json({ error: error.message });
    }
    checkErorrCode(err, res);
  }
};

userController.deleteAccount = async (req, res) => {
  const user = req.user;
  try {
    const deletedUser = await UserModel.findByIdAndUpdate(user.id, {
      // 14 days expiration
      userExpires: Date.now() + 12096e5,
    });
    if (!deletedUser) {
      return res.status(422).json({
        message: "User not found",
      });
    }
    await AccountModel.findOneAndUpdate(
      {
        user: user.id,
      },
      {
        // 14 days expiration
        accountExpires: Date.now() + 12096e5,
      }
    );

    res.clearCookie("jwt");
    // res.redirect(process.env.DOMAIN);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(422).json({
      error: err.message,
    });
  }
};

userController.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const token = await TokenModel.create({
      account: user._id,
      model_type: "User",
    });

    const emailText = resetPasswordTemplate(token.token, user.username);
    sendEmail(email, "Reset Password", emailText);
    res.json({
      message: "Email sent successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

userController.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const tokenParams = req.params.token;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "passwords do not match",
      });
    }
    const token = await TokenModel.findOneAndDelete({
      token: tokenParams,
    });
    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }
    const account = await AccountModel.findOne({
      user: token.account,
    });
    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    account.password_hash = password;
    await account.save();
    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

userController.verifyEmail = async (req, res) => {
  const token = req.query.token;

  try {
    const tokenObj = await TokenModel.findOneAndDelete({
      token,
    });
    if (!tokenObj) {
      return res.status(404).json({
        message: "Token not found",
      });
    }
    const user = await UserModel.findByIdAndUpdate(tokenObj.account, {
      verified: true,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const emailText = welcomeTemplate(user.username);
    sendEmail(user.email, "Welcome to our website", emailText);
    res.json({
      message: "Email verified successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export default userController;