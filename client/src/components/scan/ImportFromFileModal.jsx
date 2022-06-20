import { useContext, useState } from "react";
import LangContext from "../../contexts/LangContext";
import LANG from "../../../../i18n/lang.json";

export const ImportFromFileModal = ({
  setShowModal,
  orderNumbers,
  setOrderNumbers,
}) => {
  const [seperator, setSeperator] = useState("");
  const [pickedOrders, setPickedOrders] = useState([]);
  const [lang] = useContext(LangContext);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-12">
        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
          {/*content*/}
          <div className="border-0 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none  rounded-lg">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200">
              <h3 className="text-xl font-semibold">
                {LANG["createScan"]["Import order numbers from file"][lang]}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <label className="block text-sm mb-2  ">
                {LANG["createScan"]["Seperator"][lang]} :
              </label>
              <input
                className="appearance-none  border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                type="text"
                placeholder="e.g \n"
                value={seperator}
                onChange={(e) => setSeperator(e.target.value)}
              />
              <label className="block text-sm mb-2 mt-4">
                {LANG["createScan"]["File"][lang]} :
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="file"
                accept=".txt"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const text = ev.target.result;
                      console.log(text.split('\n'));
                      const lines = text.split(seperator || "\n");
                      console.log(seperator);
                      setPickedOrders(
                        lines.filter((line) => line.trim() !== "")
                      );
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-slate-400 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                {LANG["createScan"]["Close"][lang]}
              </button>
              <button
                className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-3 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 rounded-lg hover:rounded-sm hover:bg-indigo-700"
                type="button"
                onClick={() => {
                  if (pickedOrders.length > 0)
                    setOrderNumbers([...orderNumbers, ...pickedOrders]);

                  setShowModal(false);
                }}
              >
                {LANG["createScan"]["Apply"][lang]}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
