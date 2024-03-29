import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { RiScan2Fill } from "react-icons/ri";
import { createScan } from "../../services/scan";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";
import BeatLoader from "react-spinners/BeatLoader";
import { AlertContext } from "../../contexts/AlertContext";
import { AlertMessage } from "../../components/AlertMessage";
import { ImportFromFileModal } from "../../components/scan/ImportFromFileModal";

export const CreateScanPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [orderNumbers, setOrderNumbers] = useState([]);
  const [logFile, setLogFile] = useState("");
  const orderNumber = useRef(null);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useContext(AlertContext);

  useEffect(() => {
    setSource(state?.source || "");
    setDestination(state?.destination || "");
    setOrderNumbers(state?.orderNumbers || []);
    setLogFile(state?.logFile || "");
  }, []);

  useEffect(() => {
    if (!user) navigate("/");
    else if (user?.role === "viewer") navigate("/home");
  }, []);

  const handleScan = async () => {
    setLoading(true);
    if (source.trim() === "")
      setAlertData({
        message: LANG["alerts"]["Please enter a source"][lang],
        type: "error",
      });
    else if (destination.trim() === "")
      setAlertData({
        message: LANG["alerts"]["Please enter a destination"][lang],
        type: "error",
      });
    else if (orderNumbers.length === 0)
      setAlertData({
        message: LANG["alerts"]["Please enter at least one order number"][lang],
        type: "error",
      });
    else {
      const { output, scanId } = await createScan(
        source,
        destination,
        orderNumbers,
        logFile,
        user.id
      );
      if (output) {
        if (output.finishedOrders.length > 0) navigate(`/scan/${scanId}`);
        else
          setAlertData({
            message: output.log[output.log.length - 1].message.toLowerCase(),
            type: "error",
          });
      }
    }
    setLoading(false);
  };

  const addOrder = (e) => {
    e.preventDefault();
    if (orderNumber.current.value) {
      setOrderNumbers([...orderNumbers, orderNumber.current.value.trim()]);
      orderNumber.current.value = "";
    } else {
      setAlertData({
        message: LANG["alerts"]["Please enter an order number"][lang],
        type: "error",
      });
    }
  };

  return (
    <Layout>
      {showModal && (
        <ImportFromFileModal
          orderNumbers={orderNumbers}
          setOrderNumbers={setOrderNumbers}
          setShowModal={setShowModal}
        />
      )}
      {alertData && <AlertMessage />}
      <h1 className="text-2xl font-bold flex items-center">
        <RiScan2Fill size={40} color="#6366f1" className="mr-2" />
        {LANG["createScan"]["create a new scan"][lang]}
      </h1>

      <form className="mt-4 grid grid-cols-2 gap-4  ">
        {/* Input de dossier source */}
        <div className="col-span-2">
          <label className="block text-sm d mb-2">
            {LANG["createScan"]["source folder"][lang]}:{" "}
            <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none  border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
            type="text"
            placeholder={LANG["createScan"]["c:/folder/..."][lang]}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            directory="true"
            webkitdirectory="true"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm mb-2">
            {LANG["createScan"]["destination folder"][lang]} :{" "}
            <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none  border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
            type="text"
            placeholder={LANG["createScan"]["c:/folder/..."][lang]}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm d mb-2">
            {LANG["createScan"]["Order number"][lang]}:{" "}
            <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
            type="text"
            placeholder="20219787987..."
            ref={orderNumber}
          />
        </div>

        <div className="flex flex-row items-end col-span-1">
          <button
            type="button"
            onClick={(e) => {
              addOrder(e);
            }}
            className="bg-rose-500 text-white px-3 py-[6px] mr-3 font-bold rounded-lg "
          >
            <span className="text-white text-lg">+</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowModal(true);
            }}
            className="bg-slate-400 text-white px-3 py-2 font-semibold rounded-lg "
          >
            {LANG["createScan"]["From a file"][lang]}
          </button>
        </div>
        <div className="col-span-2">
          <label className="block text-sm mb-2  ">
            {LANG["createScan"]["Log file location"][lang]} :
          </label>
          <input
            className="appearance-none border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
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
          className="col-span-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out rounded-lg  "
          type="submit"
        >
          {loading ? (
            <BeatLoader color="#fff" loading={loading} size="20px" />
          ) : (
            LANG["createScan"]["create"][lang]
          )}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (source.trim() === "")
              setAlertData({
                message: LANG["createScan"]["please enter source folder"][lang],
                type: "error",
              });
            else if (destination.trim() === "")
              setAlertData({
                message:
                  LANG["createScan"]["please enter destination folder"][lang],
                type: "error",
              });
            else if (orderNumbers.length === 0)
              setAlertData({
                message:
                  LANG["createScan"]["please enter at least one order number"][
                    lang
                  ],
                type: "error",
              });
            else
              navigate("/scan/schedule", {
                state: { source, destination, orderNumbers, logFile },
              });
          }}
          className="col-span-2 border-2 border-rose-500 bg-transparent hover:bg-rose-500 hover:text-white text-rose-500 font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out rounded-lg"
          type="submit"
        >
          {LANG["createScan"]["schedule"][lang]}
        </button>
        <table className="col-span-2  ">
          <thead className="rounded-lg p-2">
            <tr>
              <td className="bg-slate-100 p-2 rounded-tl text-gray-700 text-sm font-bold">
                &nbsp;
              </td>
              <td className="bg-slate-200 p-2 w-3/4 text-center font-semibold text-slate-500  ">
                {LANG["createScan"]["Order number"][lang]}
              </td>
              <td className="bg-slate-100 p-2 rounded-tr text-gray-700 text-sm font-bold">
                &nbsp;
              </td>
            </tr>
          </thead>
          <tbody id="orders">
            {orderNumbers.length == 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center w-full bg-gray-200 py-2 text-sm font-bold text-gray-500"
                >
                  {LANG["createScan"]["Order numbers list is empty"][lang]}
                </td>
              </tr>
            ) : (
              orderNumbers.map((orderNumber, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center  text-sm">
                    {index + 1}
                  </td>
                  <td className="border p-2 text-center text-sm  ">
                    {orderNumber}
                  </td>
                  <td className=" border p-2 text-center  text-sm ">
                    <button
                      type="button"
                      onClick={() => {
                        setOrderNumbers(
                          orderNumbers.filter((_, i) => i !== index)
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
