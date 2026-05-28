import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please state a price'],
      default: 0.0,
    },
    stock: {
      type: Number,
      required: [true, 'Please state stock availability'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
