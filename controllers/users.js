const myError = require("../../amazon_api/utils/myError");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const paginate = require("../utils/paginate");
exports.register = asyncHandler(async (req, res, next) => {
   const user = await User.create(req.body);
   const token = user.getJWT();

   res.status(200).json({
      succes: true,
      token: token,
      data: user,
   });
});

exports.login = asyncHandler(async (req, res, next) => {
   const { email, password } = req.body;
   if (!(email || password))
      throw new myError("Нууц үг эсвэл И-мэйл талбар хоосон байна", 400);

   const user = await User.findOne({ email: email }).select("+password");

   if (!user) throw new myError("Нууц үг эсвэл И-мэйл буруу байна", 401);

   const match = user.checkPassword(password);

   if (!match) throw new myError("Нууц үг эсвэл И-мэйл буруу байна", 401);

   res.status(200).json({
      succes: true,
      token: user.getJWT,
      data: user,
   });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
   const sort = req.query.sort;
   const select = req.query.select;
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 50;
   ["sort", "select", "page", "limit"].forEach((el) => delete req.query[el]);

   // Pagination
   const pagination = await paginate(User, page, limit);

   const users = await User.find(req.query, select)
      .sort(sort)
      .skip(pagination.start - 1)
      .limit(pagination.limit);

   if (!users) {
      throw new myError("Хэрэглэгч бүтгэгдээгүй байна", 404);
   }
   res.status(200).json({
      succes: true,
      data: users,
      pagination: pagination,
   });
});

exports.createUser = asyncHandler(async (req, res, next) => {
   const user = await User.create(req.body);

   if (!user) throw new myError(`Шаардлагатай талбар дутуу байна.`, 401);

   res.status(200).json({
      succes: true,
      data: user,
   });
});

exports.getUser = asyncHandler(async (req, res, next) => {
   const id = req.params.id;

   const user = await User.findById(id);

   if (!user) throw new myError(`${id} ID-тай хэрэглэгч олдсонгүй`, 401);

   res.status(200).json({
      succes: true,
      data: user,
   });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });
   if (!user) throw new myError(`${id} ID-тай хэрэглэгч олдсонгүй`, 401);

   res.status(200).json({
      succes: true,
      data: user,
   });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
   const user = await User.findByIdAndDelete(req.params.id);
   if (!user) throw new myError(`${id} ID-тай хэрэглэгч олдсонгүй`, 401);
   res.status(200).json({
      succes: true,
      data: user,
   });
});
