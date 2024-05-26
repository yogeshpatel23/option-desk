import { format } from "date-fns";

export async function getOptionChain(symbol, strikecount, key, token) {
  const date = new Date();
  try {
    const response = await fetch(
      `https://api-t1.fyers.in/data/options-chain-v3?symbol=${symbol}&strikecount=${strikecount}`,
      {
        method: "GET",
        headers: {
          Authorization: `${key}:${token}`,
        },
      }
    );

    const responseData = await response.json();

    if (responseData.s !== "ok") return null;

    let data = responseData.data;
    let oc = [];
    let rawOc = data.optionsChain;
    let totalCEOI = 0;
    let totalCEchageOI = 0;
    let totalPEOI = 0;
    let totalPEchageOI = 0;
    rawOc.forEach((ele, i) => {
      if (ele.strike_price !== -1) {
        let sp = oc.find((e) => e.strikePrice === ele.strike_price);
        if (sp) {
          if (ele.option_type === "CE") {
            totalCEOI += ele.oi;
            totalCEchageOI += ele.oich;
            sp["CE"] = {
              OI: ele.oi,
              cOI: ele.oich,
              vol: ele.volume,
              ltp: ele.ltp,
            };
          } else {
            (totalPEOI += ele.oi), (totalPEchageOI += ele.oich);
            sp["PE"] = {
              OI: ele.oi,
              cOI: ele.oich,
              vol: ele.volume,
              ltp: ele.ltp,
            };
          }
        } else {
          if (ele.option_type === "CE") {
            totalCEOI += ele.oi;
            totalCEchageOI += ele.oich;
            oc.push({
              strikePrice: ele.strike_price,
              time: `${format(date, "HH:mm")}:00`,
              CE: {
                OI: ele.oi,
                cOI: ele.oich,
                vol: ele.volume,
                ltp: ele.ltp,
              },
            });
          } else {
            (totalPEOI += ele.oi), (totalPEchageOI += ele.oich);
            oc.push({
              strikePrice: ele.strike_price,
              time: `${format(date, "HH:mm")}:00`,
              PE: {
                OI: ele.oi,
                cOI: ele.oich,
                vol: ele.volume,
                ltp: ele.ltp,
              },
            });
          }
        }
      }
    });

    return {
      meta: {
        price: rawOc[0].ltp,
        time: `${format(date, "HH:mm")}:00`,
        totalCEOI,
        totalCEchageOI,
        totalPEOI,
        totalPEchageOI,
      },
      oc,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
