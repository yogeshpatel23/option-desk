import { Schema, model, models } from "mongoose";
import { metaSchema } from "./meta";

const niftySchema = new Schema({
  date: String,
  meta: [metaSchema],
});

const Nifty = models.Nifty || model("Nifty", niftySchema);

export default Nifty;
