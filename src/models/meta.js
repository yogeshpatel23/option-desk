import { Schema } from "mongoose";

export const metaSchema = new Schema(
  {
    time: String,
    price: Number,
    totalCEOI: Number,
    totalCEchageOI: Number,
    totalPEOI: Number,
    totalPEchageOI: Number,
  },
  {
    _id: false,
  }
);
