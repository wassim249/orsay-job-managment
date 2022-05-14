import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import UserContext from "./contexts/UserContext";
import { CreateScanPage } from "./pages/scan/CreateScanPage";
import { ScanDetailsPage } from "./pages/scan/ScanDetailsPage";

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    if (user)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          lastConnection : new Date(user.lastConnection)
        })
      );
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Routes>
        <Route exact path="/home" element={<Dashboard />} />
        <Route  path="/" element={<LoginPage />} />
        <Route  path="/scan/create" element={<CreateScanPage />} />
        <Route exact path="/scan/:id" element={<ScanDetailsPage />} />
      </Routes>{" "}
    </UserContext.Provider>
  );
};

export default App;
