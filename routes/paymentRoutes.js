const express = require('express');
const router = express.Router();
const { isLoggedIn, authorizedRoles } = require('../middleware/jwtAuth');

const {
  getRazorPayKey,
  buySubscription,
  verifySubscription,
  cancelSubscripiton,
  allPayments,
} = require('../controller/paymentController.js');

router.get('/razorpay-key', isLoggedIn, getRazorPayKey);
router.post('/subscribe', isLoggedIn, buySubscription);
router.post('/verify', isLoggedIn, verifySubscription);
router.post('/unsubscribe', isLoggedIn, cancelSubscripiton);
router.get('/', isLoggedIn, authorizedRoles, allPayments);

module.exports = router;
