import { Schema, model, models } from "mongoose";
import { metaSchema } from "./meta";

const bankexSchema = new Schema({
  date: String,
  meta: [metaSchema],
});

const Bankex = models.Bankex || model("Bankex", bankexSchema);

export default Bankex;
