import jwt from "jsonwebtoken";

const googleCallbackMiddleware = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("Failed to authenticate user");
    }
    const { user } = req;

    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 1209600, //
      iat: Math.floor(Date.now() / 1000),
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);

    res.cookie("jwt", jwtToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    });
    res.redirect(`${process.env.DOMAIN}/`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default googleCallbackMiddleware;
