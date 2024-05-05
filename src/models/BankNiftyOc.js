import { Schema, model, models } from "mongoose";
import { strickSchema } from "./strick";

const bankniftyOcSchema = new Schema({
  date: String,
  oc: [strickSchema],
});

const BankNiftyOc =
  models.BankNiftyOc || model("BankNiftyOc", bankniftyOcSchema);

export default BankNiftyOc;
