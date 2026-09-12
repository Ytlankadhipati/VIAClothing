import { validationResult } from "express-validator";

/**
 * Runs an array of express-validator validation chains, then
 * collects any errors and returns a structured 400 response.
 *
 * Usage in a route:
 *   router.post("/register", validate([
 *     body("email").isEmail(),
 *     body("password").isLength({ min: 8 }),
 *   ]), register);
 *
 * @param {import("express-validator").ValidationChain[]} validations
 * @returns {import("express").RequestHandler}
 */
export const validate = (validations) => async (req, res, next) => {
  // Run all validation chains
  for (const validation of validations) {
    const result = await validation.run(req);
    if (!result.isEmpty()) break; // fail-fast on first error chain
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please check the fields below.",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};
