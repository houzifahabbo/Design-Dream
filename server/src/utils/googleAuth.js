import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../db/models/user.js";
import sendEmail from "./email.js";
import welcomeTemplate from "../emailTemplates/welcome.js";
import dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});
const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 1209600,
      iat: Math.floor(Date.now() / 1000), // Issued at date
    },
    process.env.JWT_SECRET
  );
};

const dataRequest = async (accessToken, personFields) => {
  const url = `https://people.googleapis.com/v1/people/me?personFields=${personFields}&key=${process.env.GOOGLE_PEOPLE_API_KEY}&access_token=${accessToken}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

const getPhoneNumber = async (accessToken) => {
  const data = await dataRequest(accessToken, "phoneNumbers");
  if (data.phoneNumbers) {
    return data.phoneNumbers.length ? data.phoneNumbers[0].canonicalForm : null;
  }
  return null;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GAPP_CLIENT_ID,
      clientSecret: process.env.GAPP_CLIENT_SECRET,
      callbackURL: "/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists based on their Google ID
        const existingUser = await UserModel.findOne({ googleId: profile.id });
        if (existingUser) {
          // User already exists, generate token and return
          const token = await generateJWT(existingUser);
          return done(null, { user: existingUser, token });
        }
        const phoneNumber = await getPhoneNumber(accessToken);

        // User doesn't exist, create a new user and save to the database
        const newUser = new UserModel({
          username: profile.displayName, // You may adjust this based on your data model
          email: profile.emails[0].value, // Make sure to check if profile.emails is not empty before accessing index 0
          googleId: profile.id,
          firstname: profile._json.given_name,
          lastname: profile._json.family_name,
          phoneNumber: phoneNumber,
        });
        await newUser.save();

        const token = generateJWT(newUser);
        const emailText = welcomeTemplate(newUser.username);
        sendEmail(newUser.email, "Welcome onboard", emailText);
        return done(null, { user: newUser, token });
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }
  )
);

export default passport;
