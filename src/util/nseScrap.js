import { format } from "date-fns";

export default async function getOC(symbol, range) {
  try {
    const url = `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`;
    const responce = await fetch(url);
    const responceData = await responce.json();

    const price = parseFloat(responceData.records.underlyingValue);
    let totalCEOI = 0;
    let totalCEchageOI = 0;
    let totalPEOI = 0;
    let totalPEchageOI = 0;
    let date = new Date();
    let time = `${format(date, "HH:mm")}:00`;

    const oc = responceData.filtered.data
      .filter(
        (sp) =>
          sp.strikePrice >= price - range && sp.strikePrice <= price + range
      )
      .map((sp) => {
        totalCEOI += sp.CE.openInterest;
        totalCEchageOI += sp.CE.changeinOpenInterest;
        totalPEOI += sp.PE.openInterest;
        totalPEchageOI += sp.PE.changeinOpenInterest;
        return {
          strikePrice: sp.strikePrice,
          time,
          PE: {
            OI: sp.PE.openInterest,
            cOI: sp.PE.changeinOpenInterest,
            vol: sp.PE.totalTradedVolume,
            ltp: sp.PE.lastPrice,
          },
          CE: {
            OI: sp.CE.openInterest,
            cOI: sp.CE.changeinOpenInterest,
            vol: sp.CE.totalTradedVolume,
            ltp: sp.CE.lastPrice,
          },
        };
      });

    return {
      meta: {
        time,
        price,
        totalCEOI,
        totalCEchageOI,
        totalPEOI,
        totalPEchageOI,
      },
      oc,
    };
  } catch (error) {
    console.log(`Unable to get ${symbol} oc`);
    // console.log(error.message);
    // console.log(
    //   "=============================================================="
    // );
  }
}
