import { Schema } from "mongoose";

export const strickSchema = new Schema(
  {
    strikePrice: String,
    time: String,
    PE: { OI: Number, cOI: Number, vol: Number, ltp: Number },
    CE: { OI: Number, cOI: Number, vol: Number, ltp: Number },
  },
  { _id: false }
);
