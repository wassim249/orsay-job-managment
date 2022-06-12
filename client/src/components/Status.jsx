import { useContext } from "react";
import LangContext from "../contexts/LangContext";
import LANG from "../../../i18n/lang.json";

export const Status = ({ success = true, className = "", icon = false }) => {
  const [lang] = useContext(LangContext);

  return icon ? (
    <div
      className={`${
        success ? "bg-green-500" : "bg-red-500"
      }  p-2 text-center text-white font-bold ${className}`}
    >
      {success ? "✓" : "X"}
    </div>
  ) : (
    <div
      className={`${
        success ? "bg-green-500" : "bg-red-500"
      }  px-3 py-2 w-32 text-center text-white font-bold ${className}`}
    >
      {success
        ? LANG["common"]["succeed"][lang]
        : LANG["common"]["failed"][lang]}
    </div>
  );
};
