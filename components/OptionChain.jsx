import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OptionChain = () => {
  const [optionChain, setOptionChain] = useState([])
  const [highestValues, setHighestValues] = useState({})

  const latestData = useSelector(store=> store.latestData)
  
  useEffect(() => {
    let price = latestData?.symbol.price
    let oc = [];
    let ceHighVol = null; 
    let ceHighoi = null; 
    let ceHighcoi = null;
    let peHighVol = null; 
    let peHighoi = null; 
    let peHighcoi = null; 
    latestData?.oc.forEach(e => {
      if(e.strikePrice > (price -250) && e.strikePrice < (price + 250)){
        oc.push(e)
      }
      // ceHighVol === null ? e.CE.vol : ceHighVol > e.CE.vol ? ceHighVol : e.CE.vol
      ceHighVol = ceHighVol > e.CE.vol ? ceHighVol : e.CE.vol
      ceHighoi = ceHighoi > e.CE.OI ? ceHighoi : e.CE.OI
      ceHighcoi = ceHighcoi > e.CE.cOI ? ceHighcoi : e.CE.cOI
      peHighVol = peHighVol > e.PE.vol ? peHighVol : e.PE.vol
      peHighoi = peHighoi > e.PE.OI ? peHighoi : e.PE.OI
      peHighcoi = peHighcoi > e.PE.cOI ? peHighcoi : e.PE.cOI
    });
    
    setOptionChain(() =>  oc)

    setHighestValues(() => ({
      ceHighVol,ceHighcoi,ceHighoi,peHighVol,peHighcoi,peHighoi
    }))
    
    return () => {
      
    }
  }, [latestData])
  
  return (
    <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md">
      <table className="w-full table-auto">
        <thead>
          <tr className="hidden md:contents">
            <th colSpan={4}>CALL</th>
            <th>Strick</th>
            <th colSpan={4}>PUT</th>
          </tr>
          <tr className="contents w-full md:hidden">
            <th colSpan={3}>CALL</th>
            <th>Strick</th>
            <th colSpan={3}>PUT</th>
          </tr>
          <tr>
            <th>OI</th>
            <th>COI</th>
            <th>Vol</th>
            <th className="hidden md:block">LTP</th>
            <th>{latestData?.symbol.price}</th>
            <th className="hidden md:block">LTP</th>
            <th>Vol</th>
            <th>COI</th>
            <th>OI</th>
          </tr>
        </thead>
        <tbody>
          {optionChain.map(d => (
            <tr className="text-center odd:bg-gray-200 dark:odd:bg-gray-700" key={d.strikePrice}>
              <td className={`${d.CE.OI == highestValues?.ceHighoi ? 'bg-red-400': '' }`}>{d.CE.OI}</td>
              <td className={`${d.CE.cOI == highestValues?.ceHighcoi ? 'bg-red-400': '' }`}>{d.CE.cOI}</td>
              <td className={`${d.CE.vol == highestValues?.ceHighVol ? 'bg-red-400': '' }`}>{d.CE.vol}</td>
              <td className="hidden md:block">{d.CE.ltp}</td>
              <td>{d.strikePrice}</td>
              <td className="hidden md:block">{d.PE.ltp}</td>
              <td className={`${d.PE.vol == highestValues?.peHighVol ? 'bg-blue-400': '' }`}>{d.PE.vol}</td>
              <td className={`${d.PE.cOI == highestValues?.peHighcoi ? 'bg-blue-400': '' }`}>{d.PE.cOI}</td>
              <td className={`${d.PE.OI == highestValues?.peHighoi ? 'bg-blue-400': '' }`}>{d.PE.OI}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OptionChain;
