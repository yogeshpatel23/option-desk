import { Schema, model, models } from "mongoose";
import { putcallSchema } from "./putcall.model";

const niftySchema = new Schema({
  date: String,
  data: [putcallSchema],
});

const Nifty = models.Nifty || model("Nifty", niftySchema);

export default Nifty;
