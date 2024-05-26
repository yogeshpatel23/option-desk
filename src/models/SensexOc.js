import { Schema, model, models } from "mongoose";
import { strickSchema } from "./strick";

const sensexOcShema = new Schema({
  date: String,
  oc: [strickSchema],
});

const SensexOc = models.SensexOc || model("SensexOc", sensexOcShema);

export default SensexOc;
