import React, { useContext, useEffect, useState } from "react";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import Layout from "../layout/Layout";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { RiScan2Fill } from "react-icons/ri";
import { MdDocumentScanner } from "react-icons/md";
import { CgTimer } from "react-icons/cg";
import moment from "moment";
import { FailReasonChart } from "../partials/dashboard/FailReasonChart";
import { SuccededVsFailedScans } from "../partials/dashboard/SuccededVsFailedScans";
import {
  getFailReason,
  getNewUsers,
  getScanInfo,
  getSuccVsFail,
} from "../services/stats";
import { NewUsersChart } from "../partials/dashboard/NewUsersChart";
import { DatePicker } from "../partials/actions/DatePicker";

export const Dashboard = () => {
  const [data2, setData2] = useState(null);
  const [scanInfo, setScanInfo] = useState(null);
  const [data3, setData3] = useState(null);
  const [newUsers, setNewUsers] = useState(null);
  const [user] = useContext(UserContext);
  const [rangeDate, setRangeDate] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
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
  }, [rangeDate]);

  useEffect(() => {
    const fetchDataForChart3 = async () => {
      setData3(null);
      const data = await getFailReason(rangeDate);
      if (data) {
        if (data.message) alert(data.message);
        else setData3(data);
      } else alert("Something went wrong");
    };
    fetchDataForChart3();
  }, [rangeDate]);

  useEffect(() => {
    const fetchDataForChart1 = async () => {
      setNewUsers(null);
      const data = await getNewUsers(rangeDate);
      if (data) {
        if (data.message) alert(data.message);
        else setNewUsers(data);
      } else alert("Something went wrong");
    };
    fetchDataForChart1();
  }, [rangeDate]);

  useEffect(() => {
    const fetchDataForChart2 = async () => {
      setData2(null);
      const data = await getSuccVsFail(rangeDate);
      if (data) {
        if (data.message) alert(data.message);
        else setData2(data);
      } else alert("Something went wrong");
    };
    fetchDataForChart2();
  }, [rangeDate]);

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
      <div className="flex items-center mb-4 w-full">
        <DatePicker rangeDate={rangeDate} setRangeDate={setRangeDate} />
        <span
          onClick={() => setRangeDate([])}
          className="ml-4 text-sm text-gray-600 hover:cursor-pointer"
        >
          X
        </span>
      </div>

      {newUsers && user && user.role == "admin" && (
        <NewUsersChart data={newUsers} />
      )}
      {data2 && <SuccededVsFailedScans data={data2} className="my-10" />}

      {data3 && <FailReasonChart data={data3} />}
    </Layout>
  );
};
