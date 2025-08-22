const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.updateOrder = catchAsync(async (req, res, next) => {
  const check = await Order.findOne(req.body.id);

  if (req.body.status === check.status)
    return next(
      new AppError(
        'Request attempting to update status would violate idempotency',
        405,
      ),
    );

  const { status } = req.body;

  if (status) {
    const now = new Date();

    if (status === 'Confirmed') req.body.confirmedAt = now;
    if (status === 'Shipped') req.body.shippedAt = now;
    if (status === 'Delivered') req.body.deliveredAt = now;
  }

  const doc = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) return next(new AppError('No document found with that ID', 404));

  res.status(200).json({
    staus: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order);
exports.createOrder = factory.createOne(Order);
// exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
