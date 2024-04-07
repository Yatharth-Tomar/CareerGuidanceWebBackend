const AppError = require('../utility/appError');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError('Unauthenticated, please login again', 401));
  }

  const userDetails = await jwt.verify(token, process.env.SECRET);

  req.user = userDetails;
  next();
};

exports.authorizedRoles = (roles) => async (req, res, next) => {
  const currentUserRoles = req.user.role;
  if (roles != currentUserRoles) {
    return next(new AppError('Bruh u are not even admin get outta here', 400));
  }
  next();
};

exports.authorizedSubscribers = async (req, res, next) => {
  const subscription = req.user.subscription;
  const currentUserRole = req.user.role;
  if (currentUserRole !== 'ADMIN' && subscription.status !== 'active') {
    return next(new AppError('Please Subscribe to access this route'));
  }
  next();
};
