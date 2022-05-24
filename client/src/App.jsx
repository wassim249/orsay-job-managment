import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";
import LoginPage from "./pages/LoginPage";
import UserContext from "./contexts/UserContext";
import { CreateScanPage } from "./pages/scan/CreateScanPage";
import { ScanDetailsPage } from "./pages/scan/ScanDetailsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UserDetailsPage } from "./pages/users/UserDetailsPage";
import { UsersListPage } from "./pages/users/UsersListPage";
import { ScansListPage } from "./pages/scan/ScansListPage";
import { EditUserPage } from "./pages/users/EditUserPage";
import { CreateUserPage } from "./pages/users/CreateUserPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ScheduleScanPage } from "./pages/scan/ScheduleScanPage";
import { SearchPage } from "./pages/SearchPage";
import LangContext from "./contexts/LangContext";
import { OrdersListPage } from "./pages/orders/ordersList";
import { Dashboard } from "./pages/Dashboard";

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("ORSAY_USER"))
  );
  const [lang, setLang] = useState(localStorage.getItem("ORSAY_LANG") || "FR");

  useEffect(() => {
    localStorage.setItem("ORSAY_LANG", lang);
  }, [lang]);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <LangContext.Provider value={[lang, setLang]}>
      <UserContext.Provider value={[user, setUser]}>
        <Routes>
          <Route exact path="/home" element={<Dashboard />} />
          <Route index element={<LoginPage />} />
          <Route path="/scan/create" element={<CreateScanPage />} />
          <Route path="/scan/:id" element={<ScanDetailsPage />} />
          <Route path="/scan/" element={<ScansListPage />} />
          <Route path="/scan/schedule" element={<ScheduleScanPage />} />
          <Route path="/user/" element={<UsersListPage />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
          <Route path="/user/edit/:id" element={<EditUserPage />} />
          <Route path="/user/create/" element={<CreateUserPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </UserContext.Provider>
    </LangContext.Provider>
  );
};

export default App;
