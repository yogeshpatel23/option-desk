import connectDB from "@/lib/connectDB";
import Nifty from "@/models/nifty.modle";
import NiftyOC from "@/models/niftyOC.model";
import { getStoreData, storeData } from "@/util/fileStorge";
import getOC from "@/util/nseScrap";
import { NextResponse } from "next/server";

export async function POST() {
  // get data from NSE
  const { putcall, oc } = await getOC("NIFTY");

  // Save recent data in local file
  await storeData("latestNifty.json", { putcall, oc });

  try {
    // find today entry in DB
    await connectDB();
    const date = new Date();
    const catchedData = {};
    const nifty = await Nifty.findOne({ date: date.toDateString() });
    if (!nifty || date.getMinutes() % 3 === 0) {
      if (nifty) {
        nifty.data = [...nifty.data, putcall];
        nifty.save();
        catchedData["nifty"] = nifty.data;
      } else {
        const newNifty = await Nifty.create({
          date: date.toDateString(),
          data: [putcall],
        });
        catchedData["nifty"] = newNifty.data;
      }
    }

    const niftyoc = await NiftyOC.findOne({ date: date.toDateString() });
    if (!niftyoc || date.getMinutes() % 3 === 0) {
      if (niftyoc) {
        niftyoc.data = [...niftyoc.data, oc];
        niftyoc.save();
        catchedData["niftyOC"] = niftyoc.data;
      } else {
        const newNiftyOC = await NiftyOC.create({
          date: date.toDateString(),
          data: oc,
        });
        catchedData["niftyOC"] = newNiftyOC.data;
      }
    }

    if (Object.keys(catchedData).length) {
      await storeData("niftyDB.json", catchedData);
    }
  } catch (error) {
    console.log(`dbsvae error :: ${error}`);
  }

  // if current
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}

export async function GET() {
  const data = await getStoreData("niftyDB.json");
  return NextResponse.json(data, { status: 200 });
}
