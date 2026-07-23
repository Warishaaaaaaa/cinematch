import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    poster: { type: String },
    rating: { type: Number, default: 0 },
    genre: [{ type: String }],
    year: { type: String },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A user can only favorite the same movie once
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
