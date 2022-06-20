import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  RiHomeLine,
  RiScan2Line,
  RiShoppingCart2Line,
  RiFilePaperLine,
} from "react-icons/ri";
import { BiSearchAlt, BiUserCircle, BiArrowBack } from "react-icons/bi";
import UserContext from "../contexts/UserContext";
import LANG from "../../../i18n/lang.json";
import LangContext from "../contexts/LangContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
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
    else if (pathname.startsWith("/orders")) return "orders";
    else if (pathname.startsWith("/user")) return "user";
    else if (pathname.startsWith("/request")) return "request";
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
        <div className="flex justify-between items-center mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <BiArrowBack color="black" />
          </button>
          {/* Logo */}
          <NavLink end to="/home" className="block">
            <span className="w-1/2 h-auto font-bold">CLIENT</span>
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
                  getPathName() == "home" && "bg-indigo-700 rounded-lg"
                }`}
              >
                <NavLink
                  end
                  to="/home"
                  className={`block ${
                    getPathName() == "home" && "text-white"
                  } truncate transition duration-150`}
                >
                  <div className="flex items-center">
                    <RiHomeLine
                      size={20}
                      color={getPathName() == "home" ? "white" : "#312e81"}
                    />
                    <span
                      className={`text-sm font-bold e ml-3 ${
                        getPathName() == "home"
                        && "text-white"
                      } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                    >
                      {LANG["layout"]["Home"][lang]}
                    </span>
                  </div>
                </NavLink>
              </li>

              <li
                className={`px-3 py-3 mb-0.5 last:mb-0 ${
                  getPathName() == "scan" && "bg-indigo-700 rounded-lg"
                }`}
              >
                <NavLink
                  end
                  to="/scan"
                  className={`block ${
                    getPathName() == "scan" && "text-white"
                  } truncate transition duration-150`}
                >
                  <div className="flex items-center">
                    <RiScan2Line
                      size={20}
                      color={getPathName() == "scan" ? "white" : "#312e81"}
                    />
                    <span
                      className={`text-sm font-bold e ml-3 ${
                        getPathName() == "scan"
                        && "text-white"
                      } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                    >
                      {LANG["layout"]["Scans"][lang]}
                    </span>
                  </div>
                </NavLink>
              </li>
              <li
                className={`px-3 py-3 mb-0.5 last:mb-0 ${
                  getPathName() == "orders" && "bg-indigo-700 rounded-lg"
                }`}
              >
                <NavLink
                  end
                  to="/orders"
                  className={`block ${
                    getPathName() == "scan" && "text-white"
                  } truncate transition duration-150`}
                >
                  <div className="flex items-center">
                    <RiShoppingCart2Line
                      size={20}
                      color={getPathName() == "orders" ? "white" : "#312e81"}
                    />
                    <span
                      className={`text-sm font-bold e ml-3 ${
                        getPathName() == "orders"
                        && "text-white"
                      } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                    >
                      {LANG["layout"]["Orders"][lang]}
                    </span>
                  </div>
                </NavLink>
              </li>
              {user?.role == "admin" && (
                <li
                  className={`px-3 py-3 mb-0.5 last:mb-0 ${
                    getPathName() == "user" && "bg-indigo-700 rounded-lg"
                  }`}
                >
                  <NavLink
                    end
                    to="/user"
                    className={`block ${
                      getPathName() == "user" && "text-white"
                    } truncate transition duration-150`}
                  >
                    <div className="flex items-center">
                      <BiUserCircle
                        size={20}
                        color={getPathName() == "user" ? "white" : "#312e81"}
                      />
                      <span
                        className={`text-sm font-bold e ml-3 ${
                          getPathName() == "user"
                          && "text-white"
                        } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                      >
                        Users
                      </span>
                    </div>
                  </NavLink>
                </li>
              )}

              {user?.role == "admin" && (
                <li
                  className={`px-3 py-3 mb-0.5 last:mb-0 ${
                    getPathName() == "request" && "bg-indigo-700 rounded-lg"
                  }`}
                >
                  <NavLink
                    end
                    to="/requests"
                    className={`block ${
                      getPathName() == "request" && "text-white"
                    } truncate transition duration-150`}
                  >
                    <div className="flex items-center">
                      <RiFilePaperLine
                        size={20}
                        color={getPathName() == "request" ? "white" : "#312e81"}
                      />
                      <span
                        className={`text-sm font-bold e ml-3 ${
                          getPathName() == "request"
                            && "text-white"
                           
                        } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                      >
                        Requests
                      </span>
                    </div>
                  </NavLink>
                </li>
              )}

              <li
                className={`px-3 py-3 mb-0.5 last:mb-0 ${
                  getPathName() == "search" && "bg-indigo-700 rounded-lg"
                }`}
              >
                <NavLink
                  end
                  to="/search"
                  className={`block${
                    getPathName() == "search" && "text-white"
                  } truncate transition duration-150`}
                >
                  <div className="flex items-center">
                    <BiSearchAlt
                      size={20}
                      color={getPathName() == "search" ? "white" : "#312e81"}
                    />
                    <span
                      className={`text-sm font-bold e ml-3 ${
                        getPathName() == "search"
                        && "text-white"
                      } lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200  `}
                    >
                      {LANG["layout"]["Search"][lang]}
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
