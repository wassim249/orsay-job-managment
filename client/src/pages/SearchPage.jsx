import React, { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import Layout from "../layout/Layout";
import Datepicker from "../partials/actions/Datepicker";

export const SearchPage = () => {
  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    if (!user) navigate("/");
  }, []);
  return (
    <Layout>
      <h1>Search for a scan or order number</h1>

      <div>
        <input
          type="text"
          className="w-full"
          placeholder="Scan or order number"
        />
        <Datepicker />
        <select name="" id=""></select>
      </div>
    </Layout>
  );
};
