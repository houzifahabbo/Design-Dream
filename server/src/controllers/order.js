const OrderModel = require("../db/models/order");
const UserModel = require("../db/models/user");
const OptionModel = require("../db/models/option");
const DesignerModel = require("../db/models/designer");
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
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId).populate("user");
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
  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

orderController.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    // delete order after 14 days
    order.orderExpires = Date.now() + 12096e5;
    await order.save();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = orderController;
