const UserModel = require("../db/models/user");
const AccountModel = require("../db/models/account");
const TokenModel = require("../db/models/token");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const resetPasswordTemplate = require("../emailTemplates/resetPassword");
const welcomeTemplate = require("../emailTemplates/welcome");

const userController = {};

const generateJWT = (user, jwtExp) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
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

userController.signin = async (req, res) => {
  const { emailOrUsername, password, rememberMe } = req.body;
  const jwtExp = rememberMe
    ? Math.floor(Date.now() / 1000) + 1209600
    : Math.floor(Date.now() / 1000) + 86400; // 14 days expiration : 1 day expiration
  try {
    const user = await UserModel.findOne({
      $or: [
        {
          email: emailOrUsername,
        },
        {
          username: emailOrUsername,
        },
      ],
    });
    if (!user) {
      return res.status(400).json({
        error: "Wrong username or password",
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
    res.json(token);
  } catch (err) {
    res.status(400).json({
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
    user = await UserModel.create({
      username,
      firstname,
      lastname,
      phoneNumber,
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

    const token = await generateJWT(user, jwtExp);
    const emailText = welcomeTemplate(user.username);
    sendEmail(email, "Welcome onboard", emailText);
    res.cookie("jwt", token, {
      httpOnly: false,
    });
    res.json(token);
  } catch (err) {
    checkErorrCode(err, res);
  }
};

//TODO: fix this function to match the designer function
userController.updateAccount = async (req, res) => {
  const user = req.user;
  const {
    password,
    confirmPassword,
    phoneNumber,
    username,
    firstname,
    lastname,
  } = req.body;
  try {
    const updatedUser = await UserModel.findById(user.id);
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // if (password && confirmPassword) {
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "passwords do not match",
      });
    }

    // }
    updatedUser.username = username;
    updatedUser.firstname = firstname;
    updatedUser.lastname = lastname;
    updatedUser.phoneNumber = phoneNumber;
    await updatedUser.save();
    if (password && confirmPassword) {
      const updatedAccount = await AccountModel.findOne({
        user: user.id,
      });
      updatedAccount?.set("password_hash", password);
      await updatedAccount?.save();
    }
    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    checkErorrCode(err, res);
  }
};

userController.deleteAccount = async (req, res) => {
  const user = req.user;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(user.id);
    if (!deletedUser) {
      return res.status(422).json({
        message: "User not found",
      });
    }
    await AccountModel.findOneAndDelete({
      user: user.id,
    });
    res.clearCookie("jwt");
    // res.redirect(process.env.DOMAIN);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(422).json({
      error: err.message,
    });
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
      message: "email sent successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

userController.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "passwords do not match",
      });
    }
    const token = await TokenModel.findOneAndDelete({
      token: req.query.token,
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

module.exports = userController;


//Todo: Edit google auth and ndoemailer