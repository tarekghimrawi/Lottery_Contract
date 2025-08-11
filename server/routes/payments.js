const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Simulate Stripe for demo purposes
const simulateStripePayment = (amount, paymentMethodId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      
      if (success) {
        resolve({
          success: true,
          paymentIntent: {
            id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'succeeded',
            amount: amount * 100, // Stripe uses cents
            currency: 'usd',
            payment_method: {
              id: paymentMethodId,
              card: {
                brand: 'visa',
                last4: '4242'
              }
            }
          }
        });
      } else {
        resolve({
          success: false,
          error: {
            code: 'card_declined',
            message: 'Your card was declined.'
          }
        });
      }
    }, 1000); // Simulate network delay
  });
};

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for order
// @access  Private
router.post('/create-payment-intent', authenticate, [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('paymentMethodId').notEmpty().withMessage('Payment method ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, paymentMethodId } = req.body;

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Simulate payment processing
    const paymentResult = await simulateStripePayment(order.totalAmount, paymentMethodId);

    if (paymentResult.success) {
      // Update order with payment details
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails = {
        paymentIntentId: paymentResult.paymentIntent.id,
        transactionId: paymentResult.paymentIntent.id,
        last4: paymentResult.paymentIntent.payment_method.card.last4,
        brand: paymentResult.paymentIntent.payment_method.card.brand
      };
      
      await order.save();

      res.json({
        success: true,
        message: 'Payment processed successfully',
        paymentIntent: paymentResult.paymentIntent,
        order
      });
    } else {
      // Update order payment status
      order.paymentStatus = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: paymentResult.error
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Server error during payment processing' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks (simulated)
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    switch (type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        const paymentIntent = data.object;
        
        // Find order by payment intent ID
        const order = await Order.findOne({ 
          'paymentDetails.paymentIntentId': paymentIntent.id 
        });

        if (order) {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          await order.save();
        }
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedPayment = data.object;
        
        const failedOrder = await Order.findOne({ 
          'paymentDetails.paymentIntentId': failedPayment.id 
        });

        if (failedOrder) {
          failedOrder.paymentStatus = 'failed';
          await failedOrder.save();
        }
        break;

      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook error' });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund for order
// @access  Private/Admin
router.post('/refund', authenticate, [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid refund amount is required'),
  body('reason').trim().notEmpty().withMessage('Refund reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Only admin can process refunds for this demo
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Order is not paid' });
    }

    // Simulate refund processing
    const refundId = `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add refund to order
    order.refunds.push({
      amount,
      reason,
      refundedAt: new Date(),
      transactionId: refundId
    });

    // Calculate total refunded amount
    const totalRefunded = order.refunds.reduce((total, refund) => total + refund.amount, 0);

    if (totalRefunded >= order.totalAmount) {
      order.paymentStatus = 'refunded';
      order.status = 'refunded';
    } else {
      order.paymentStatus = 'partially_refunded';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refundId,
        amount,
        reason,
        refundedAt: new Date()
      },
      order
    });
  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({ message: 'Server error during refund processing' });
  }
});

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, or American Express',
        enabled: true
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay directly from your bank account',
        enabled: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        enabled: true
      },
      {
        id: 'cash_on_delivery',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        enabled: true
      }
    ]
  });
});

module.exports = router;