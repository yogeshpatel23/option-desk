import { getStoreData } from "@/util/fileStorge";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getStoreData("bankexDB.json");
  return NextResponse.json(data, { status: 200 });
}
