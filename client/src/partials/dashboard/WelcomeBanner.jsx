import moment from "moment";
import React , {useContext} from "react";
import UserContext from "../../contexts/UserContext";

function WelcomeBanner() {
  const [user, setUser] = useContext(UserContext);
  return (
    <div className="relative bg-pink-100 p-4 sm:p-6 rounded-sm overflow-hidden mb-8">
      {/* Content */}
      <div className="relative">
        <h1 className="text-2xl md:text-3xl text-secondary font-montserat font-bold mb-1">
          Good afternoon, {user && `${user.firstName} ${user.lastName}`}.
        </h1>
        <p className="font-montserat">Last connection : {
          user &&
    moment(user.lastConnection).format("DD/MM/YYYY")
        }</p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
