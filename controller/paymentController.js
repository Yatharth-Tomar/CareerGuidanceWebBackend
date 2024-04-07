const AppError = require('../utility/appError');
const User = require('../model/user.schema');
// const  {razorpay} = require('../server');
const crypto = require('crypto');
const Payment = require('../model/payment.model');
const Razorpay=require("razorpay")

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


exports.getRazorPayKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message:"Razor pay api key. ",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.log(e.message);
    return next(new AppError('Could not get razor pay key', 400));
  }
};
exports.buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('Unauthorized, please login', 400));
    }
    if (user.role == 'ADMIN') {
      return next(new AppError('Admin cannot purchase our subscription', 400));
    }
    console.log(process.env.RAZORPAY_PLAN_ID)
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count: 1
    });
    console.log("subscription is ",subscription)
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription Successfull',
      subscription_id: subscription.id,
    });
  } catch (e) {
    console.log(e.message);
    // return next(new AppError(e, 400));
    res.status(400).json({
      success: false,
      message:"Not possible",
      e
      
    });
  }
};
exports.verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('Unauthorized, please login', 400));
    }
    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
      .createHmac('sha56', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError('Payment not verified,please try again', 500));
    }
    await Payment.create({
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    });

    user.subscription.status = 'active';
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Payment created and verified successfully',
    });
  } catch (e) {
    console.log(e.message);
    return next(new AppError('Could not verify subscription', 400));
  }
};
exports.cancelSubscripiton = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
   
    if (!user) {
      return next(new AppError('Unauthorized, please login', 400));
    }
    if (user.role == 'ADMIN') {
      return next(new AppError('Admin cannot cancel subscription', 400));
    }

    const subscriptionId = user.subscription.id;
   
    const subscription = await razorpay.subscriptions.cancel(
      subscriptionId
    );
    user.subscription.status = subscription.status;
   
    await user.save;
    res.status(200).json({
      success: true,
      message: 'subscription canceled',
      
    })
  } catch (e) {
    console.log(e.message);
    // return next(new AppError('Could not cancel subscription', 400));
    res.status(400).json({
      success: false,
      message: 'subscription canceled',
      e
      
    })
  }
};
exports.allPayments = async (req, res, next) => {
  try {
    const { count } = req.query;
    const subscriptions = await razorpay.subscriptions.all({
      count: count || 10,
    });
    res.status(200).json({
      success: true,
      message: 'All payments',
      subscriptions,
    });
  } catch (e) {
    console.log(e.message);
    return next(new AppError('Could not retrieve payment details ', 400));
  }
};
