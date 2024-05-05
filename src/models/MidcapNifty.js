import { Schema, model, models } from "mongoose";
import { metaSchema } from "./meta";

const midcapSchema = new Schema({
  date: String,
  meta: [metaSchema],
});

const MidcapNifty = models.MidcapNifty || model("MidcapNifty", midcapSchema);

export default MidcapNifty;
