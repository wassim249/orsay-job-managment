import { useContext } from "react";
import LangContext from "../contexts/LangContext";
import LANG from "../../../i18n/lang.json";

export const Scheduled = ({ scheduled = false }) => {
  const [lang] = useContext(LangContext);

  return (
    <div
      className={`${
        scheduled ? "bg-slate-500" : "bg-slate-700"
      }  px-3 py-2 text-center text-white font-semibold rounded-lg`}
    >
      {scheduled
        ? LANG["common"]["Scheduled"][lang]
        : LANG["common"]["Not Scheduled"][lang]}
    </div>
  );
};
