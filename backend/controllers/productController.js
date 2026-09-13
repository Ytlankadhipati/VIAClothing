import Product from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * Escape special regex characters in a string to prevent ReDoS attacks.
 * Prevents inputs like `(a+)+$` from causing catastrophic backtracking.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

    // Text search: escape user input before building regex to prevent ReDoS
    if (search) {
      const safeSearch = escapeRegex(String(search));
      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
        { collection: { $regex: safeSearch, $options: "i" } },
        { tags: { $in: [new RegExp(safeSearch, "i")] } },
        { sku: { $regex: safeSearch, $options: "i" } },
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

    // Pagination — cap limit at 100 to prevent DoS via ?limit=999999
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .allowDiskUse(true)
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

    let baseSlug = (slug || name || "product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let generatedSlug = baseSlug || `via-product-${Date.now().toString().slice(-4)}`;
    let counter = 1;
    while (await Product.exists({ slug: generatedSlug })) {
      generatedSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    let baseSku = (sku || `VIA-${Date.now().toString().slice(-5)}`).toUpperCase();
    let generatedSku = baseSku;
    let skuCounter = 1;
    while (await Product.exists({ sku: generatedSku })) {
      generatedSku = `${baseSku}-${skuCounter}`;
      skuCounter++;
    }

    // Auto-calculate exact discount percentage if MRP is provided and greater than price
    let calculatedDiscount = discount || "";
    if (compareAtPrice && Number(compareAtPrice) > Number(price) && Number(price) > 0) {
      calculatedDiscount = `${Math.round(((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100)}% OFF`;
    }

    const product = await Product.create({
      name,
      slug: generatedSlug,
      description,
      shortDescription,
      category,
      collection,
      price,
      compareAtPrice,
      discount: calculatedDiscount,
      sku: generatedSku,
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
    if (req.body.price !== undefined || req.body.compareAtPrice !== undefined) {
      const current = await Product.findById(req.params.id);
      if (current) {
        const pPrice = req.body.price !== undefined ? Number(req.body.price) : current.price;
        const pCompare = req.body.compareAtPrice !== undefined ? Number(req.body.compareAtPrice) : current.compareAtPrice;
        if (pCompare && pCompare > pPrice && pPrice > 0) {
          req.body.discount = `${Math.round(((pCompare - pPrice) / pCompare) * 100)}% OFF`;
        }
      }
    }

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
