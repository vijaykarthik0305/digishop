import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@desc  Fetch All Products
//@route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc  Fetch Single Product
//@route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product Not Found!' });
  }
});

//@desc  Delete Single Product
//@route DELETE /api/products/:id
// @access Private, Admin
const deleteProduct = asyncHandler(async (req, res) => {
  if (!req.session.userId || !req.session.isAdmin) {
    res.status(403).json({ message: 'Not Authorized, Admin privileges required!' });
    return;
  }

  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product Removed Successfully.' });
  } else {
    res.status(404).json({ message: 'Product Not Found!' });
  }
});

//@desc  Create a Product
//@route POST /api/products
// @access Private, Admin
const createProduct = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(403).json({ message: 'Not Authorized, Admin privileges required!' });
  }

  // Extract fields from the request body
  const { name, price, brand, category, countInStock, description, image } = req.body;

  // Validate all required fields
  if (!name || !price || !image || !brand || !category || countInStock === undefined || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Create a new product instance
  const product = new Product({
    name,
    price,
    user: req.session.userId, // Store the ID of the user creating the product
    image, // Image from the request body (assumed to be a URL or file name)
    brand,
    category,
    countInStock,
    numReviews: 0, // Initialize the number of reviews to 0
    description,
  });

  // Attempt to save the product
  try {
    const createdProduct = await product.save();
    return res.status(201).json(createdProduct); // Respond with the created product
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
});


//@desc  Update a Product
//@route PUT /api/products/:id
// @access Private, Admin
const updateProduct = asyncHandler(async (req, res) => {
  if (!req.session.userId || !req.session.isAdmin) {
    res.status(403).json({ message: 'Not Authorized, Admin privileges required!' });
    return;
  }

  const { name, price, image, brand, category, countInStock, description } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.description = description || product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product Not Found!' });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  if (!req.session.userId) {
    res.status(403).json({ message: 'Not Authorized, please log in!' });
    return;
  }

  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.session.userId.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Product already reviewed' });
      return;
    }

    const review = {
      name: req.session.userName || 'Anonymous', // Fallback to 'Anonymous' if userName is not set
      rating: Number(rating),
      comment,
      user: req.session.userId,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProductById,
  getTopProducts,
  createProductReview,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
};
