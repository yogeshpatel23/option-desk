"use server";

import { getStoreData, storeData } from "@/util/fileStorge";
import { revalidatePath } from "next/cache";
import { sha256 } from "js-sha256";
import { add } from "date-fns";

export async function getAccount() {
  const account = await getStoreData("account.json");
  return account;
}

export async function updateAccount(formData) {
  let data = Object.fromEntries(formData.entries());
  await storeData("account.json", {
    key: data.key,
    secret: data.secret,
    rdurl: data.rdurl, //https://trade.fyers.in/api-login/redirect-uri/index.html
    pin: data.pin,
  });

  revalidatePath("/admin");
}

export async function updateTokens(formData) {
  let date = new Date();
  const account = await getStoreData("account.json");
  const code = formData.get("code");
  const appIdHash = sha256(`${account.key}:${account.secret}`);
  const response = await fetch(
    "https://api-t1.fyers.in/api/v3/validate-authcode",
    {
      method: "POST",
      body: JSON.stringify({
        grant_type: "authorization_code",
        appIdHash: appIdHash,
        code: code,
      }),
    }
  );
  const responseData = await response.json();
  console.log(responseData);
  if (responseData.s === "ok") {
    account["token"] = responseData.access_token;
    account["tokenExp"] = date.toDateString();
    account["rfToken"] = responseData.refresh_token;
    account["refTokenExp"] = add(date, { days: 14 }).toDateString();
    await storeData("account.json", account);
  }

  revalidatePath("/admin");
}
