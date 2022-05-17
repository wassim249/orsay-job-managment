import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";
import Dashboard from "./pages/Dashboard";
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

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("ORSAY_USER"))
  );

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    if (user)
      localStorage.setItem(
        "ORSAY_USER",
        JSON.stringify({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          lastConnection: new Date(user.lastConnection),
        })
      );
    else localStorage.removeItem("ORSAY_USER");
  }, [user]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Routes>
        <Route exact path="/home" element={<Dashboard />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/scan/create" element={<CreateScanPage />} />
        <Route path="/scan/:id" element={<ScanDetailsPage />} />
        <Route path="/scan/" element={<ScansListPage />} />
        <Route path="/user/" element={<UsersListPage />} />
        <Route path="/user/:id" element={<UserDetailsPage />} />
        <Route path="/user/edit/:id" element={<EditUserPage />} />
        <Route path="/user/create/" element={<CreateUserPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
