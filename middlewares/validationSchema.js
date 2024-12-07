const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 2 })
      .withMessage("title must have at least 2 characters"),

    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isNumeric()
      .withMessage("price must be a number")
      .isLength({ min: 1 })
      .withMessage("price must have at least 1 character"), 
  ];
};

module.exports = {
  validationSchema,
};
