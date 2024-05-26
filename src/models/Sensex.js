import { Schema, model, models } from "mongoose";
import { metaSchema } from "./meta";

const sensexSchema = new Schema({
  date: String,
  meta: [metaSchema],
});

const Sensex = models.Sensex || model("Sensex", sensexSchema);

export default Sensex;
