const express = require('express');
const orderStatusController = require('../controllers/orderStatusController');

const router = express.Router();

router.route('/').get(orderStatusController.getOrderStatus);

router
  .route('/:id')
  .get(orderStatusController.getOrderStatus)
  .patch(orderStatusController.updateOrderStatus);

module.exports = router;
