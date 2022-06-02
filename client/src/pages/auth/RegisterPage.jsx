import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { AlertMessage } from "../../components/AlertMessage";
import { AlertContext } from "../../contexts/AlertContext";
import UserContext from "../../contexts/UserContext";
import { requestService } from "../../services/auth";

export const RegisterPage = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [alertData, setAlertData] = useContext(AlertContext);
  const navigate = useNavigate();

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
      <h1 className="text-secondary text-2xl font-bold mb-6  ">
        Send authentification request
      </h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
        <p className="text-sm text-center">
          {request
            ? `Thank you ${request.username.split(".")[0]} ${
                request.username.split(".")[1]
              } , your request has been submited`
            : "Your information will be sent to the adminstrator , you'll get your credentials once your request is accepted"}
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleRequest();
          }}
          className="bg-primary w-full py-3 text-white  font-bold hover:bg-darkPrimary transition duration-300"
        >
          {loading ? (
            <ClipLoader color="white" loading={loading} />
          ) : request ? (
            "GO BACK TO LOGIN"
          ) : (
            "SEND"
          )}
        </button>
      </div>
    </div>
  );
};
