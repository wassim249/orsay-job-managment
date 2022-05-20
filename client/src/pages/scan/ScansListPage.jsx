import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { RiScan2Fill } from "react-icons/ri";
import { getScans } from "../../services/scan";
import SquareLoader from "react-spinners/SquareLoader";
import moment from "moment";
import { scanSuccess } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";

export const ScansListPage = () => {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [scans, setScans] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      const data = await getScans();
      if (data) setScans(data.scans);
      else alert(data?.message);
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
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-secondary font-bold   flex items-center">
              <RiScan2Fill size={40} color="#f88c6c" className="mr-2" /> Scans
              list
            </h1>
            {user?.role == "admin" && (
              <button
                className="bg-secondary text-white py-2 px-3  "
                onClick={() => navigate("/user/create")}
              >
                + Create user
              </button>
            )}
          </div>

          <table className="table-auto mt-4 overflow-x-auto">
            <thead>
              <tr className="bg-primary text-white  font-medium text-center">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Destination</th>
                <th className="px-4 py-2">Scanned orders</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 bg-lightPrimary">Actions</th>
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
                      {scan &&
                        (scanSuccess(scan) ? (
                          <span className="bg-green-500 text-white px-2 py-3">
                            Success
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-2 py-3">
                            Failed
                          </span>
                        ))}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-transparent hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent"
                        onClick={() => {
                          navigate(`/scan/${scan.id}`);
                        }}
                      >
                        View
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
