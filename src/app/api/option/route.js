import connectDB from "@/lib/connectDB";
import BankNifty from "@/models/BankNifty";
import BankNiftyOc from "@/models/BankNiftyOc";
import Bankex from "@/models/Bankex";
import BankexOc from "@/models/BankexOc";
import FinNifty from "@/models/FinNifty";
import FinNiftyOc from "@/models/FinNiftyOc";
import MidcapNifty from "@/models/MidcapNifty";
import MidcapNiftyOc from "@/models/MidcapNiftyOc";
import Nifty from "@/models/Nifty";
import NiftyOc from "@/models/NiftyOc";
import Sensex from "@/models/Sensex";
import SensexOc from "@/models/SensexOc";
import { getStoreData, storeData } from "@/util/fileStorge";
import { getOptionChain } from "@/util/fyers";
import { isAfter } from "date-fns";
import { sha256 } from "js-sha256";
import { NextResponse } from "next/server";

export async function POST() {
  const account = await getStoreData("account.json");
  if (!account)
    return NextResponse.json(
      { msg: "Please Update Account Detail" },
      { status: 200 }
    );

  if (!account.token || !account.rfToken) {
    return NextResponse.json({ msg: "Please Generate Token" }, { status: 200 });
  }

  if (account.tokenExp !== new Date().toDateString()) {
    console.log("token expired");

    if (isAfter(new Date(), new Date(account.refTokenExp))) {
      return NextResponse.json(
        { msg: "Please Ref Toekn Generate Token" },
        { status: 200 }
      );
    } else {
      console.log("else");
      const response = await fetch(
        "https://api-t1.fyers.in/api/v3/validate-refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "refresh_token",
            appIdHash: sha256(`${account.key}:${account.secret}`),
            refresh_token: account.rfToken,
            pin: account.pin,
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      console.log(account.rfToken);
      if (responseData.s === "ok") {
        account.token = responseData.access_token;
        account.tokenExp = new Date().toDateString();
        storeData("account.json", account);
      } else {
        return NextResponse.json(responseData, { status: 200 });
      }
    }
  }

  const resMsg = {};
  try {
    await connectDB();
    const date = new Date();

    // Code to update NIFTY data
    const niftyData = await getOptionChain(
      "NSE:NIFTY50-INDEX",
      15,
      account.key,
      account.token
    );

    if (niftyData) {
      await storeData("latestNifty.json", niftyData);
      const niftyCatchedData = {};
      const nifty = await Nifty.findOne({ date: date.toDateString() });
      if (!nifty || date.getMinutes() % 3 === 0) {
        if (nifty) {
          nifty.meta = [...nifty.meta, niftyData.meta];
          nifty.save();
          niftyCatchedData["meta"] = nifty.meta;
        } else {
          const newNifty = await Nifty.create({
            date: date.toDateString(),
            meta: [niftyData.meta],
          });
          niftyCatchedData["meta"] = newNifty.meta;
        }
      }

      const niftyOc = await NiftyOc.findOne({ date: date.toDateString() });
      if (!niftyOc || date.getMinutes() % 3 === 0) {
        if (niftyOc) {
          niftyOc.oc = [...niftyOc.oc, ...niftyData.oc];
          niftyOc.save();
          niftyCatchedData["oc"] = niftyOc.oc;
        } else {
          const newNiftyOc = await NiftyOc.create({
            date: date.toDateString(),
            oc: niftyData.oc,
          });
          niftyCatchedData["oc"] = newNiftyOc.oc;
        }
      }

      if (Object.keys(niftyCatchedData).length) {
        await storeData("niftyDB.json", niftyCatchedData);
      }
      // resMsg["Nifty"] = "OK";
    } else {
      resMsg["Nifty"] = "ERROR";
    }

    // Update BNF
    const BNFdata = await getOptionChain(
      "NSE:NIFTYBANK-INDEX",
      15,
      account.key,
      account.token
    );

    if (BNFdata) {
      await storeData("latestBankNifty.json", BNFdata);
      const bnfCatchedData = {};
      const banknifty = await BankNifty.findOne({ date: date.toDateString() });
      if (!banknifty || date.getMinutes() % 3 === 0) {
        if (banknifty) {
          banknifty.meta = [...banknifty.meta, BNFdata.meta];
          banknifty.save();
          bnfCatchedData["meta"] = banknifty.meta;
        } else {
          const newBankNifty = await BankNifty.create({
            date: date.toDateString(),
            meta: [BNFdata.meta],
          });
          bnfCatchedData["meta"] = newBankNifty.meta;
        }
      }

      const bankniftyOc = await BankNiftyOc.findOne({
        date: date.toDateString(),
      });
      if (!bankniftyOc || date.getMinutes() % 3 === 0) {
        if (bankniftyOc) {
          bankniftyOc.oc = [...bankniftyOc.oc, ...BNFdata.oc];
          bankniftyOc.save();
          bnfCatchedData["oc"] = bankniftyOc.oc;
        } else {
          const newBankNiftyOc = await BankNiftyOc.create({
            date: date.toDateString(),
            oc: BNFdata.oc,
          });
          bnfCatchedData["oc"] = newBankNiftyOc.oc;
        }
      }

      if (Object.keys(bnfCatchedData).length) {
        await storeData("bankNiftyDB.json", bnfCatchedData);
      }
      // resMsg["BNF"] = "OK";
    } else {
      resMsg["BNF"] = "ERROR";
    }

    // Update Finnifty data
    const finData = await getOptionChain(
      "NSE:FINNIFTY-INDEX",
      15,
      account.key,
      account.token
    );

    if (finData) {
      await storeData("latestFinNifty.json", finData);
      const finCatchedData = {};
      const finnifty = await FinNifty.findOne({ date: date.toDateString() });
      if (!finnifty || date.getMinutes() % 3 === 0) {
        if (finnifty) {
          finnifty.meta = [...finnifty.meta, finData.meta];
          finnifty.save();
          finCatchedData["meta"] = finnifty.meta;
        } else {
          const newFinNifty = await FinNifty.create({
            date: date.toDateString(),
            meta: [finData.meta],
          });
          finCatchedData["meta"] = newFinNifty.meta;
        }
      }

      const finniftyOc = await FinNiftyOc.findOne({
        date: date.toDateString(),
      });
      if (!finniftyOc || date.getMinutes() % 3 === 0) {
        if (finniftyOc) {
          finniftyOc.oc = [...finniftyOc.oc, ...finData.oc];
          finniftyOc.save();
          finCatchedData["oc"] = finniftyOc.oc;
        } else {
          const newFinNiftyOc = await FinNiftyOc.create({
            date: date.toDateString(),
            oc: finData.oc,
          });
          finCatchedData["oc"] = newFinNiftyOc.oc;
        }
      }

      if (Object.keys(finCatchedData).length) {
        await storeData("finNiftyDB.json", finCatchedData);
      }
      // resMsg["FIN"] = "OK";
    } else {
      resMsg["FIN"] = "ERROR";
    }

    // Update MIDCAP data
    const midcpData = await getOptionChain(
      "NSE:MIDCPNIFTY-INDEX",
      15,
      account.key,
      account.token
    );

    if (midcpData) {
      await storeData("latestMidcapNifty.json", midcpData);
      const midCatchedData = {};
      const midcapnifty = await MidcapNifty.findOne({
        date: date.toDateString(),
      });
      if (!midcapnifty || date.getMinutes() % 3 === 0) {
        if (midcapnifty) {
          midcapnifty.meta = [...midcapnifty.meta, midcpData.meta];
          midcapnifty.save();
          midCatchedData["meta"] = midcapnifty.meta;
        } else {
          const newmidcapNifty = await MidcapNifty.create({
            date: date.toDateString(),
            meta: [midcpData.meta],
          });
          midCatchedData["meta"] = newmidcapNifty.meta;
        }
      }

      const midcapniftyOc = await MidcapNiftyOc.findOne({
        date: date.toDateString(),
      });
      if (!midcapniftyOc || date.getMinutes() % 3 === 0) {
        if (midcapniftyOc) {
          midcapniftyOc.oc = [...midcapniftyOc.oc, ...midcpData.oc];
          midcapniftyOc.save();
          midCatchedData["oc"] = midcapniftyOc.oc;
        } else {
          const newmidcapNiftyOc = await MidcapNiftyOc.create({
            date: date.toDateString(),
            oc: midcpData.oc,
          });
          midCatchedData["oc"] = newmidcapNiftyOc.oc;
        }
      }

      if (Object.keys(midCatchedData).length) {
        await storeData("midcapNiftyDB.json", midCatchedData);
      }
      // resMsg["MidCap"] = "OK";
    } else {
      resMsg["MidCap"] = "ERROR";
    }

    // Update Sensex data
    const sensexData = await getOptionChain(
      "BSE:SENSEX-INDEX",
      15,
      account.key,
      account.token
    );

    if (sensexData) {
      await storeData("latestSensex.json", sensexData);
      const sensexCatchedData = {};
      const sensex = await Sensex.findOne({
        date: date.toDateString(),
      });
      if (!sensex || date.getMinutes() % 3 === 0) {
        if (sensex) {
          sensex.meta = [...sensex.meta, sensexData.meta];
          sensex.save();
          sensexCatchedData["meta"] = sensex.meta;
        } else {
          const newSensex = await Sensex.create({
            date: date.toDateString(),
            meta: [sensexData.meta],
          });
          sensexCatchedData["meta"] = newSensex.meta;
        }
      }

      const sensexOc = await SensexOc.findOne({
        date: date.toDateString(),
      });
      if (!sensexOc || date.getMinutes() % 3 === 0) {
        if (sensexOc) {
          sensexOc.oc = [...sensexOc.oc, ...sensexData.oc];
          sensexOc.save();
          sensexCatchedData["oc"] = sensexOc.oc;
        } else {
          const newSensexOc = await SensexOc.create({
            date: date.toDateString(),
            oc: sensexData.oc,
          });
          sensexCatchedData["oc"] = newSensexOc.oc;
        }
      }

      if (Object.keys(sensexCatchedData).length) {
        await storeData("sensexDB.json", sensexCatchedData);
      }
      // resMsg["MidCap"] = "OK";
    } else {
      resMsg["sensex"] = "ERROR";
    }

    // Update Bankex data
    const bankexData = await getOptionChain(
      "BSE:BANKEX-INDEX",
      15,
      account.key,
      account.token
    );

    if (bankexData) {
      await storeData("latestBankex.json", bankexData);
      const bankexCatchedData = {};
      const bankex = await Bankex.findOne({
        date: date.toDateString(),
      });
      if (!bankex || date.getMinutes() % 3 === 0) {
        if (bankex) {
          bankex.meta = [...bankex.meta, bankexData.meta];
          bankex.save();
          bankexCatchedData["meta"] = bankex.meta;
        } else {
          const newBankex = await Bankex.create({
            date: date.toDateString(),
            meta: [bankexData.meta],
          });
          bankexCatchedData["meta"] = newBankex.meta;
        }
      }

      const bankexOc = await BankexOc.findOne({
        date: date.toDateString(),
      });
      if (!bankexOc || date.getMinutes() % 3 === 0) {
        if (bankexOc) {
          bankexOc.oc = [...bankexOc.oc, ...bankexData.oc];
          bankexOc.save();
          bankexCatchedData["oc"] = bankexOc.oc;
        } else {
          const newBankexOc = await BankexOc.create({
            date: date.toDateString(),
            oc: bankexData.oc,
          });
          bankexCatchedData["oc"] = newBankexOc.oc;
        }
      }

      if (Object.keys(bankexCatchedData).length) {
        await storeData("bankexDB.json", bankexCatchedData);
      }
      // resMsg["MidCap"] = "OK";
    } else {
      resMsg["bankex"] = "ERROR";
    }
  } catch (error) {}

  if (Object.keys(resMsg).length) {
    return NextResponse.json({ msg: "error", error: resMsg }, { status: 200 });
  }
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}
