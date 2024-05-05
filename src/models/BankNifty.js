import { Schema, model, models } from "mongoose";
import { metaSchema } from "./meta";

const bankniftySchema = new Schema({
  date: String,
  meta: [metaSchema],
});

const BankNifty = models.BankNifty || model("BankNifty", bankniftySchema);

export default BankNifty;
