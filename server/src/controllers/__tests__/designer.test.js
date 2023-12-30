import request from "supertest";
import app from "../../app.js";
import mongoose from "../../db/connection.js";
import DesignerModel from "../../db/models/designer.js";
import AccountModel from "../../db/models/account.js";
import jwt from "jsonwebtoken";

const designer = {
  id: "5f8f8c8f3d1d9d2d9c0d3d3d",
  name: "DesignDream",
  email: "test@test.com",
  phoneNumber: "565656456465",
  password: "Cl12345.",
  confirmPassword: "Cl12345.",
  description: "testtesttest",
};

const payload = {
  id: designer.id,
  name: designer.name,
};

afterEach(async () => {
  await DesignerModel.deleteMany();
  await AccountModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Signup", () => {
  it("should create a new designer", async () => {
    const response = await request(app).post("/designer/signup").send(designer);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
  });
  it("should return 400 if the email is already in use", async () => {
    await request(app).post("/designer/signup").send(designer);
    const response = await request(app).post("/designer/signup").send(designer);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 400 if the email is invalid", async () => {
    const response = await request(app)
      .post("/designer/signup")
      .send({ ...designer, email: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 400 if the password is invalid", async () => {
    const response = await request(app)
      .post("/designer/signup")
      .send({ ...designer, password: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 400 if the password does not match the confirm password", async () => {
    const response = await request(app)
      .post("/designer/signup")
      .send({ ...designer, confirmPassword: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("Signin", () => {
  it("should signin a designer", async () => {
    await request(app).post("/designer/signup").send(designer);
    const response = await request(app)
      .post("/designer/signin")
      .send({ emailOrUsername: designer.email, password: designer.password });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
  it("should return 400 if the email is invalid", async () => {
    const response = await request(app)
      .post("/designer/signin")
      .send({ emailOrUsername: "test", password: designer.password });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid email or username");
  });
  it("should return 400 if the password is invalid", async () => {
    const response = await request(app)
      .post("/designer/signin")
      .send({ emailOrUsername: designer.email, password: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 400 if the email is not found", async () => {
    const response = await request(app)
      .post("/designer/signin")
      .send({ emailOrUsername: "test2@test.com", password: designer.password });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 400 if the password is incorrect", async () => {
    await request(app).post("/designer/signup").send(designer);
    const response = await request(app)
      .post("/designer/signin")
      .send({ emailOrUsername: designer.email, password: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("Update", () => {
  beforeEach(async () => {
    await request(app).post("/designer/signup").send(designer);
    payload.id = (await DesignerModel.findOne({ email: designer.email }))?.id;
  });

  it("should update a designer", async () => {
    const response = await request(app)
      .put("/designer")
      .set("Cookie", [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`])
      .send({ name: "test" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("designer");
    expect(response.body.designer.name).toBe("test");
  });
  it("should return 400 if the email is invalid", async () => {
    const response = await request(app)
      .put("/designer")
      .set("Cookie", [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`])
      .send({ email: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid email");
  });
  it("should return 400 if the password is invalid", async () => {
    const response = await request(app)
      .put("/designer")
      .set("Cookie", [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`])
      .send({ password: "test", confirmPassword: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long."
    );
  });
  it("should return 400 if the password does not match the confirm password", async () => {
    const response = await request(app)
      .put("/designer")
      .set("Cookie", [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`])
      .send({ password: designer.password, confirmPassword: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Passwords do not match");
  });
});
