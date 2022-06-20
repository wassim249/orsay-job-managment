import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { AlertMessage } from "../../components/AlertMessage";
import { AlertContext } from "../../contexts/AlertContext";
import UserContext from "../../contexts/UserContext";
import { requestService } from "../../services/auth";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";

export const RegisterPage = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [alertData, setAlertData] = useContext(AlertContext);
  const navigate = useNavigate();
  const [lang, setLang] = useContext(LangContext);

  const handleRequest = async () => {
    if (request) navigate("/");
    else {
      setLoading(true);
      const response = await requestService();
      if (response?.message)
        setAlertData({
          type: "error",
          message: response.message,
        });
      else setRequest(response?.request);

      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/home");
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-50 font-montserat">
      {alertData && <AlertMessage />}
      <h1 className="text-slate-700 text-2xl font-bold mb-6  ">
        {LANG["register"]["Send authentification request"][lang]}
      </h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
        <p className="text-sm text-center mb-3">
          {request
            ? `${LANG["register"]["Thank you"][lang]} ${
                request.username.split(".")[0]
              } ${request.username.split(".")[1]} , ${
                LANG["register"]["your request has been submited"][lang]
              }`
            : "Your information will be sent to the adminstrator , you'll get your credentials once your request is accepted"}
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleRequest();
          }}
          className="bg-transparent border-3 border-indigo-700 text-indigo-700 w-full py-3 hover:text-white font-bold hover:bg-indigo-900 transition duration-300 rounded-lg"
        >
          {loading ? (
            <ClipLoader color="white" loading={loading} />
          ) : request ? (
            LANG["register"]["GO BACK TO LOGIN"][lang]
          ) : (
            LANG["register"]["SEND"][lang]
          )}
        </button>
      </div>
      <div className="flex justify-center items-center">
        <span
          className="text-sm hover:cursor-pointer hover:underline hover:text-rose-700 px-3"
          onClick={() => setLang("EN")}
        >
          English (EN)
        </span>
        <span
          onClick={() => setLang("FR")}
          className="text-sm hover:cursor-pointer hover:underline hover:text-rose-700 px-3"
        >
          Français (FR)
        </span>
        <span
          onClick={() => setLang("DE")}
          className="text-sm hover:cursor-pointer hover:underline hover:text-rose-700 px-3"
        >
          Deutsch (DE)
        </span>
      </div>
    </div>
  );
};
