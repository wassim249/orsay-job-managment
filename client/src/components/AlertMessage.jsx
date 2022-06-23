import React, { useContext } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { AiFillCheckCircle } from "react-icons/ai";
import { VscError } from "react-icons/vsc";
import { AlertContext } from "../contexts/AlertContext";

export const AlertMessage = () => {
  const [{ type, message }, setAlertData] = useContext(AlertContext);
  let color = "info";
  if (type === "error") color = "rose";
  else if (type === "success") color = "amber";

  setTimeout(() => {
    setAlertData(null);
  }, 10000);
  let icon = null;
  switch (type) {
    case "error":
      icon = <VscError color="white" />;
      break;
    case "success":
      icon = <AiFillCheckCircle color="white" />;
      break;
    default:
      icon = <HiOutlineInformationCircle color="white" />;
  }

  return (
    <div
      className={`absolute z-90 bottom-4 right-4 selection: bg-${color}-400 p-2 flex justify-center items-center hover:scale-110 shadow-lg rounded-lg  transition-all duration-300 ease-in-out`}
    >
      {icon}
      <p className="text-white text-sm mx-2">{message}</p>
      <button className="text-white " onClick={() => setAlertData(null)}>
        X
      </button>
    </div>
  );
};
