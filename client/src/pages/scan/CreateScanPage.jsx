import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { RiScan2Fill } from "react-icons/ri";
import { createScan } from "../../services/scan";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";

export const CreateScanPage = () => {
  const [user, setUser] = useContext(UserContext);
  const [lang, setLang] = useContext(LangContext);
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [orderNumbers, setOrderNumbers] = useState([]);
  const [logFile, setLogFile] = useState("");
  const orderNumber = useRef(null);

  useEffect(() => {
    if (!user) navigate("/");
    else if (user?.role === "viewer") navigate("/home");
  }, []);

  const handleScan = async () => {
    if (source.trim() === "") alert("Please enter source folder");
    else if (destination.trim() === "") alert("Please enter destination");
    else if (orderNumbers.length === 0)
      alert("Please enter at least one order number");
    else {
      const { output, scanId } = await createScan(
        source,
        destination,
        orderNumbers,
        logFile,
        user.id
      );
      if (output) {
        if (output.finishedOrders.length > 0) {
          navigate(`/scan/${scanId}`);
        } else alert(output.log[output.log.length - 1].message.toLowerCase());
      }
    }
  };

  const addOrder = () => {
    if (orderNumber.current.value) {
      setOrderNumbers([...orderNumbers, orderNumber.current.value]);
      orderNumber.current.value = "";
    } else {
      alert("Please enter an order number");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-secondary font-bold   flex items-center">
        <RiScan2Fill size={40} color="#f88c6c" className="mr-2" />
        {LANG["createScan"]["create a new scan"][lang]}
      </h1>

      <form className="mt-4 grid grid-cols-2 gap-4  ">
        {/* Input de dossier source */}
        <div className="col-span-2">
          <label className="block text-secondary text-sm d mb-2">
            {LANG["createScan"]["source folder"][lang]}:{" "}
            <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder={LANG["createScan"]["c:/folder/..."][lang]}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-secondary text-sm mb-2">
            {LANG["createScan"]["destination folder"][lang]} :{" "}
            <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder={LANG["createScan"]["c:/folder/..."][lang]}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-secondary text-sm d mb-2">
            {LANG["createScan"]["Order number"][lang]}:{" "}
            <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="20219787987..."
            ref={orderNumber}
          />
        </div>

        <div className="flex flex-row items-end col-span-1">
          <button
            type="button"
            onClick={() => {
              addOrder();
            }}
            className="bg-primary text-white  sm:w-1/2 w-full px-2 py-2 font-bold  "
          >
            <span className="text-white text-lg">+</span>
            {LANG["createScan"]["add"][lang]}
          </button>
        </div>
        <div className="col-span-2">
          <label className="block text-gray-700 text-sm mb-2  ">
            {LANG["createScan"]["Log file location"][lang]} :
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder={`${LANG["createScan"]["c:/folder/..."][lang]} (${LANG["createScan"]["default"][lang]} ${LANG["createScan"]["destination folder"][lang]})`}
            value={logFile}
            onChange={(e) => setLogFile(e.target.value)}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="col-span-2 bg-primary hover:bg-darkPrimary text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline  "
          type="submit"
        >
         {LANG["createScan"]["create"][lang]}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (source.trim() === "") alert(LANG["createScan"]["please enter source folder"][lang]);
            else if (destination.trim() === "")
              alert("Please enter destination");
            else if (orderNumbers.length === 0)
              alert(LANG["createScan"]["please enter at least one order number"][lang]);
            else
              navigate("/scan/schedule", {
                state: { source, destination, orderNumbers, logFile },
              });
          }}
          className="col-span-2 border-2 border-secondary bg-transparent hover:bg-secondary hover:text-white text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline  "
          type="submit"
        >
          {LANG["createScan"]["schedule"][lang]}
        </button>
        <table className="col-span-2  ">
          <thead className="rounded-lg p-2">
            <tr>
              <td className="bg-pink-50 p-2 rounded-tl text-gray-700 text-sm font-bold">
                &nbsp;
              </td>
              <td className="bg-lightPrimary p-2 w-3/4 text-center text-white font-bold  ">
               {LANG["createScan"]["Order number"][lang]}
              </td>
              <td className="bg-pink-50 p-2 rounded-tr text-gray-700 text-sm font-bold">
                &nbsp;
              </td>
            </tr>
          </thead>
          <tbody id="orders">
            {orderNumbers.length == 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center w-full bg-gray-200 py-2 text-sm font-bold   text-gray-500"
                >
                  {LANG["createScan"]["Order numbers list is empty"][lang]}
                </td>
              </tr>
            ) : (
              orderNumbers.map((orderNumber, index) => (
                <tr key={index}>
                  <td className="bg-pink-50 p-2 text-center text-gray-700 text-sm font-bold">
                    {index + 1}
                  </td>
                  <td className="bg-lightPrimary p-2 text-center text-gray-700 text-sm font-bold  ">
                    {orderNumber}
                  </td>
                  <td className="bg-pink-50 p-2 text-center text-gray-700 text-sm font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setOrderNumbers(
                          orderNumbers.filter(
                            (orderNumber, index) => index !== index
                          )
                        );
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </form>
      <div></div>
    </Layout>
  );
};
