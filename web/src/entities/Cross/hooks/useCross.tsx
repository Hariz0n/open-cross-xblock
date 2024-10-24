import { useContext } from "react";
import { CrossContext } from "../libs/CrossContext";

export const useCross = () => {
  return useContext(CrossContext);
};
