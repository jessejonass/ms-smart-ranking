import * as mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema(
  {
    category: String,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    def: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    result: [{ set: String }],
  },
  {
    timestamps: true,
    collection: 'challenges',
  },
);
