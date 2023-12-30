import jwt from "jsonwebtoken";
import DesignerModel from "../db/models/designer.js";
import AccountModel from "../db/models/account.js";
import TokenModel from "../db/models/token.js";
import OptionModel from "../db/models/option.js";
import resetPasswordTemplate from "../emailTemplates/resetPassword.js";
import sendEmail from "../utils/email.js";
import welcomeTemplate from "../emailTemplates/welcome.js";
const DesignerController = {};

const generateJWT = (designer, jwtExp) =>
  jwt.sign(
    {
      id: designer.id,
      exp: jwtExp,
      iat: Math.floor(Date.now() / 1000), // Issued at date
    },
    process.env.JWT_SECRET
  );

const checkErorrCode = (err, res) => {
  if (err.code === 11000) {
    return res
      .status(500)
      .json({ error: `${Object.keys(err.keyValue)} already used` });
  }
  return res.status(400).json({ error: err.message });
};

DesignerController.getDesigners = async (req, res) => {
  try {
    // find all designers and get the avg rating for each one
    const designers = await DesignerModel.find(
      {},
      { logo: 0, description: 0, photos: 0 }
    );
    if (!designers) {
      return res.status(404).json({ message: "designers not found" });
    }
    res.json(designers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

DesignerController.getDesignerByName = async (req, res) => {
  try {
    const { DesignerName } = req.params;
    const designer = await DesignerModel.findOne({
      name: DesignerName,
    }).populate("ratings");
    if (!designer) {
      return res.status(404).json({ message: "designer not found" });
    }
    designer.averageRating = await designer.averageRating(designer.ratings);
    res.json(designer);
  } catch (error) {
    res.status(500).json({
      message: "Error while getting designer",
      error,
    });
  }
};

DesignerController.signup = async (req, res) => {
  const jwtExp = Math.floor(Date.now() / 1000) + 86400; // 1 day expiration
  const {
    name,
    email,
    password,
    confirmPassword,
    description,
    phoneNumber,
    countryCode,
  } = req.body;
  const { buffer, mimetype } = req.file;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    let designer = await DesignerModel.findOne({ email });
    if (designer) {
      return res.status(400).json({ error: `${email} is already used` });
    }
    const phoneNumberWithCountryCode = `+${countryCode}${phoneNumber}`;
    designer = await DesignerModel.create({
      name,
      email,
      password,
      description,
      phoneNumber: phoneNumberWithCountryCode,
      logo: {
        imageData: buffer,
        contentType: mimetype,
      },
    });

    try {
      const account = new AccountModel({
        user: designer._id,
        password_hash: password,
        model_type: "Designer",
      });
      await account.save();
    } catch (err) {
      await designer.deleteOne();
      throw err;
    }
    const verifyToken = await TokenModel.create({
      account: designer._id,
      model_type: "Designer",
    });
    const emailText = `Click on this link to verify your email: ${process.env.DOMAIN}verify?token=${verifyToken.token}`;
    sendEmail(email, "Vrify your email", emailText);
    const token = await generateJWT(designer, jwtExp);
    res
      .status(201)
      .cookie("jwt", token, { httpOnly: false })
      .json({ token: token });
  } catch (err) {
    checkErorrCode(err, res);
  }
};

DesignerController.signin = async (req, res) => {
  const { emailOrUsername, password, rememberMe } = req.body;
  const jwtExp = rememberMe
    ? Math.floor(Date.now() / 1000) + 1209600
    : Math.floor(Date.now() / 1000) + 86400; // 14 days expiration : 1 day expiration
  try {
    const designer = await DesignerModel.findOne({
      $or: [{ email: emailOrUsername }, { name: emailOrUsername }],
    });
    if (!designer) {
      return res.status(400).json({ error: "Wrong username or password" });
    }
    if (!designer.verified) {
      return res.status(400).json({
        error: "Please verify your email first",
      });
    }
    const account = await AccountModel.findOne({
      user: designer._id,
    });
    if (!account) {
      return res.status(400).json({
        error: "Couldn't find your account",
      });
    }
    // Compare the provided password with the hashed password in the designer object
    const passwordMatches = await account.comparePassword(password);
    if (!passwordMatches) {
      return res.status(400).json({ error: "Wrong username or password" });
    }
    const token = await generateJWT(designer, jwtExp);
    res.cookie("jwt", token, { httpOnly: false });
    res.json({ token: token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

DesignerController.signout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.json({ message: "Signout successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

DesignerController.getAccount = async (req, res) => {
  try {
    const designerId = req.designer.id;
    const designer = await DesignerModel.findById(designerId);
    if (!designer) {
      return res.status(404).json({ error: "designer not found" });
    }
    res.json(designer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

DesignerController.updateAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      description,
      phoneNumber,
      countryCode,
    } = req.body;
    const { buffer, mimetype } = req.file;
    const designerId = req.designer.id;
    const phoneNumberWithCountryCode = `+${countryCode}${phoneNumber}`;
    const updatedDesigner = await DesignerModel.findByIdAndUpdate(
      designerId,
      {
        name,
        email,
        password,
        description,
        phoneNumber: phoneNumberWithCountryCode,
        logo: {
          imageData: buffer,
          contentType: mimetype,
        },
      },
      { new: true }
    );
    if (!updatedDesigner) {
      return res.status(404).json({ error: "designer not found" });
    }

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }
      const account = await AccountModel.findOne({ user: designerId });
      if (!account) {
        return res.status(404).json({ error: "account not found" });
      }
      account.password_hash = password;
      await account.save();
    }
    req.designer = updatedDesigner;
    res.json({
      message: "designer details updated successfully",
      designer: updatedDesigner,
    });
  } catch (error) {
    if (
      error.message ===
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long."
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

DesignerController.deleteAccount = async (req, res) => {
  const designerId = req.designer.id;
  try {
    // Find the designer by ID
    const deletedDesigner = await DesignerModel.findByIdAndUpdate(designerId, {
      // 14 days expiration
      designerExpires: Date.now() + 12096e5,
    });
    if (!deletedDesigner) {
      return res.status(404).json({ error: "designer not found" });
    }
    // Delete the designer's account
    const deletedAccount = await AccountModel.findOneAndUpdate(
      {
        user: designerId,
      },
      {
        // 14 days expiration
        accountExpires: Date.now() + 12096e5,
      }
    );
    if (!deletedAccount) {
      return res.status(404).json({ error: "account not found" });
    }
    res.clearCookie("jwt");
    res.json({ message: "designer account deleted successfully" });
    // res.redirect(`${process.env.DOMAIN}/api-docs`);
  } catch (error) {
    res.status(422).json({ error: "Error while deleting designer account" });
  }
};

DesignerController.createProfile = async (req, res) => {
  const designerId = req.designer.id;
  const { options } = req.body;
  const photos = req.files;

  try {
    const designer = await DesignerModel.findById(designerId);
    if (!designer) {
      return res.status(404).send("Designer not found");
    }
    if (options) {
      for (const optionData of options) {
        const option = await OptionModel.create({
          ...optionData,
          designer: designerId,
        });
        designer.options.push(option._id);
      }
    }
    if (photos) {
      designer.photos = photos;
    }
    await designer.save();
    res.status(201).json(designer.options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

DesignerController.editProfile = async (req, res) => {
  const designerId = req.designer.id;
  const { options } = req.body;
  const photos = req.files;

  try {
    const designer = await DesignerModel.findById(designerId);
    if (!designer) {
      return res.status(404).send("Designer not found");
    }
    if (options) {
      for (const optionData of options) {
        const option = await OptionModel.findOneAndReplace(
          { _id: optionData.id },
          optionData
        );
        if (!option) {
          return res.status(404).send("Option not found");
        }
      }
    }
    if (photos) {
      designer.photos = photos;
    }
    await designer.save();
    res.status(201).json(designer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

DesignerController.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const designer = await DesignerModel.findOne({
      email,
    });
    if (!designer) {
      return res.status(404).json({
        message: "Designer not found",
      });
    }
    const token = await TokenModel.create({
      account: designer._id,
      model_type: "Designer",
    });

    const emailText = resetPasswordTemplate(token.token, designer.name);
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

DesignerController.resetPassword = async (req, res) => {
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

DesignerController.verifyEmail = async (req, res) => {
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
    const designer = await DesignerModel.findByIdAndUpdate(tokenObj.account, {
      verified: true,
    });
    if (!designer) {
      return res.status(404).json({
        message: "Designer not found",
      });
    }
    const emailText = welcomeTemplate(designer.name);
    sendEmail(designer.email, "Welcome onboard", emailText);
    res.json({
      message: "Email verified successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};


export default DesignerController;
