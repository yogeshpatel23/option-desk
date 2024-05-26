import { getStoreData } from "@/util/fileStorge";
import { NextResponse } from "next/server";

export async function GET() {
  // TODO:: avilable between 9:16 - 3:30
  const data = await getStoreData("latestSensex.json");
  return NextResponse.json(data, { status: 200 });
}
