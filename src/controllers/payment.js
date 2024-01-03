import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_KEY);
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import paymentTemplate from "../emailTemplates/payment.js";
import designerModel from "../db/models/designer.js";
import orderModel from "../db/models/order.js";

const paymentController = {};

paymentController.getaccount = async (req, res) => {
  const designer = req.designer;
  try {
    const designerObj = await designerModel.findById(designer.id);
    if (!designerObj) {
      return res.status(404).json({
        error: "Designer not found",
      });
    }
    if (!designerObj.stripeAccount) {
      return res.status(404).json({
        error: "Stripe account not found",
      });
    }
    const account = await stripeInstance.accounts.retrieve(
      designerObj.stripeAccount
    );

    res.json(account);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

paymentController.accountSetup = async (req, res) => {
  const designer = req.designer;
  try {
    const account = await stripeInstance.accounts.create({
      type: "express",
    });
    const designerObj = await designerModel.findById(designer.id);
    if (!designerObj) {
      return res.status(404).json({
        error: "Designer not found",
      });
    }
    if (designerObj.stripeAccount) {
      return res.status(400).json({
        error: "Stripe account already exists",
      });
    }
    designerObj.stripeAccount = account.id;
    await designerObj.save();

    const accountLinks = await stripeInstance.accountLinks.create({
      account: designerObj.stripeAccount,
      refresh_url: `${process.env.DOMAIN}/payment/account`,
      return_url: `${process.env.DOMAIN}/payment/account`,
      type: "account_onboarding",
    });
    res.redirect(303, accountLinks.url);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

paymentController.checkout = async (req, res) => {
  const designerId = req.params.designerId;
  const orderId = req.params.orderId;
  try {
    const designerObj = await designerModel.findById(designerId);
    if (!designerObj) {
      return res.status(404).json({
        error: "Designer not found",
      });
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }
    const price = await stripeInstance.prices.create({
      currency: "usd",
      unit_amount: order.fees * 100,
      product_data: {
        name: "Design Fees",
      },
    });
    const session = await stripeInstance.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: order.fees * 100 * 0.02,
        transfer_data: {
          destination: designerObj.stripeAccount,
        },
      },
      success_url: `${process.env.DOMAIN}/payment/success`,
      cancel_url: `${process.env.DOMAIN}/payment/cancel`,
    });
    const token = await jwt.sign(
      {
        sessionID: session.id,
        orderId: order.id,
        created: session.created,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000), // Issued at date
      },
      process.env.JWT_SECRET
    );
    res.cookie("pSession", token, {
      httpOnly: true,
    });
    res.redirect(303, session.url);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

paymentController.success = async (req, res) => {
  try {
    const token = req.cookies.pSession;
    const emailText = paymentTemplate(req.user.username);
    sendEmail(req.user.email, "Thank You for Your payment!", emailText);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const lineItems = await stripeInstance.checkout.sessions.listLineItems(
      decodedToken.sessionID
    );
    const order = await orderModel.findByIdAndUpdate(decodedToken.orderId, {
      paymentData: {
        sessionID: decodedToken.sessionID,
        amount: lineItems.data[0].amount_total,
        date: decodedToken.created,
      },
    });
    if (!order) {
      return res.status(404).json({
        error: "payment not found",
      });
    }
    res.clearCookie("pSession");
    res.send("Success");
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

paymentController.cancel = async (req, res) => {
  res.clearCookie("pSession");
  res.send("Cancelled");
};

export default paymentController;
