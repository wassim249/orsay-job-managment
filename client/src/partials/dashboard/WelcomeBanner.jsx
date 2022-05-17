import moment from "moment";
import React, { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { salute } from "../../utils/Utils";

function WelcomeBanner() {
  const [user, setUser] = useContext(UserContext);
  return (
    <div className="relative bg-pink-100 p-4 sm:p-6 rounded-sm overflow-hidden mb-8">
      {/* Content */}
      <div className="relative">
        <h1 className="text-2xl md:text-xl text-secondary font-montserat font-bold mb-1">
          {salute()}, {user && `${user.firstName} ${user.lastName}`}.
        </h1>
        <p className="font-montserat text-sm">
          Last connection :
          {user &&
            (moment(user.lastConnection).toDate().getFullYear() != 1970
              ? moment(user.lastConnection).format("DD/MM/YYYY HH:mm")
              : "Never")}
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
