import mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["standard", "emergency"],
      default: "standard"
    },
    announcement: {
      text: { type: String, default: "" },
      active: { type: Boolean, default: false },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
    },
    systemHealth: {
      status: { type: String, default: "Optimal" },
      lastAudit: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

export default mongoose.model("System", systemSchema);
