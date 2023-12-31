import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../../app.js";
import UserModel from "../../db/models/user.js";
import AccountModel from "../../db/models/account.js";
import sendEmail from "../../utils/email.js";
import mongoose from "../../db/connection.js";
import userController from "../user.js";
import { db } from "../../db/models/payment.js";
import dotenv from "dotenv";
dotenv.config();

// Mocking mail sender
jest.mock("../../utils/email");
sendEmail.mockImplementation(() => Promise.resolve());

// Mocking models
jest.mock("../../db/models/account");
jest.mock("../../db/models/user");

// Mock the JWT token generation function
jest.mock("jsonwebtoken");
jwt.sign.mockReturnValue("mocked-jwt-token");

// Mock the Bcrypt hashing functionality
jest.mock("bcrypt");

// Connect to the test database before running the tests
beforeAll(async () => {
  // await mongoose.connect(process.env.MONGODB_TEST_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  const db = mongoose.createConnection(process.env.MONGODB_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // add more config if you need
  });
  db.on(`error`, console.error.bind(console, `connection error:`));
  db.once(`open`, function () {
    // we`re connected!
  });
});

// Disconnect from the database after running the tests
afterAll(async () => {
  await db.close();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
describe("POST /user/signup", () => {
  it("should create a new user and account with valid data", async () => {
    const userData = {
      username: "testuser4",
      firstname: "Test",
      lastname: "User",
      password: "Cl12345.",
      confirmPassword: "Cl12345.",
      phoneNumber: "5539292766",
      email: "testuser4@example.com",
    };

    // Mock UserModel.findOne to simulate that no user with the same email exists
    UserModel.findOne.mockResolvedValue(null);

    // Mock UserModel.create to simulate successful user creation
    await UserModel.create.mockResolvedValue(userData);

    // Mock AccountModel.prototype.save to simulate successful account creation
    AccountModel.prototype.save.mockResolvedValue();

    // Make the HTTP request to test the signup endpoint
    const response = await request(app).post("/user/signup").send(userData);

    // console.log(response.body)

    // Assertions
    // expect(response.body).toEqual(expect.any(String)); // We expect the response body to be a string (token)
    expect(response.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      userData.email,
      "Welcome onboard",
      expect.any(String)
    );

    // Assert that the "jwt" cookie is set
    const cookies = response.header["set-cookie"][0].split(";");
    const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));
    expect(jwtCookie).toBeTruthy();

    // Extract the JWT token from the cookie for further testing if needed
    const jwtToken = jwtCookie.split("=")[1];
    expect(jwtToken).toBe("mocked-jwt-token");
  });

  it("should return an error if passwords do not match", async () => {
    const userData = {
      username: "testuser4",
      firstname: "Test",
      lastname: "User",
      password: "Cl12345.",
      confirmPassword: "Cl12345",
      phoneNumber: "5539292766",
      email: "testuser4@example.com",
    };

    const response = await request(app).post("/user/signup").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("passwords do not match");
  });

  it("should return an error if email is already used", async () => {
    const existingUser = {
      email: "testuser4@example.com",
    };
    UserModel.findOne.mockResolvedValue(existingUser);

    const userData = {
      username: "testuser4",
      firstname: "Test",
      lastname: "User",
      password: "Cl12345.",
      confirmPassword: "Cl12345.",
      phoneNumber: "5539292766",
      email: "testuser4@example.com",
    };

    const response = await request(app).post("/user/signup").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(`${existingUser.email} already used`);
  });
});

describe("POST /user/signin", () => {
  it("should sign in successfully with valid credentials", async () => {
    const userData = {
      username: "testuser4",
      firstname: "Test",
      lastname: "User",
      password: "Cl12345.",
      confirmPassword: "Cl12345.",
      phoneNumber: "5539292766",
      email: "testuser4@example.com",
    };

    // Mock UserModel.findOne to simulate that the user with the same email exists
    UserModel.findOne.mockResolvedValue(userData);

    // Mock AccountModel.findOne to simulate that the account for the user exists
    AccountModel.findOne.mockResolvedValue({
      comparePassword: jest.fn().mockResolvedValue(true),
    });

    const signinData = {
      emailOrUsername: userData.email, // Use the user's email as the identifier
      password: "Cl12345.", // Use the user's password
      rememberMe: false, // Set rememberMe to false
    };

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post("/user/signin").send(signinData);
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(String)); // We expect the response body to be a string (token)
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [
        {
          email: signinData.emailOrUsername,
        },
        {
          username: signinData.emailOrUsername,
        },
      ],
    });
    expect(AccountModel.findOne).toHaveBeenCalledWith({
      user: userData._id,
    });

    // Assert that the "jwt" cookie is set
    const cookies = response.header["set-cookie"][0].split(";");
    const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));
    expect(jwtCookie).toBeTruthy();

    // Extract the JWT token from the cookie for further testing if needed
    const jwtToken = jwtCookie.split("=")[1];
    expect(jwtToken).toBe("mocked-jwt-token");
  });

  it("should return an error when user is not found", async () => {
    const signinData = {
      emailOrUsername: "nonexistentuser@example.com", // Non-existent email
      password: "Cl12345.",
      rememberMe: false,
    };

    // Mock UserModel.findOne to simulate that the user does not exist
    UserModel.findOne.mockResolvedValue(null);

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post("/user/signin").send(signinData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Wrong username or password",
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [
        {
          email: signinData.emailOrUsername,
        },
        {
          username: signinData.emailOrUsername,
        },
      ],
    });
    expect(AccountModel.findOne).not.toHaveBeenCalled(); // Ensure AccountModel.findOne is not called
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
  });

  it("should return an error when user account is not found", async () => {
    const userData = {
      username: "testuser4",
      firstname: "Test",
      lastname: "User",
      password: "Cl12345.",
      confirmPassword: "Cl12345.",
      phoneNumber: "5539292766",
      email: "testuser4@example.com",
    };

    const signinData = {
      emailOrUsername: userData.email, // Use the user's email as the identifier
      password: "Cl12345.", // Use the user's password
      rememberMe: false, // Set rememberMe to false
    };

    // Mock UserModel.findOne to simulate that the user exists but the account does not
    UserModel.findOne.mockResolvedValue(userData);
    AccountModel.findOne.mockResolvedValue(null);

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post("/user/signin").send(signinData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Couldn't find your account",
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [
        {
          email: signinData.emailOrUsername,
        },
        {
          username: signinData.emailOrUsername,
        },
      ],
    });
    expect(AccountModel.findOne).toHaveBeenCalledWith({
      user: userData._id,
    });
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
  });

  it("should return an error when the password is incorrect", async () => {
    const userData = {
      username: "testuser4",
      firstname: "Test",
      lastname: "User",
      password: "Cl12345.",
      confirmPassword: "Cl12345.",
      phoneNumber: "5539292766",
      email: "testuser4@example.com",
    };

    const signinData = {
      emailOrUsername: userData.email, // Use the user's email as the identifier
      password: "WrongPassword", // Incorrect password
      rememberMe: false, // Set rememberMe to false
    };

    // Mock UserModel.findOne to simulate that the user exists and the account exists
    UserModel.findOne.mockResolvedValue(userData);
    AccountModel.findOne.mockResolvedValue({
      comparePassword: jest.fn().mockResolvedValue(false), // Mock incorrect password comparison
    });

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post("/user/signin").send(signinData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Wrong username or password",
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [
        {
          email: signinData.emailOrUsername,
        },
        {
          username: signinData.emailOrUsername,
        },
      ],
    });
    expect(AccountModel.findOne).toHaveBeenCalledWith({
      user: userData._id,
    });
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
  });
});

describe("PUT /user", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        id: "user_id", // Provide the user ID as needed for the test
      },
      body: {
        // Provide the required fields for updating the profile
        password: "newPassword",
        confirmPassword: "newPassword",
        phoneNumber: "1234567890",
        birthday: new Date("2000-01-01"),
        username: "new_username",
        firstname: "NewFirstName",
        lastname: "NewLastName",
        gender: "female",
        avatar: "new_avatar_url",
      },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the user profile and password", async () => {
    // Mock the findById and findOne functions of UserModel and AccountModel
    UserModel.findById.mockResolvedValue({
      save: jest.fn().mockResolvedValue(),
    });
    AccountModel.findOne.mockResolvedValue({
      set: jest.fn(),
      save: jest.fn().mockResolvedValue(),
    });

    // Mock bcrypt.hash and compare functions
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);

    await userController.updateProfile(req, res);

    // Expectations
    expect(UserModel.findById).toHaveBeenCalledWith("user_id");

    expect(AccountModel.findOne).toHaveBeenCalledWith({
      user: "user_id",
    });

    expect(res.json).toHaveBeenCalledWith({
      message: "User updated successfully",
    });
    expect(res.status).not.toHaveBeenCalled(); // Ensure status is not called (no error)
  });

  it("should return error if passwords do not match", async () => {
    req.body.confirmPassword = "differentPassword";

    await userController.updateProfile(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "passwords do not match",
    });
  });

  it("should return error if user is not found", async () => {
    UserModel.findById.mockResolvedValue(null);

    await userController.updateProfile(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found",
    });
  });
});
