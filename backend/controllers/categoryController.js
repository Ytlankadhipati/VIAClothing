import Category from "../models/Category.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true });
    return successResponse(res, 200, "Categories retrieved.", { categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await Category.create({ name, slug, description, image });
    return successResponse(res, 201, "Category created.", { category });
  } catch (err) {
    next(err);
  }
};
