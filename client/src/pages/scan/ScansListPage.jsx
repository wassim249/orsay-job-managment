import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { RiScan2Fill } from "react-icons/ri";
import { getScans } from "../../services/scan";
import SquareLoader from "react-spinners/SquareLoader";
import moment from "moment";
import { scanSuccess } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../contexts/AlertContext";
import LangContext from "../../contexts/LangContext";
import LANG from "../../../../i18n/lang.json";
import { Status } from "../../components/Status";
import { AlertMessage } from "../../components/AlertMessage";

export const ScansListPage = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [scans, setScans] = useState([]);
  const [alertData, setAlertData] = useContext(AlertContext);
  const [lang] = useContext(LangContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      const data = await getScans();
      if (data) setScans(data.scans);
      else
        setAlertData({
          message: data?.message,
          type: "error",
        });
      setLoading(false);
    };
    fetchScans();
  }, []);

  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          {alertData && <AlertMessage />}
          <SquareLoader color="#6366f1" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-bold flex items-center">
              <RiScan2Fill size={40} color="#6366f1" className="mr-2" />
              {LANG["scansList"]["Scans list"][lang]}
            </h1>
            {user?.role != "viewer" && (
              <button
                className="border-2 border-rose-400 text-rose-400 hover:text-white hover:bg-rose-400 py-2 px-3 font-bold  rounded-lg"
                onClick={() => navigate("/scan/create")}
              >
                + {LANG["scansList"]["Create scan"][lang]}
              </button>
            )}
          </div>

          <table className="table-auto w-full mt-4 overflow-x-auto rounded-lg">
            <thead
            className="bg-indigo-500 text-white  font-medium text-center"
            >
              <tr >
                <th className=" py-2  rounded-tl-lg">Date</th>
                <th className=" py-2">Source</th>
                <th className=" py-2">Destination</th>
                <th className=" py-2">
                  {LANG["scansList"]["Scanned orders"][lang]}
                </th>
                <th className=" py-2">Status</th>
                <th className=" py-2 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans &&
                scans.map((scan, key) => (
                  <tr key={key} className="text-sm text-center">
                    <td className="border p-2">
                      {scan &&
                        moment(scan.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td className="border p-2">{scan && scan.sourceFile}</td>
                    <td className="border p-2">
                      {scan && scan.destinationFile}
                    </td>
                    <td className="border p-2 font-bold">
                      {scan && scan.orders.length}
                    </td>
                    <td className="border p-2 font-bold">
                      {scan && <Status success={scanSuccess(scan)} icon />}
                    </td>
                    <td className={`border p-2`}>
                      <button
                        className="bg-transparent hover:bg-indigo-500 text-indigo-500 font-semibold hover:text-white py-2 px-4 border border-indigo-500 rounded-lg hover:border-transparent"
                        onClick={() => {
                          navigate(`/scan/${scan.id}`);
                        }}
                      >
                        {LANG["common"]["view"][lang]}
                      </button>
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
