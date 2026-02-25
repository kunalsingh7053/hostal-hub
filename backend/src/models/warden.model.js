const mongoose = require("mongoose");

const wardenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    office: { type: String, default: "Hostel Office" },
    avatar: { type: String, default: null },
    access: {
      type: String,
      enum: ["allowed", "blocked"],
      default: "allowed"
    }
  },
  { timestamps: true }
);

/**
 * Only one warden allowed
 */
wardenSchema.pre("save", async function () {
  const existing = await mongoose.models.Warden.findOne();

  if (existing && existing._id.toString() !== this._id.toString()) {
    throw new Error("Only one warden allowed");
  }
});

module.exports = mongoose.model("Warden", wardenSchema);