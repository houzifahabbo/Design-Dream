import OrderModel from "../db/models/order.js";
import DesignerModel from "../db/models/designer.js";
const orderController = {};

orderController.getOrders = async (req, res) => {
  const designer = req.designer;
  const user = req.user;
  let orders;
  try {
    if (designer) {
      orders = await OrderModel.find({ designer: designer.id })
        .populate("customer", ["username", "firstname", "lastname"])
        .populate("options", ["label", "price"]);
    } else if (user) {
      orders = await OrderModel.find({ customer: user.id })
        .populate("designer", ["username", "firstname", "lastname"])
        .populate("options", ["label", "price"]);
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

orderController.createOrder = async (req, res) => {
  const { reqdesigner } = req.body;
  const user = req.user;
  try {
    const designer = await DesignerModel.findById(reqdesigner.id);
    const order = await OrderModel.create({
      customer: user.id,
      designer: reqdesigner.id,
      options: designer.options,
      paymentData: "paymentData",
    });

    designer.orders.push(order.id);
    await designer.save();

    user.orders.push(order);
    await user.save();

    res.json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

orderController.getOrderById = async (req, res) => {
  const orderId = req.params.id;
  const designer = req.designer;
  const user = req.user;
  try {
    const order = designer
      ? await OrderModel.findOne({
          _id: orderId,
          designer: designer.id,
        })
      : await OrderModel.findOne({
          _id: orderId,
          customer: user.id,
        });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

orderController.updateOrder = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  const designer = req.designer;
  const user = req.user;
  try {
    if (user && status === "Canceled") {
      const order = await OrderModel.findOneAndUpdate(
        { _id: orderId, customer: user.id },
        { status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ message: "Order updated successfully", order });
    } else if (designer) {
      const order = await OrderModel.findOneAndUpdate(
        { _id: orderId, designer: designer.id },
        { status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ message: "Order updated successfully", order });
    } else {
      return res.status(403).send("Forbidden");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default orderController;
