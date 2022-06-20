import React, { useContext } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { AiFillCheckCircle } from "react-icons/ai";
import { VscError } from "react-icons/vsc";
import { AlertContext } from "../contexts/AlertContext";

export const AlertMessage = () => {
  const [{ type, message }, setAlertData] = useContext(AlertContext);
  let color = "info";
  if (type === "error") color = "red";
  else if (type === "success") color = "green";

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
      className={`absolute z-60 bottom-4 right-4 selection: bg-${color}-300 p-2 flex justify-center items-center ease-in-out duration-300 transition-opacity shadow-lg rounded-lg`}
    >
      {icon}
      <p className="text-white text-sm mx-2">{message}</p>
      <button className="text-white " onClick={() => setAlertData(null)}>
        X
      </button>
    </div>
  );
};
