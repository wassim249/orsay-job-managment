import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RiHomeLine, RiScan2Line } from "react-icons/ri";
import Logo from "../images/logo.svg";
import { BiSearchAlt, BiUserCircle } from "react-icons/bi";
import UserContext from "../contexts/UserContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [user] = useContext(UserContext);
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const getPathName = () => {
    if (pathname.startsWith("/home")) return "home";
    else if (pathname.startsWith("/scan")) return "scan";
    else if (pathname.startsWith("/user")) return "user";
    else if (pathname.startsWith("/search")) return "search";
    else return "";
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white shadow-lg p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <BiArrowBack color="black" />
          </button>
          {/* Logo */}
          <NavLink end to="/home" className="block">
            <img src={Logo} alt="Logo" className="w-20 h-auto" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3"></h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <li
                className={`px-3 py-3 mb-0.5 last:mb-0 ${
                  getPathName() == 'home' && "bg-primary"
                }`}
              >
                <NavLink
                  end
                  to="/"
                  className={`block text-primary  ${
                     getPathName() == 'home' && "text-white"
                  } truncate transition duration-150`}
                >
                  <div className="flex items-center">
                    <RiHomeLine
                      size={20}
                      color={ getPathName() == 'home' ? "white" : "black"}
                    />
                    <span
                      className={`text-sm font-bold e ml-3 ${
                         getPathName() == 'home' ? "text-white" : "text-secondary"
                      } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                    >
                      Home
                    </span>
                  </div>
                </NavLink>
              </li>

              <li
                className={`px-3 py-3 mb-0.5 last:mb-0 ${
                  getPathName() == 'scan' && "bg-primary"
                }`}
              >
                <NavLink
                  end
                  to="/scan"
                  className={`block text-primary  ${
                    getPathName() == 'scan' && "text-white"
                  } truncate transition duration-150`}
                >
                  <div className="flex items-center">
                    <RiScan2Line
                      size={20}
                      color={getPathName() == 'scan' ? "white" : "black"}
                    />
                    <span
                      className={`text-sm font-bold e ml-3 ${
                        getPathName() == 'scan'
                          ? "text-white"
                          : "text-secondary"
                      } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                    >
                      Scans
                    </span>
                  </div>
                </NavLink>
              </li>
              {user?.role == "admin" && (
                <li
                  className={`px-3 py-3 mb-0.5 last:mb-0 ${
                    getPathName() == 'user' && "bg-primary"
                  }`}
                >
                  <NavLink
                    end
                    to="/user"
                    className={`block text-primary  ${
                     getPathName() == 'user' && "text-white"
                    } truncate transition duration-150`}
                  >
                    <div className="flex items-center">
                      <BiUserCircle
                        size={20}
                        color={getPathName() == 'user' ? "white" : "black"}
                      />
                      <span
                        className={`text-sm font-bold e ml-3 ${
                         getPathName() == 'user' ? "text-white" : "text-secondary"
                        } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                      >
                        Users
                      </span>
                    </div>
                  </NavLink>
                </li>
              )}

              <li
                className={`px-3 py-3 mb-0.5 last:mb-0 ${
                  getPathName() == 'search' && "bg-primary"
                }`}
              >
                <NavLink
                  end
                  to="/search"
                  className={`block text-primary  ${
                    getPathName() == 'search' && "text-white"
                  } truncate transition duration-150`}
                >
                  <div className="flex items-center">
                    <BiSearchAlt
                      size={20}
                      color={getPathName() == 'search' ? "white" : "black"}
                    />
                    <span
                      className={`text-sm font-bold e ml-3 ${
                        getPathName() == 'search' ? "text-white" : "text-secondary"
                      } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                    >
                      Search
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
