import React, { useContext, useEffect, useState } from "react";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import Layout from "../layout/Layout";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { RiScan2Fill } from "react-icons/ri";
import { MdDocumentScanner } from "react-icons/md";
import { CgTimer } from "react-icons/cg";
import moment from "moment";
import DashboardCard04 from "../partials/dashboard/DashboardCard04";
import { FailReasonChart } from "../partials/dashboard/FailReasonChart";
import SuccededVsFailedScans from "../partials/dashboard/SuccededVsFailedScans";
import { getFailReason, getScanInfo, getSuccVsFail } from "../services/stats";

const Dashboard = () => {
  const [data2, setData2] = useState({
    dates: [],
  });
  const [loading2, setLoading2] = useState(false);
  const [scanInfo, setScanInfo] = useState(null);

  const [loading3, setLoading3] = useState(false);
  const [data3, setData3] = useState(null);

  const [user] = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  useEffect(() => {
    const fetchDataForChart2 = async () => {
      setLoading2(true);
      const data = await getSuccVsFail();
      if (data) {
        if (data.message) alert(data.message);
        else setData2(data);
      } else alert("Something went wrong");
      setLoading2(false);
    };
    fetchDataForChart2();
  }, []);

  useEffect(() => {
    const fetchScanInfo = async () => {
      const data = await getScanInfo();
      if (data) {
        if (data.message) alert(data.message);
        else setScanInfo(data);
      } else alert("Something went wrong");
    };
    fetchScanInfo();
  }, []);

  useEffect(() => {
    const fetchDataForChart3 = async () => {
      setLoading3(true);
      const data = await getFailReason();
      console.log(data);
      if (data) {
        if (data.message) alert(data.message);
        else setData3(data);
      } else alert("Something went wrong");
      setLoading3(false);
    };
    fetchDataForChart3();
  }, []);

  return (
    <Layout>
      <WelcomeBanner />
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 mb-4">
        <div className="bg-white shadow py-8 pl-5 flex items-center">
          <div className="bg-primary p-4">
            <RiScan2Fill color="white" size={30} />
          </div>
          <div className="ml-3">
            <p className="text-sm">Total scans</p>
            <span className="text-black font-bold text-3xl">
              {scanInfo && scanInfo.total}
            </span>
          </div>
        </div>

        <div className="bg-white shadow py-8 pl-5 flex items-center ">
          <div className="bg-primary p-4">
            <CgTimer color="white" size={30} />
          </div>
          <div className="ml-3">
            <p className="text-sm">Total scan in the past 7 days</p>
            <span className="text-black font-bold text-3xl">
              {scanInfo && scanInfo.total7Days}
            </span>
          </div>
        </div>

        <div className="bg-white shadow py-8 pl-5 flex items-center">
          <div className="bg-primary p-4">
            <MdDocumentScanner color="white" size={30} />
          </div>
          <div className="ml-3">
            <p className="text-sm">Latest scan</p>
            <span className="text-black font-bold text-xl">
              {scanInfo &&
                moment(scanInfo?.latestScan).format("MM/DD/YYYY hh:mm")}
            </span>
          </div>
        </div>
      </div>

      <DashboardCard04 />
      {!loading2 && <SuccededVsFailedScans data={data2} className="my-10" />}

      {data3 && <FailReasonChart data={data3} />}
    </Layout>
  );
};

export default Dashboard;
