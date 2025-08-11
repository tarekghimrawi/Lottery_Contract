const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticate, requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get various statistics
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      recentOrders,
      productStats,
      orderStats
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName email'),
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$price', '$inventory.quantity'] } }
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            statusBreakdown: {
              $push: {
                status: '$status',
                amount: '$totalAmount'
              }
            }
          }
        }
      ])
    ]);

    // Calculate monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: orderStats[0]?.totalRevenue || 0,
        averageOrderValue: orderStats[0]?.averageOrderValue || 0
      },
      recentOrders,
      productStats,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private/Admin
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/products/low-stock
// @desc    Get products with low stock
// @access  Private/Admin
router.get('/products/low-stock', async (req, res) => {
  try {
    const products = await Product.find({
      'inventory.trackQuantity': true,
      $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
    }).select('name sku inventory category');

    res.json({ products });
  } catch (error) {
    console.error('Low stock products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;