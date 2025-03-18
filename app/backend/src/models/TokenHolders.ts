import mongoose, { Schema, Document } from "mongoose";

export interface ITokenHolders extends Document {
  tokenAddress: string;
  tokenName: string;
  total: number;
  holders: any[];
}

const TokenHoldersSchema = new Schema({
  tokenAddress: { type: String, required: true, unique: true },
  tokenName: { type: String, required: true },
  total: { type: Number, required: true },
  holders: [
    {
      holder: { type: String, required: true },
      percentage: { type: Number, min: 0, max: 100 },
      amount: { type: Number, min: 0 },
      isContract: { type: Boolean, default: false },
    },
  ],
});

export default mongoose.model<ITokenHolders>(
  "TokenHolders",
  TokenHoldersSchema
);
