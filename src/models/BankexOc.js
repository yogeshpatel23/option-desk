import { Schema, model, models } from "mongoose";
import { strickSchema } from "./strick";

const bankexOcSchema = new Schema({
  date: String,
  oc: [strickSchema],
});

const BankexOc = models.BankexOc || model("BankexOc", bankexOcSchema);

export default BankexOc;
