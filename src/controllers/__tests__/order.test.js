import request from "supertest";
import app from "../../app.js";
import mongoose from "../../db/connection.js";
import OrderModel from "../../db/models/order.js";
import DesignerModel from "../../db/models/designer.js";
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

const user = {
  id: "5f8f8c8f3d1d9d2d9c0d3d3e",
  name: "UserTest",
  email: "user@test.com",
  phoneNumber: "1234567890",
  password: "Cl12345.",
  confirmPassword: "Cl12345.",
};

const orderId = "5f8f8c8f3d1d9d2d9c0d3d3f";

const designerToken = jwt.sign(
  { id: designer.id, name: designer.name },
  process.env.JWT_SECRET
);
const userToken = jwt.sign(
  { id: user.id, name: user.name },
  process.env.JWT_SECRET
);

beforeEach(async () => {
  await OrderModel.deleteMany();
  await DesignerModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Get Order", () => {
  it("should get the order for a designer", async () => {
    await OrderModel.create({ _id: orderId, designer: designer.id });
    const response = await request(app)
      .get(`/order/${orderId}`)
      .set("Cookie", [`jwt=${designerToken}`]);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("order");
    expect(response.body.order._id).toBe(orderId);
    expect(response.body.order.designer).toBe(designer.id);
  });

  it("should get the order for a customer", async () => {
    await OrderModel.create({ _id: orderId, customer: user.id });
    const response = await request(app)
      .get(`/order/${orderId}`)
      .set("Cookie", [`jwt=${userToken}`]);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("order");
    expect(response.body.order._id).toBe(orderId);
    expect(response.body.order.customer).toBe(user.id);
  });

  it("should return 404 if the order is not found", async () => {
    const response = await request(app)
      .get(`/order/${orderId}`)
      .set("Cookie", [`jwt=${userToken}`]);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Order not found");
  });

  it("should return 403 if the user is not authorized to access the order", async () => {
    await OrderModel.create({
      _id: orderId,
      designer: "some-other-designer-id",
    });
    const response = await request(app)
      .get(`/order/${orderId}`)
      .set("Cookie", [`jwt=${userToken}`]);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Unauthorized access");
  });
});
