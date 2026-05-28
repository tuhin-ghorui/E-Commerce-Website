import Product from '../models/Product.js';

// @desc    Get all products with searching, filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // Search query construction
    const searchFilter = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    // Category query construction
    const categoryFilter = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category }
      : {};

    const filter = { ...searchFilter, ...categoryFilter };

    // Sorting options construction
    let sortQuery = { createdAt: -1 }; // Default: Newest first
    if (req.query.sort === 'price-asc') {
      sortQuery = { price: 1 };
    } else if (req.query.sort === 'price-desc') {
      sortQuery = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sortQuery = { rating: -1 };
    }

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortQuery)
      .limit(limit)
      .skip(skip);

    res.json({
      products,
      page,
      pages: Math.ceil(totalProducts / limit) || 1,
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found in catalogue');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  const { name, price, description, category, stock, image } = req.body;

  try {
    const product = new Product({
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      image: image || undefined,
      rating: 5.0,
      reviews: [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  const { name, price, description, category, stock, image } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      if (image !== undefined) product.image = image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found to update');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found to delete');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user === req.user.name
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this product');
      }

      const review = {
        user: req.user.name,
        rating: Number(rating),
        comment,
      };

      product.reviews.unshift(review);

      // Re-calculate average ratings score
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json(product);
    } else {
      res.status(404);
      throw new Error('Product not found to review');
    }
  } catch (error) {
    next(error);
  }
};
