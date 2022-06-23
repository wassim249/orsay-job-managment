import { useContext } from "react";
import LangContext from "../contexts/LangContext";
import LANG from "../../../i18n/lang.json";

export const Status = ({ success = true, className = "", icon = false }) => {
  const [lang] = useContext(LangContext);

  return icon ? (
    <div
      className={`${
        success ? "bg-teal-500" : "bg-rose-500"
      }  p-2 text-center text-white font-bold ${className} rounded-md`}
    >
      {success ? "✓" : "X"}
    </div>
  ) : (
    <div
      className={`${
        success ? "bg-rose-500" : "bg-red-400"
      }  px-3 py-2 w-32 text-center text-white font-bold ${className} rounded-md`}
    >
      {success
        ? LANG["common"]["succeed"][lang]
        : LANG["common"]["failed"][lang]}
    </div>
  );
};
