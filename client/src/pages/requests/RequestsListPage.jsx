import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import SquareLoader from "react-spinners/SquareLoader";
import UserContext from "../../contexts/UserContext";
import LangContext from "../../contexts/LangContext";
import { useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/AlertMessage";
import { AlertContext } from "../../contexts/AlertContext";
import { RiFilePaperLine } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { getAuthRequests } from "../../../../server/controllers/authController";

export const RequestsListPage = () => {
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useContext(AlertContext);
  const [requests, setRequests] = useState(null)
alert('hhh')
  useEffect(()=> {
    const fetchRequests = async ()=> {
      setLoading(true)
      const data  = await getAuthRequests()
      setRequests(data)
      setLoading(false)
      console.log(data);
    }
    fetchRequests()
  },[])

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
          {" "}
          {alertData && <AlertMessage />}
          <h1 className="text-2xl text-secondary font-bold flex items-center">
            <RiFilePaperLine size={40} color="#f88c6c" className="mr-2" />
            Lastest authentification requests
          </h1>
          <table className="table-auto w-full mt-4 overflow-x-auto">
            <thead>
              <tr className="bg-primary text-white  font-medium text-center">
                <th className=" py-2">ID</th>
                <th className=" py-2">user</th>
                <th className=" py-2">Date</th>
                <th className=" py-2">status</th>
                <th className=" py-2 bg-lightPrimary">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">01</td>
                <td className="border p-2">wassim.elbakkouri</td>
                <td
                className="border p-2"
                >01vflkfkl</td>
                <td className="border p-2">
                  <RequestStatus status="ACCEPTED" />
                </td>
                <td className="border p-2">
            
                  <button className="bg-transparent pr-3" onClick={() => {}}>
                    <BsCheck color="#22c55e" size={30} />
                  </button>

                  <button
                    className="bg-transparent text-red-500 font-bold text-2xl"
                    onClick={() => {}}
                  >
                    X
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
};

const RequestStatus = (status = "PENDING") => {
  let color = "slate";
  if (status == "ACCEPTED") color = "green";
  else if (status == "REFUSED") color = "red";

  return (
    <div
      className={`flex justify-center items-center text-${color}-500 px-4 py-2`}
    >
      <span className={`test-sm text-white`}>PENDING</span>
    </div>
  );
};
