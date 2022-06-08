import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import SquareLoader from "react-spinners/SquareLoader";
import UserContext from "../../contexts/UserContext";
import LangContext from "../../contexts/LangContext";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/AlertMessage";
import { AlertContext } from "../../contexts/AlertContext";
import { RiFilePaperLine } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { getAllRequests, changeStatus } from "../../services/auth";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import LANG from "../../../../i18n/lang.json";

export const RequestsListPage = () => {
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useContext(AlertContext);
  const [requests, setRequests] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const data = await getAllRequests();
      if (data.message)
        setAlertData({
          type: "error",
          message: data.message,
        });
      else setRequests(data.requests);
      console.log(data.requests);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const changeRequestStatus = async (id, status) => {
    setLoading(true);
    const data = await changeStatus(id, status);
    if (data?.message)
      setAlertData({
        type: data.request ? "success" : "error",
        message: data.message,
      });
    if (data?.request)
      setRequests(
        requests.map((request) => (request.id == id ? data.request : request))
      );
    setLoading(false);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);
  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          {alertData && <AlertMessage />}
          <h1 className="text-2xl text-secondary font-bold flex items-center">
            <RiFilePaperLine size={40} color="#f88c6c" className="mr-2" />
            {LANG["requests"]["Lastest authentification requests"][lang]}
          </h1>
          <table className="table-auto w-full mt-4 overflow-x-auto">
            <thead>
              <tr className="bg-primary text-white  font-medium text-center">
                <th className=" py-2">ID</th>
                <th className=" py-2">{LANG["requests"]["user"][lang]}</th>
                <th className=" py-2">Date</th>
                <th className=" py-2">status</th>
                <th className=" py-2 bg-lightPrimary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests &&
                requests.map((request) => (
                  <tr key={request.id}>
                    <td className="border p-2">{request.id}</td>
                    <td className="border p-2">{request.username}</td>
                    <td className="border p-2">
                      {moment(request.createdAt).format("DD/MM/YYYY : HH:mm")}
                    </td>
                    <td className="border p-2 ">
                      <RequestStatus status={request.status} />
                    </td>

                    <td className="border p-2 flex items-center justify-between">
                      {request.status == "PENDING" && (
                        <>
                          <AcceptButton
                            handleAccept={() =>
                              changeRequestStatus(request.id, "ACCEPTED")
                            }
                            lang={lang}
                          />

                          <RefuseButton
                            handleRefuse={() =>
                              changeRequestStatus(request.id, "REFUSED")
                            }
                            lang={lang}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
};

const RequestStatus = ({ status = "PENDING", lang = "EN" }) => {
  let color = "slate";
  if (status == "ACCEPTED") color = "green";
  else if (status == "REFUSED") color = "red";

  return (
    <div
      className={`flex justify-center items-center bg-${color}-500 px-4 py-2`}
    >
      <span className={`test-sm text-white`}>
        {LANG["requests"][status][lang]}
      </span>
    </div>
  );
};

const AcceptButton = ({ handleAccept }) => (
  <div
    onClick={() => handleAccept()}
    className="flex bg-green-500 p-1 hover:cursor-pointer"
  >
    <BsCheck color="white" size={23} />
  </div>
);

const RefuseButton = ({ handleRefuse }) => (
  <div
    onClick={() => handleRefuse()}
    className="flex bg-red-500 p-1 hover:cursor-pointer"
  >
    <AiOutlineClose color="white" size={23} />
  </div>
);
