import connectDB from "@/lib/connectDB";
import NiftyOc from "@/models/NiftyOc";
import Nifty from "@/models/Nifty";
import { getStoreData, storeData } from "@/util/fileStorge";
import getOC from "@/util/nseScrap";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getStoreData("niftyDB.json");
  return NextResponse.json(data, { status: 200 });
}

export async function POST() {
  // get data from nse
  const data = await getOC("NIFTY", 1500);
  // save recent data in local file
  if (!data) return NextResponse.json({ msg: "NOT_OK" }, { status: 200 });
  await storeData("latestNifty.json", data);

  try {
    await connectDB();
    const date = new Date();
    const catchedData = {};
    const nifty = await Nifty.findOne({ date: date.toDateString() });
    if (!nifty || date.getMinutes() % 3 === 0) {
      if (nifty) {
        nifty.meta = [...nifty.meta, data.meta];
        nifty.save();
        catchedData["meta"] = nifty.meta;
      } else {
        const newNifty = await Nifty.create({
          date: date.toDateString(),
          meta: [data.meta],
        });
        catchedData["meta"] = newNifty.meta;
      }
    }

    const niftyOc = await NiftyOc.findOne({ date: date.toDateString() });
    if (!niftyOc || date.getMinutes() % 3 === 0) {
      if (niftyOc) {
        niftyOc.oc = [...niftyOc.oc, ...data.oc];
        niftyOc.save();
        catchedData["oc"] = niftyOc.oc;
      } else {
        const newNiftyOc = await NiftyOc.create({
          date: date.toDateString(),
          oc: data.oc,
        });
        catchedData["oc"] = newNiftyOc.oc;
      }
    }

    if (Object.keys(catchedData).length) {
      await storeData("niftyDB.json", catchedData);
    }
  } catch (error) {
    console.log(`dbsvae error :: ${error}`);
  }
  return NextResponse.json({ msg: "OK" }, { status: 200 });
}
