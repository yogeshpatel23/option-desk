import { Schema, models, model } from "mongoose";
import { strickSchema } from "./strick.model";

const niftyOCSchema = new Schema({
  date: String,
  data: [strickSchema],
});

const NiftyOC = models.NiftyOC || model("NiftyOC", niftyOCSchema);

export default NiftyOC;
