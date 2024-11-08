const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: [true, "Username ee zaawal oruulj ugmuur baina aa!!!"],
         trim: true,
      },
      email: {
         type: String,
         required: [true, "Email ee oruulj ugmuur baina!!!"],
         unique: true,
         match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Email хаяг буруу байна.",
         ],
      },
      role: {
         type: String,
         default: "user",
      },
      rooms: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
         },
      ],

      password: {
         type: String,
         required: [true, "password oruulj uguh heregtei hu"],
         select: false,
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      createdAt: {
         type: Date,
         default: Date.now,
      },
   },
   { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

UserSchema.virtual("rooms", {
   ref: "Room",
   localField: "_id",
   foreignField: "room",
   justOne: false,
});

UserSchema.pre(
   "deleteOne",
   { document: true, query: false },
   async function (next) {
      await this.model("Room").deleteMany({ rooms: this._id });
      next();
   },
);

UserSchema.pre("save", async function () {
   // Nuuts ug oorchlogdoogui bol daraachiin middleware luu shiljine
   if (!this.isModified(this.password)) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
   }
});

UserSchema.methods.getJWT = function () {
   const token = jwt.sign(
      { id: this._id, role: this.role },
      process.env.JWT_SECRET,
      {
         expiresIn: process.env.EXPIRESIN,
      },
   );
   return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
   let match;
   try {
      match = await bcrypt.compare(enteredPassword, this.password);
   } catch (err) {
      throw new myError("Email password not match!", 401);
   }
   return match;
};

UserSchema.methods.generatePasswordResetToken = async function () {
   const resetToken = crypto.randomBytes(30).toString("hex");
   this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
   return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
