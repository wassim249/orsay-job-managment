import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import Layout from "../layout/Layout";
import { SearchBar } from "../partials/SearchBar";
import { getSearchedOrders, getSearchedScans } from "../services/search";
import SquareLoader from "react-spinners/SquareLoader";
import moment from "moment";
import { scanSuccess } from "../utils/Utils";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderNumber } from "../partials/OrderNumber";
import { AlertContext } from "../contexts/AlertContext";
import LANG from "../../../i18n/lang.json";
import LangContext from "../contexts/LangContext";
import { Status } from "../partials/Status";

export const SearchPage = () => {
  const [lang] = useContext(LangContext);

  const [filter, setFilter] = useState({
    last7Days: false,
    last30Days: false,
    failed: false,
    success: false,
    scheduled: false,
  });
  const { state } = useLocation();

  const [searchType, setSearchType] = useState("scans");
  const [searchTerm, setSearchTerm] = useState(state?.searchValue || "");
  const [sort, setSort] = useState("newest");
  const [scans, setScans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [search, setSearch] = useState(false);
  const [alertData, setAlertData] = useContext(AlertContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  useEffect(() => {
    if (state?.searchValue) handleSearch();
  }, []);

  useEffect(() => {
    if (searchType == "scans" && scans.length) {
      switch (sort) {
        case "oldnew":
          setScans(scans.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
          break;
        case "newold":
          setScans(scans.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)));
          break;
      }
    } else if (searchType == "orders" && orders.length) {
      switch (sort) {
        case "oldnew":
          setOrders(
            orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          );
          break;
        case "newold":
          setOrders(
            orders.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          );
          break;
        case "az":
          setOrders(orders.sort((a, b) => (a.order < b.namorder ? -1 : 1)));
          break;
        case "za":
          setOrders(orders.sort((a, b) => (a.namorder > b.namorder ? -1 : 1)));
          break;
      }
    }
  }, [sort]);

  const handleSearch = async (e) => {
    e && e.preventDefault();
    if (searchType == "scans") {
      setLoading(true);
      const result = await getSearchedScans(searchTerm, filter);
      if (result) {
        if (result.message)
          setAlertData({
            message: result.message,
            type: "error",
          });
        else {
          setSearch(true);
          setScans(result);
        }
      } else
        setAlertData({
          message: "Something went wrong",
          type: "error",
        });

      setLoading(false);
    } else if (searchType == "orders") {
      setLoading(true);
      const result = await getSearchedOrders(searchTerm, filter);
      if (result) {
        if (result.message)
          setAlertData({
            message: result.message,
            type: "error",
          });
        else {
          setSearch(true);
          setOrders(result);
          console.log(result);
        }
      } else
        setAlertData({
          message: "Something went wrong",
          type: "error",
        });
      setLoading(false);
    }
  };

  return (
    <Layout>
      {alertData && <AlertMessage />}
      <h1 className="text-2xl font-bold text-secondary mb-10">
        {LANG["search"]["Search for a scan or order number"][lang]}
      </h1>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            searchType={searchType}
            setSearchType={setSearchType}
            sort={sort}
            setSort={setSort}
            handleSearch={handleSearch}
          />
          {search && (
            <>
              <span className="text-secondary font-bold text-xl mt-3">
                {LANG["search"]["Showing result for"][lang]}: {searchTerm}
              </span>
              <span className="block">{`${
                searchType == "orders" ? orders.length : scans.length
              } ${LANG["search"]["result"][lang]}(s)`}</span>
              {searchType == "scans" && (
                <>
                  {scans.length > 0 ? (
                    <table className="table-auto mt-4 overflow-x-auto">
                      <thead>
                        <tr className="bg-primary text-white  font-medium text-center">
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Source</th>
                          <th className="px-4 py-2">Destination</th>
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
                                  moment(scan.createdAt).format(
                                    "DD/MM/YYYY HH:MM:SS"
                                  )}
                              </td>
                              <td className="border p-2">
                                {scan && scan.sourceFile}
                              </td>
                              <td className="border p-2">
                                {scan && scan.destinationFile}
                              </td>

                              <td className="border p-2 font-bold">
                                {scan &&
                                 <Status success={scanSuccess(scan)} icon />
                                 }
                              </td>
                              <td className="border p-2">
                                <button
                                  className="bg-transparent hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent"
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
                  ) : (
                    <span>
                      {LANG["search"]["No results found"][lang]}
                    </span>
                  )}
                </>
              )}
              {searchType == "orders" && (
                <>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <OrderNumber order={order} key={index} />
                      ))
                    ) : (
                      <span>No results found</span>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </Layout>
  );
};
