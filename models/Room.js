const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      type: {
         type: String,
         enum: ["public", "private"],
         default: "public",
      },
      members: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      createdAt: {
         type: Date,
         default: Date.now,
      },
   },
   { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

RoomSchema.pre(
   "deleteOne",
   { document: true, query: false },
   async function (next) {
      await this.model("Room").deleteMany({ rooms: this._id });
      next();
   },
);

RoomSchema.pre("save", async function () {
   // Nuuts ug oorchlogdoogui bol daraachiin middleware luu shiljine
   if (!this.isModified(this.password)) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
   }
});

module.exports = mongoose.model("Room", RoomSchema);
