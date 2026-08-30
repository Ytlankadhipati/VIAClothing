import Product from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * @desc    Get all products with server-side filtering, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      collection,
      minPrice,
      maxPrice,
      sort,
      featured,
      bestseller,
      newArrival,
      inStock,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { active: true };

    // Text search or regex match
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { collection: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Collection filter
    if (collection && collection !== "All") {
      query.collection = collection;
    }

    // Featured / BestSeller / NewArrival tags
    if (featured === "true") query.featured = true;
    if (bestseller === "true") query.bestseller = true;
    if (newArrival === "true") query.newArrival = true;

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In Stock filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === "price-asc") sortOptions = { price: 1 };
    else if (sort === "price-desc") sortOptions = { price: -1 };
    else if (sort === "rating") sortOptions = { ratings: -1 };
    else if (sort === "bestseller") sortOptions = { bestseller: -1, createdAt: -1 };
    else if (sort === "featured") sortOptions = { featured: -1, createdAt: -1 };

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, 200, "Products retrieved successfully.", {
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single product by ID or Slug
 * @route   GET /api/products/:idOrSlug
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Try lookup by MongoDB ObjectId, fallback to slug or id string
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({
        $or: [{ slug: id.toLowerCase() }, { sku: id.toUpperCase() }, { id: id }],
      });
    }

    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    return successResponse(res, 200, "Product details retrieved.", { product });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      category,
      collection,
      price,
      compareAtPrice,
      discount,
      sku,
      images,
      sizes,
      colors,
      variants,
      gsm,
      fit,
      material,
      specs,
      careInstructions,
      tags,
      featured,
      bestseller,
      newArrival,
      stock,
    } = req.body;

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const product = await Product.create({
      name,
      slug: generatedSlug,
      description,
      shortDescription,
      category,
      collection,
      price,
      compareAtPrice,
      discount,
      sku: sku || `VIA-${Date.now().toString().slice(-5)}`,
      images: Array.isArray(images) && images.length ? images : ["/assets/via-logo.png"],
      sizes: sizes || ["S", "M", "L", "XL", "XXL"],
      colors: colors || ["Black"],
      variants: variants || [],
      gsm,
      fit,
      material,
      specs: specs || [],
      careInstructions: careInstructions || [],
      tags: tags || [],
      featured: !!featured,
      bestseller: !!bestseller,
      newArrival: !!newArrival,
      stock: stock || 50,
    });

    return successResponse(res, 201, "Product created successfully.", { product });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    return successResponse(res, 200, "Product updated successfully.", { product });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete or deactivate product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    return successResponse(res, 200, "Product deleted successfully.");
  } catch (err) {
    next(err);
  }
};
