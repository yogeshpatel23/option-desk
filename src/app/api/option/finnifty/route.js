import connectDB from "@/lib/connectDB";
import FinNifty from "@/models/FinNifty";
import FinNiftyOc from "@/models/FinNiftyOc";

import { getStoreData, storeData } from "@/util/fileStorge";
import getOC from "@/util/nseScrap";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getStoreData("finNiftyDB.json");
  return NextResponse.json(data, { status: 200 });
}

export async function POST() {
  // get data from nse
  const data = await getOC("FINNIFTY", 1500);
  // save recent data in local file
  await storeData("latestFinNifty.json", data);

  try {
    await connectDB();
    const date = new Date();
    const catchedData = {};
    const finnifty = await FinNifty.findOne({ date: date.toDateString() });
    if (!finnifty || date.getMinutes() % 3 === 0) {
      if (finnifty) {
        finnifty.meta = [...finnifty.meta, data.meta];
        finnifty.save();
        catchedData["meta"] = finnifty.meta;
      } else {
        const newfinNifty = await FinNifty.create({
          date: date.toDateString(),
          meta: [data.meta],
        });
        catchedData["meta"] = newfinNifty.meta;
      }
    }

    const finniftyOc = await FinNiftyOc.findOne({ date: date.toDateString() });
    if (!finniftyOc || date.getMinutes() % 3 === 0) {
      if (finniftyOc) {
        finniftyOc.oc = [...finniftyOc.oc, ...data.oc];
        finniftyOc.save();
        catchedData["oc"] == finniftyOc.oc;
      } else {
        const newfinNiftyOc = await FinNiftyOc.create({
          date: date.toDateString(),
          oc: data.oc,
        });
        catchedData["oc"] = newfinNiftyOc.oc;
      }
    }

    if (Object.keys(catchedData).length) {
      await storeData("finNiftyDB.json", catchedData);
    }
  } catch (error) {
    console.log(`dbsvae error :: ${error}`);
  }
  return NextResponse.json({ msg: "OK" }, { status: 200 });
}
