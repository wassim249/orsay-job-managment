import moment from "moment";
import React, { useContext } from "react";
import LangContext from "../../contexts/LangContext";
import UserContext from "../../contexts/UserContext";
import { salute } from "../../utils/Utils";
import LANG from "../../../../i18n/lang";

function WelcomeBanner() {
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  return (
    <div className="relative bg-indigo-100 p-4 sm:p-6 overflow-hidden mb-8 rounded-lg shadow hover:bg-indigo-200 transition duration-300">
      {/* Content */}
      <div className="relative">
        <h1 className="text-2xl md:text-xl text-indigo-500   font-bold mb-1">
          {salute(lang)}, {user && `${user.firstName} ${user.lastName}`}.
        </h1>
        <p className="text-sm text-indigo-900">
          {LANG["home"]["last connection"][lang]} :&nbsp;
          {user &&
            (moment(user.lastConnection).toDate().getFullYear() != 1970
              ? moment(user.lastConnection).format("DD/MM/YYYY HH:mm")
              : "Now")}
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
