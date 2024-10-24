import { createContext } from "react";
import { CrossContextType } from "../types/CrossContextType";

export const CrossContext = createContext<CrossContextType | null>(null)