const asyncHandler = require("../middleware/asyncHandler");
const Message = require("../models/Message");
const myError = require("../utils/myError");
exports.getMessages = asyncHandler(async (req, res, next) => {
   res.status(200).json({
      success: true,
      data: "data",
   });
});
