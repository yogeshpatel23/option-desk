import connectDB from "@/lib/connectDB";
import MidcapNifty from "@/models/MidcapNifty";
import MidcapNiftyOc from "@/models/MidcapNiftyOc";

import { getStoreData, storeData } from "@/util/fileStorge";
import getOC from "@/util/nseScrap";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getStoreData("midcapNiftyDB.json");
  return NextResponse.json(data, { status: 200 });
}

export async function POST() {
  // get data from nse
  const data = await getOC("MIDCPNIFTY", 500);
  // save recent data in local file
  await storeData("latestMidcapNifty.json", data);

  try {
    await connectDB();
    const date = new Date();
    const catchedData = {};
    const midcapnifty = await MidcapNifty.findOne({
      date: date.toDateString(),
    });
    if (!midcapnifty || date.getMinutes() % 3 === 0) {
      if (midcapnifty) {
        midcapnifty.meta = [...midcapnifty.meta, data.meta];
        midcapnifty.save();
        catchedData["meta"] = midcapnifty.meta;
      } else {
        const newmidcapNifty = await MidcapNifty.create({
          date: date.toDateString(),
          meta: [data.meta],
        });
        catchedData["meta"] = newmidcapNifty.meta;
      }
    }

    const midcapniftyOc = await MidcapNiftyOc.findOne({
      date: date.toDateString(),
    });
    if (!midcapniftyOc || date.getMinutes() % 3 === 0) {
      if (midcapniftyOc) {
        midcapniftyOc.oc = [...midcapniftyOc.oc, ...data.oc];
        midcapniftyOc.save();
        catchedData["oc"] == midcapniftyOc.oc;
      } else {
        const newmidcapNiftyOc = await MidcapNiftyOc.create({
          date: date.toDateString(),
          oc: data.oc,
        });
        catchedData["oc"] = newmidcapNiftyOc.oc;
      }
    }

    if (Object.keys(catchedData).length) {
      await storeData("midcapNiftyDB.json", catchedData);
    }
  } catch (error) {
    console.log(`dbsvae error :: ${error}`);
  }
  return NextResponse.json({ msg: "OK" }, { status: 200 });
}
