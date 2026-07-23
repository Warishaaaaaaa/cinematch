import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    poster: { type: String },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
