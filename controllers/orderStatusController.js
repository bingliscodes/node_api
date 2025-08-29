const OrderStatus = require('../models/orderStatusModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getOrderStatus = factory.getOne(OrderStatus);
exports.getAllOrderStatus = factory.getAll(OrderStatus);

//TODO: Check if the status we are attempting to update is non-null. Do not update anything if it is
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const doc = await OrderStatus.findOne(req.body.id);
  if (!doc) return next(new AppError('No document found with that ID', 404));

  const { status } = req.body;

  if (!status) return next(new AppError('Please provide a status', 400));

  const now = new Date();

  if (status === 'Confirmed' && !doc.confirmedAt) doc.confirmedAt = now;
  if (status === 'Shipped' && !doc.shippedAt) doc.shippedAt = now;
  if (status === 'Delivered' && !doc.deliveredAt) doc.deliveredAt = now;

  await doc.save();

  res.status(200).json({
    staus: 'success',
    data: {
      data: doc,
    },
  });
});
