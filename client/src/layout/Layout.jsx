import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto bg-gray-50 overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto overflow-auto">
            {children}

            <div className="sm:flex sm:justify-between sm:items-center mb-8"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
