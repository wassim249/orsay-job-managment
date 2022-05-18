import React from "react";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import UserContext from "../contexts/UserContext";
import { loginService } from "../services/auth";

const LoginPage = () => {
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const response = await loginService(email, password);
    if (response.user) setUser(response.user);
    else alert(response.message);

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      if (rememberMe) localStorage.setItem("ORSAY_USER", JSON.stringify(user));
      navigate("/home");
    }
  }, [loading]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-50">
      <h1 className="text-secondary text-2xl font-bold mb-6 font-montserat">
        Login to your account
      </h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
        <div className="mb-4">
          <label className="block text-grey-darker text-sm  mb-2 font-montserat">
            Email adress :
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
            Password :
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
          <label className="font-montserat ml-2 text-sm">Remember me</label>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="bg-primary w-full py-3 text-white  font-bold hover:bg-darkPrimary transition duration-300"
        >
          {loading ? <ClipLoader color="white" loading={loading} /> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
