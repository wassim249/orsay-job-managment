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
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl text-secondary font-bold flex items-center">
              <RiScan2Fill size={40} color="#f88c6c" className="mr-2" />
              {LANG["scansList"]["Scans list"][lang]}
            </h1>
            {user?.role != "viewer" && (
              <button
                className="bg-secondary text-white py-2 px-3  "
                onClick={() => navigate("/scan/create")}
              >
                + {LANG["scansList"]["Create scan"][lang]}
              </button>
            )}
          </div>

          <table className="table-auto mt-4 overflow-x-auto">
            <thead>
              <tr className="bg-primary text-white  font-medium text-center">
                <th className=" py-2">Date</th>
                <th className=" py-2">Source</th>
                <th className=" py-2">Destination</th>
                <th className=" py-2">
                  {LANG["scansList"]["Scanned orders"][lang]}
                </th>
                <th className=" py-2">Status</th>
                <th className=" py-2 bg-lightPrimary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans &&
                scans.map((scan, key) => (
                  <tr key={key} className="text-sm text-center">
                    <td className="border p-2">
                      {scan &&
                        moment(scan.createdAt).format("DD/MM/YYYY HH:MM:SS")}
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
                    <td className="border p-2">
                      <button
                        className="bg-transparent hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent"
                        onClick={() => {
                          navigate(`/scan/${scan.id}`);
                        }}
                      >
                        {LANG['common']['view'][lang]}
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
