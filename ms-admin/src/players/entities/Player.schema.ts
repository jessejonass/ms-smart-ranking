import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: String,
    name: String,
    enum: String,
    ranking: String,
    rankingPosition: Number,
    imageUrl: String,
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
