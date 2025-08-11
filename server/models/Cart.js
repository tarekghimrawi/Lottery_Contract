const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  variant: {
    name: String,
    value: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days
  }
}, {
  timestamps: true
});

// Index for better performance
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Calculate totals before saving
cartSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    
    // Populate products to get prices
    await this.populate('items.product');
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, variant = null) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      variant
    });
  }
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId, variant = null) {
  this.items = this.items.filter(item => 
    !(item.product.toString() === productId.toString() &&
      JSON.stringify(item.variant) === JSON.stringify(variant))
  );
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, variant = null) {
  const itemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
  }
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalItems = 0;
  this.totalAmount = 0;
};

module.exports = mongoose.model('Cart', cartSchema);