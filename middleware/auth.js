const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.protect = asyncHandler(async (req, res, next) => {
   next();
});
exports.authorize = asyncHandler(async (req, res, next) => {
   next();
});
