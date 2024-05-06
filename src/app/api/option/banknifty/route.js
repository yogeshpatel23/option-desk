import connectDB from "@/lib/connectDB";
import BankNifty from "@/models/BankNifty";
import BankNiftyOc from "@/models/BankNiftyOc";

import { getStoreData, storeData } from "@/util/fileStorge";
import getOC from "@/util/nseScrap";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getStoreData("bankNiftyDB.json");
  return NextResponse.json(data, { status: 200 });
}

export async function POST() {
  // get data from nse
  const data = await getOC("BANKNIFTY", 3000);
  // save recent data in local file
  if (!data) return NextResponse.json({ msg: "NOT_OK" }, { status: 200 });
  await storeData("latestBankNifty.json", data);

  try {
    await connectDB();
    const date = new Date();
    const catchedData = {};
    const banknifty = await BankNifty.findOne({ date: date.toDateString() });
    if (!banknifty || date.getMinutes() % 3 === 0) {
      if (banknifty) {
        banknifty.meta = [...banknifty.meta, data.meta];
        banknifty.save();
        catchedData["meta"] = banknifty.meta;
      } else {
        const newBankNifty = await BankNifty.create({
          date: date.toDateString(),
          meta: [data.meta],
        });
        catchedData["meta"] = newBankNifty.meta;
      }
    }

    const bankniftyOc = await BankNiftyOc.findOne({
      date: date.toDateString(),
    });
    if (!bankniftyOc || date.getMinutes() % 3 === 0) {
      if (bankniftyOc) {
        bankniftyOc.oc = [...bankniftyOc.oc, ...data.oc];
        bankniftyOc.save();
        catchedData["oc"] = bankniftyOc.oc;
      } else {
        const newBankNiftyOc = await BankNiftyOc.create({
          date: date.toDateString(),
          oc: data.oc,
        });
        catchedData["oc"] = newBankNiftyOc.oc;
      }
    }

    if (Object.keys(catchedData).length) {
      await storeData("bankNiftyDB.json", catchedData);
    }
  } catch (error) {
    console.log(`dbsvae error :: ${error}`);
  }
  return NextResponse.json({ msg: "OK" }, { status: 200 });
}
