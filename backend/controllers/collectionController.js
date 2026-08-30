import Collection from "../models/Collection.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ active: true }).populate("products");
    return successResponse(res, 200, "Collections retrieved.", { collections });
  } catch (err) {
    next(err);
  }
};

export const createCollection = async (req, res, next) => {
  try {
    const { name, description, banner, products } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const collection = await Collection.create({ name, slug, description, banner, products: products || [] });
    return successResponse(res, 201, "Collection created.", { collection });
  } catch (err) {
    next(err);
  }
};
