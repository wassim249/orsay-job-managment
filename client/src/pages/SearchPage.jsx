import React, { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import Layout from "../layout/Layout";
import { SearchBar } from "../partials/SearchBar";

export const SearchPage = () => {
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (!user) navigate("/");
  }, []);
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-secondary mb-10">
        Search for a scan or order number
      </h1>
      <SearchBar />

      <span className="text-secondary font-bold text-xl mt-3">
        Showing result for : .....
      </span>
      <span className="block">84 result</span>

      <div>
        <h1>
          No result found for{" "}
        </h1>

        
      </div>
    </Layout>
  );
};
