import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import Layout from "../layout/Layout";
import { SearchBar } from "../partials/SearchBar";
import { getSearchedScans } from "../services/search";
import SquareLoader from "react-spinners/SquareLoader";
import moment from "moment";
import { scanSuccess } from "../utils/Utils";
import { useNavigate } from "react-router-dom";

export const SearchPage = () => {
  const [filter, setFilter] = useState({
    last7Days: false,
    last30Days: false,
    failed: false,
    success: false,
    scheduled: false,
  });
  const [searchType, setSearchType] = useState("scans");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");
  const [scans, setScans] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [search, setSearch] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  useEffect(() => {
    if (scans.length) {
      console.log(scans.length);
      switch (sort) {
        case "newold":
          setScans(scans.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
          break;
        case "oldnew":
          setScans(scans.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)));
          break;
      }
    }
  }, [sort]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchType == "scans") {
      
      setLoading(true);
      const result = await getSearchedScans(searchTerm, filter);
      if (result) {
        if (result.message) alert(result.message);
        else {
          setSearch(true);
          setScans(result);
          console.log(result);
        }
      } else alert("Something went wrong");
      console.log(result);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-secondary mb-10">
        Search for a scan or order number
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
                Showing result for : {searchTerm}
              </span>
              <span className="block">{scans && `${scans.length} result`}</span>
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
              ) : (
                <span>No results found</span>
              )}
            </>
          )}
        </>
      )}
    </Layout>
  );
};
