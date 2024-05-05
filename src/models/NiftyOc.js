import { Schema, models, model } from "mongoose";
import { strickSchema } from "./strick";

const niftyOcSchema = new Schema({
  date: String,
  oc: [strickSchema],
});

const NiftyOc = models.NiftyOc || model("NiftyOc", niftyOcSchema);

export default NiftyOc;
