import React, { useContext, useEffect, useState } from "react";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import Layout from "../layout/Layout";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { RiScan2Fill } from "react-icons/ri";
import { MdDocumentScanner } from "react-icons/md";
import { CgTimer } from "react-icons/cg";
import moment from "moment";
import { FailReasonChart } from "../components/dashboard/FailReasonChart";
import { SuccededVsFailedScans } from "../components/dashboard/SuccededVsFailedScans";
import {
  getFailReason,
  getNewUsers,
  getScanInfo,
  getSuccVsFail,
} from "../services/stats";
import { NewUsersChart } from "../components/dashboard/NewUsersChart";
import { DatePicker } from "../components/actions/DatePicker";
import { AlertContext } from "../contexts/AlertContext";
import { AlertMessage } from "../components/AlertMessage";
import LangContext from "../contexts/LangContext";
import LANG from "../../../i18n/lang.json";

export const Dashboard = () => {
  const [data2, setData2] = useState(null);
  const [scanInfo, setScanInfo] = useState(null);
  const [data3, setData3] = useState(null);
  const [newUsers, setNewUsers] = useState(null);
  const [user] = useContext(UserContext);
  const [rangeDate, setRangeDate] = useState(null);
  const [alertData, setAlertData] = useContext(AlertContext);
  const [lang] = useContext(LangContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  useEffect(() => {
    const fetchScanInfo = async () => {
      const data = await getScanInfo();
      if (data) {
        if (data.message)
          setAlertData({
            message: data.message,
            type: "error",
          });
        else setScanInfo(data);
      } else
        setAlertData({
          message: LANG["alerts"]["Something went wrong"],
          type: "error",
        });
    };
    fetchScanInfo();
  }, [rangeDate]);

  useEffect(() => {
    const fetchDataForChart3 = async () => {
      setData3(null);
      const data = await getFailReason(rangeDate);
      if (data) {
        if (data.message)
          setAlertData({
            message: data.message,
            type: "error",
          });
        else setData3(data);
      } else
        setAlertData({
          message: LANG["alerts"]["Something went wrong"],
          type: "error",
        });
    };
    fetchDataForChart3();
  }, [rangeDate]);

  useEffect(() => {
    const fetchDataForChart1 = async () => {
      setNewUsers(null);
      const data = await getNewUsers(rangeDate);
      if (data) {
        if (data.message)
          setAlertData({
            message: data.message,
            type: "error",
          });
        else setNewUsers(data);
      } else
        setAlertData({
          message: LANG["alerts"]["Something went wrong"],
          type: "error",
        });
    };
    fetchDataForChart1();
  }, [rangeDate]);

  useEffect(() => {
    const fetchDataForChart2 = async () => {
      setData2(null);
      const data = await getSuccVsFail(rangeDate);
      if (data) {
        if (data.message)
          setAlertData({
            message: data.message,
            type: "error",
          });
        else setData2(data);
      } else
        setAlertData({
          message: LANG["alerts"]["Something went wrong"],
          type: "error",
        });
    };
    fetchDataForChart2();
  }, [rangeDate]);

  return (
    <Layout>
      {alertData && <AlertMessage />}
      <WelcomeBanner />
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 mb-4">
        <div className="bg-white py-4 px-8 mr-10 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-slate-900 font-bold text-3xl">
                {scanInfo && scanInfo?.total?.toString().length == 1
                  ? `0${scanInfo.total}`
                  : scanInfo?.total}
              </span>
              <p className="text-md text-slate-700">
                {LANG["home"]["Total scans"][lang]}
              </p>
            </div>
            <RiScan2Fill color="#f43f5e" size={80} />
          </div>
        </div>

        <div className="bg-white py-4 px-8 mr-10 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-slate-900 font-bold text-3xl">
                {scanInfo && scanInfo?.total7Days?.toString().length == 1
                  ? `0${scanInfo?.total7Days}`
                  : scanInfo?.total7Days}
              </span>
              <p className="text-md text-slate-700">
                {LANG["home"]["Total scan in the past 7 days"][lang]}
              </p>
            </div>
            <CgTimer color="#f43f5e" size={80} />
          </div>
        </div>

        <div className="bg-white shadow-lg py-4 px-8 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-slate-900 font-bold text-2xl">
                {scanInfo &&
                  (scanInfo.latestScan
                    ? moment(scanInfo?.latestScan).format("MM/DD/YYYY hh:mm")
                    : "No scan")}
              </span>
              <p className="text-md text-slate-700">
                {LANG["home"]["Latest scan"][lang]}
              </p>
            </div>
            <MdDocumentScanner color="#f43f5e" size={80} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end mb-4 w-full">
        <DatePicker rangeDate={rangeDate} setRangeDate={setRangeDate} />
        <span
          onClick={() => setRangeDate(null)}
          className="ml-4 text-sm text-gray-600 hover:cursor-pointer font-bold"
        >
          X
        </span>
      </div>
      {data2 && <SuccededVsFailedScans data={data2} />}
      {data3 && <FailReasonChart data={data3} className="my-10" />}
      {newUsers && user && user.role == "admin" && (
        <NewUsersChart data={newUsers} />
      )}
    </Layout>
  );
};
