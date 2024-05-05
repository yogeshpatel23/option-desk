import { Schema, model, models } from "mongoose";
import { strickSchema } from "./strick";

const midcapNiftyOcSchema = new Schema({
  date: String,
  oc: [strickSchema],
});

const MidcapNiftyOc =
  models.MidcapNiftyOc || model("MidcapNiftyOc", midcapNiftyOcSchema);

export default MidcapNiftyOc;
