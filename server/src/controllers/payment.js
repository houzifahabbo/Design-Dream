import dotenv from "dotenv";
dotenv.config();
import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_KEY);
import jwt from "jsonwebtoken";
import paymentModel from "../db/models/payment.js";
import sendEmail from "../utils/email.js";
import paymentTemplate from "../emailTemplates/payment.js";

const paymentController = {};

paymentController.checkout = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1NZa86ITu5J53mzxc6LPDoCX",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.DOMAIN}/payment/success`,
      cancel_url: `${process.env.DOMAIN}/payment/cancel`,
    });

    const token = await jwt.sign(
      {
        sessionID: session.id,
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
    const lineItems = await stripe.checkout.sessions.listLineItems(
      decodedToken.sessionID
    );
    const payment = await paymentModel.create({
      sessionID: decodedToken.sessionID,
      amount: lineItems.data[0].amount_total,
      donor: req.user.id,
      date: decodedToken.created,
    });
    if (!payment) {
      return res.status(404).json({
        error: "payment not found",
      });
    }
    // await stripe.checkout.sessions.listLineItems(decodedToken.sessionID,
    //         async function (err, lineItems) {
    //                 if (err) {
    //                     console.error('Error retrieving line items:', err);
    //                     console.log('Error retrieving line items:', err);
    //                 } else {
    //
    //         }
    //         }
    //         );
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
paymentController.getpayments = async (req, res) => {
  try {
    const payments = await paymentModel
      .find({
        donor: req.user.id,
      })
      .populate("donor");
    // const donor = await UserModel.findById(req.user.id);
    // if (!donor) {
    //     return res.status(404).json({
    //         error: 'Donor not found'
    //     });
    // }

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        error: "payments not found",
      });
    }
    res.json(payments);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

paymentController.getpaymentById = async (req, res) => {
  try {
    const payment = await paymentModel
      .findOne({
        _id: req.params.id,
        donor: req.user.id,
      })
      .populate("donor");
    if (!payment) {
      return res.status(404).json({
        error: "payment not found",
      });
    }
    res.json(payment);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export default paymentController;
