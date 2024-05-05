import { Schema, model, models } from "mongoose";
import { metaSchema } from "./meta";

const finNifty = new Schema({
  date: String,
  meta: [metaSchema],
});

const FinNifty = models.FinNifty || model("FinNifty", finNifty);

export default FinNifty;
