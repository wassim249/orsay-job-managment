import React, { useContext, useEffect } from "react";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import Layout from "../layout/Layout";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  return (
    <Layout>
      <WelcomeBanner />
    </Layout>
  );
};

export default Dashboard;
