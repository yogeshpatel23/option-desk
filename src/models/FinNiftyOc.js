import { Schema, model, models } from "mongoose";
import { strickSchema } from "./strick";

const finNiftyOcSchema = new Schema({
  date: String,
  oc: [strickSchema],
});

const FinNiftyOc = models.FinNiftyOc || model("FinNiftyOc", finNiftyOcSchema);

export default FinNiftyOc;
