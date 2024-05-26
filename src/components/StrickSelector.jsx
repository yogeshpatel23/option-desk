import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setStricks } from "@/store/selectedStrickSlice";

const StrickSelector = () => {
  const latestData = useSelector((store) => store.latestData);
  const noc = useSelector((store) => store.settings.noc);
  const dispatch = useDispatch();
  const [strickOpt, setStrickOpt] = useState([]);
  const [selectdStrick, setSelectdStrick] = useState("");
  useEffect(() => {
    setStrickOpt(() => latestData.oc.map((e) => e.strikePrice));
    return () => {};
  }, [latestData]);

  function handleValueChange(v) {
    setSelectdStrick(v);
    let selectedIndex = strickOpt.indexOf(v);
    let si = selectedIndex - noc < 0 ? 0 : selectedIndex - noc;
    let ei = selectedIndex + +noc + 1;
    dispatch(setStricks(strickOpt.slice(si, ei).reverse()));
  }

  return (
    <Select value={selectdStrick} onValueChange={handleValueChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select Strick" />
      </SelectTrigger>
      <SelectContent>
        {strickOpt.map((so) => (
          <SelectItem key={so} value={so}>
            {so}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StrickSelector;
