import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { AlertMessage } from "../../components/AlertMessage";
import { AlertContext } from "../../contexts/AlertContext";
import LangContext from "../../contexts/LangContext";
import UserContext from "../../contexts/UserContext";
import { loginService } from "../../services/auth";
import LANG from "../../../../i18n/lang.json";

export const LoginPage = () => {
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useContext(AlertContext);
  const navigate = useNavigate();
  const [lang, setLang] = useContext(LangContext);

  const handleLogin = async () => {
    setLoading(true);
    const response = await loginService(email, password);
    if (response.user) setUser(response.user);
    else {
      setUser(null);
      setAlertData({
        message: response.message,
        type: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      if (user.disabled == false) {
        if (rememberMe)
          localStorage.setItem(
            "ORSAY_USER",
            JSON.stringify({
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              lastConnection: user.lastConnection,
              updatedAt: user.updatedAt,
              createdAt: user.createdAt,
            })
          );
        navigate("/home");
      } else if (user.disabled == true) {
        setAlertData({
          message: "Your account has been disabled",
          type: "error",
        });
      }
    }
  }, [loading]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-50 font-montserat">
      {alertData && <AlertMessage />}
      <h1 className="text-secondary text-2xl font-bold mb-6  ">
        {LANG["login"]["Login to your account"][lang]}
      </h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
        <div className="mb-4">
          <label className="block text-grey-darker text-sm  mb-2  ">
            {LANG["login"]["Email adress"][lang]} :
          </label>
          <input
            className=" appearance-none border active:border-primary  w-full py-2 px-3 text-grey-darker"
            type="email"
            placeholder="joe@cgi.com"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mb-6">
          <label className="block text-grey-darker text-sm mb-2">
            {LANG["login"]["Password"][lang]} :
          </label>
          <input
            className=" appearance-none border border-red  w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            required
            placeholder="******************"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <div className="flex justify-start items-center mb-3">
          <input
            onChange={(e) => {
              setRememberMe(e.target.checked);
            }}
            type="checkbox"
            color="#f88c6c"
          />
          <label className="  ml-2 text-sm">
            {LANG["login"]["Remember me"][lang]}
          </label>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="bg-primary w-full py-3 text-white  font-bold hover:bg-darkPrimary transition duration-300"
        >
          {loading ? (
            <ClipLoader color="white" loading={loading} />
          ) : (
            LANG["login"]["Login"][lang]
          )}
        </button>
        <div className="mt-3 text-center">
          <span
            onClick={() => navigate("/register")}
            className="text-sm hover:cursor-pointer hover:underline"
          >
            {LANG["login"]["Get a new account"][lang]}
          </span>
        </div>
      </form>
      <div className="flex justify-center items-center">
        <span
          className="text-sm hover:cursor-pointer hover:underline hover:text-primary px-3"
          onClick={() => setLang("EN")}
        >
          English (EN)
        </span>
        <span
          onClick={() => setLang("FR")}
          className="text-sm hover:cursor-pointer hover:underline hover:text-primary px-3"
        >
          Français (FR)
        </span>
        <span
          onClick={() => setLang("DE")}
          className="text-sm hover:cursor-pointer hover:underline hover:text-primary px-3"
        >
          Deutsch (DE)
        </span>
      </div>
    </div>
  );
};
