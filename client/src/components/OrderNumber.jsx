import { RiScan2Fill } from "react-icons/ri";
import { FiClock } from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineFile } from "react-icons/ai";
import { Status } from "./Status";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LANG from "../../../i18n/lang.json";
import { useContext } from "react";
import LangContext from "../contexts/LangContext";

export const OrderNumber = ({ order }) => {
  const navigate = useNavigate();
  const [lang] = useContext(LangContext);

  return (
    <div className="bg-white shadow w-full flex flex-col justify-center items-center rounded-lg hover:scale-105 transition-all duration-300 ease-in-out">
      <div className="text-xl bg-indigo-300 w-full h-24 flex justify-center items-center font-semibold mb-4 rounded-lg">
        {order.order}
      </div>
      <div className="flex justify-between px-4 items-center w-full">
        <div className="flex items-center w-full ">
          <FiClock size={15} color="#e11d48" className="mr-2" />
          <span className="text-sm">
            {moment(order.createdAt).format("DD/MM/YYYY hh:mm:ss")}
          </span>
        </div>

        <Status success={order.status == "success"} icon className="w-12 p-1" />
      </div>

      <div className="text-left w-full px-4 ">
        <div
          onClick={() => navigate(`/user/${order.scan.user.id}`)}
          className="text-sm text-secondary flex items-center hover:cursor-pointer hover:underline"
        >
          <BiUserCircle size={15} color="#e11d48" className="mr-2" />{" "}
          {LANG["common"]["By"][lang]} :
          <span>
            {`${order.scan.user.firstName} ${order.scan.user.lastName}`}
          </span>
        </div>
        <div className="flex items-center">
          <AiOutlineFile size={15} color="#e11d48" className="mr-2" />
          <span className="text-sm">
            {LANG["common"]["File"][lang]} : ...
            {order.fileName.substr(order.fileName.length - 25)}
          </span>
        </div>

        <div
          className="flex items-center mb-2 hover:cursor-pointer hover:underline"
          onClick={() => navigate(`/scan/${order.scan.id}`)}
        >
          <RiScan2Fill size={15} color="#e11d48" className="mr-2" />
          <span className="text-sm ">Scan : {order.scan.id}</span>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-transparent hover:bg-indigo-500 font-semibold text-indigo-500 hover:text-white py-1 px-4 border border-indigo-500 hover:border-transparent mb-4 transition duration-300 ease-in-out rounded-lg hover:rounded-full"
            onClick={() => {
              navigate(`/scan/${order.scan.id}`);
            }}
          >
            •••
          </button>
        </div>
      </div>
    </div>
  );
};
