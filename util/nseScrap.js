export default async function getOC(symbol) {
  try {
    const url = `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`;
    const responce = await fetch(url);
    const responceData = await responce.json();

    const price = responceData.records.underlyingValue;
    let totalCEOI = 0;
    let totalCEchageOI = 0;
    let totalPEOI = 0;
    let totalPEchageOI = 0;
    let date = new Date();
    let time = `${date.getHours()}:${date.getMinutes()}:00`;

    const oc = responceData.filtered.data
      .filter(
        (sp) => sp.strikePrice >= price - 1500 && sp.strikePrice <= price + 1500
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
      putcall: {
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
    console.log(error);
  }
}
