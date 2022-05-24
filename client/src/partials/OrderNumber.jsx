import { RiScan2Fill } from "react-icons/ri";
import { FiClock } from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineFile } from "react-icons/ai";
import { Status } from "./Status";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export const OrderNumber = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow w-full flex flex-col justify-center items-center">
      <div className="text-xl text-secondary bg-lightPrimary w-full h-24 flex justify-center items-center font-semibold mb-4">
        {order.order}
      </div>
      <div className="flex justify-between px-4 items-center w-full">
        <div className="flex items-center w-full ">
          <FiClock size={15} color="#f88c6c" className="mr-2" />
          <span className="text-sm text-secondary">
            {moment(order.createdAt).format("DD/MM/YYYY hh:mm:ss")}
          </span>
        </div>

        <Status success={order.status == "success"} icon className="w-12 p-1" />
      </div>

      <div className="text-left w-full px-4 ">
        <div className="text-sm text-secondary flex items-center hover:cursor-pointer hover:underline">
          <BiUserCircle size={15} color="#f88c6c" className="mr-2" /> By :
          <span>
            {`${order.scan.user.firstName} ${order.scan.user.lastName}`}
          </span>
        </div>
        <div className="flex items-center">
          <AiOutlineFile size={15} color="#f88c6c" className="mr-2" />
          <span className="text-sm text-secondary">
            File : ...{order.fileName.substr(order.fileName.length - 25)}
          </span>
        </div>

        <div className="flex items-center mb-2 hover:cursor-pointer hover:underline">
          <RiScan2Fill size={15} color="#f88c6c" className="mr-2" />
          <span className="text-sm text-secondary">Scan : {order.scan.id}</span>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-transparent hover:bg-secondary text-secondary font-semibold hover:text-white py-1 px-4 border border-secondary hover:border-transparent mb-4"
            onClick={() => {
              navigate(`/scan/${order.scan.id}`);
            }}
          >
            See more
          </button>
        </div>
      </div>
    </div>
  );
};
