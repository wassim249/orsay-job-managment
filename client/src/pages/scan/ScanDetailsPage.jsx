import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { BsFillPersonFill } from "react-icons/bs";
import moment from "moment";
import UserContext from "../../contexts/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { getScan } from "../../services/scan";
import { scanSuccess } from "../../utils/Utils";
import SquareLoader from "react-spinners/SquareLoader";
import { RiScan2Fill } from "react-icons/ri";
import { Scheduled } from "../../partials/Scheduled";
import { Status } from "../../partials/Status";

export const ScanDetailsPage = () => {
  const [user] = useContext(UserContext);
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  useEffect(() => {
    const fetchScan = async () => {
      setLoading(true);
      const {
        scan: fetchedscan,
        orders: fetchedOrders,
        logFile,
      } = await getScan(id);

      if (fetchedscan) {
        setScan(fetchedscan);
        setOrders(fetchedOrders);
      } else navigate("/notfound");

      setLoading(false);
    };
    fetchScan();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <div className="flex mb-4 ">
            <Status success={scanSuccess(scan && scan)} className="mr-3 " />
            <Scheduled scheduled={scan && scan.scheduled} />
          </div>

          <span className="mt-10 text-sm text-slate-500">
            {moment(scan && scan.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </span>
          <div className=" flex justify-between items-center   ">
            <div className="flex items-center">
              <RiScan2Fill size={40} color="#f88c6c" className="mr-2" />
              <span className="  font-bold text-2xl text-secondary">
                Scan #{id}
              </span>
            </div>

            <div className="flex items-center">
              <BsFillPersonFill size={30} color={"#f88c6c"} />
              <span
                onClick={() => {
                  navigate(`/user/${scan && scan.user.id}`);
                }}
                className="ml-2 text-sm   hover:cursor-pointer hover:underline"
              >
                By : {scan && scan.user.firstName} {scan && scan.user.lastName}
              </span>
            </div>
          </div>

          <div className="grid gap-10 grid-cols-2 mt-6">
            <div>
              <label className="block text-secondary text-sm d mb-2  ">
                Source folder :
              </label>
              <span className="text-primary   font-bold">
                {scan && scan.sourceFile}
              </span>
            </div>

            <div>
              <label className="block text-secondary text-sm d mb-2  ">
                Destination folder :
              </label>
              <span className="text-primary   font-bold">
                {scan && scan.destinationFile}
              </span>
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2  ">
                Log file :
              </label>
              <span className="text-primary   font-bold">
                {scan && scan.logFile}
              </span>
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2  ">
                Orders List :
              </label>
              <div className="bg-slate-900 text-white p-2 text-sm   border-2 border-primary">
                {orders &&
                  orders.map((order, key) => (
                    <span className=" block" key={key}>
                      {order.status === "error" ? "❌" : "✅"}
                      <span
                        className={`font-bold  text-${
                          order.status === "error" ? "red" : "green"
                        }-500`}
                      >
                        &nbsp; {order.order}
                      </span>{" "}
                      from &nbsp;
                      <span
                        className={`font-italic ${
                          order.fileName && "underline"
                        }`}
                      >
                        {order.fileName ? order.fileName : "No file"}
                      </span>
                    </span>
                  ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2  ">
                Log :
              </label>
              <div className="bg-slate-900 text-white p-2 text-sm   border-2 border-primary">
                {scan &&
                  JSON.parse(scan.log).map((log, key) => (
                    <span
                      key={key}
                      className={`block font-bold text-sm ${
                        log.type === "info" ? "text-blue-500" : "text-red-500"
                      }`}
                    >
                      {log.message}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};




