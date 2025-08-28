const OrderStatus = require('../models/orderStatusModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getOrderStatus = factory.getAll(OrderStatus);
exports.getAllOrderStatus = factory.getOne(OrderStatus);

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const check = await OrderStatus.findOne(req.body.id);

  const { status } = req.body;

  const doc = await OrderStatus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) return next(new AppError('No document found with that ID', 404));

  if (status && check.status !== status) {
    const now = new Date();

    if (status === 'Confirmed') req.body.confirmedAt = now;
    if (status === 'Shipped') req.body.shippedAt = now;
    if (status === 'Delivered') req.body.deliveredAt = now;
  }
  res.status(200).json({
    staus: 'success',
    data: {
      data: doc,
    },
  });
});
