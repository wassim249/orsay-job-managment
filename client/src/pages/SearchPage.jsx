import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../contexts/UserContext";
import Layout from "../layout/Layout";
import { SearchBar } from "../partials/SearchBar";

export const SearchPage = () => {
  const [filter, setFilter] = useState({
    last7Days: false,
    last30Days: false,
    failed: false,
    succeded: false,
    scheduled: false,
  });
  const [searchType, setSearchType] = useState("scans");
  const searchRef = useRef("");
  const [sort, setSort] = useState({
    oldest: false,
    newest: false,
    aToZ: false,
    zToA: false,
  });
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-secondary mb-10">
        Search for a scan or order number
      </h1>
      <SearchBar
        searchRef={searchRef}
        filter={filter}
        setFilter={setFilter}
        searchType={searchType}
        setSearchType={setSearchType}
        sort={sort}
        setSort={setSort}
      />

      <span className="text-secondary font-bold text-xl mt-3">
        Showing result for : .....
      </span>
      <span className="block">84 result</span>

      <div>
        <h1>No result found for </h1>
      </div>
    </Layout>
  );
};
