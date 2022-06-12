import React, { useState } from "react";
import SearchModal from "./header/SearchModal";
import UserMenu from "./header/UserMenu";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { BsSearch } from "react-icons/bs";
import LangMenu from "./header/LangMenu";
import { useLocation } from "react-router-dom";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  let keysPressed = {};
  document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
    if (keysPressed["Control"] && event.key == "k") {
      event.preventDefault();
      try {
        setSearchModalOpen(() => !searchModalOpen);
      } catch (e) {}
    }
  });
  document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
  });

  return (
    <header className="sticky top-0 bg-white z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <HiOutlineMenuAlt4 size="25" color="black" />
            </button>
          </div>

          <div className="flex items-center">
            {!pathname.startsWith("/search") && (
              <>
                <button
                  className={`w-8 h-8 flex items-center justify-center  ml-3 `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchModalOpen(true);
                  }}
                  aria-controls="search-modal"
                >
                  <span className="sr-only">Search</span>
                  <BsSearch size="25" color="black" />
                </button>

                <SearchModal
                  id="search-modal"
                  searchId="search"
                  modalOpen={searchModalOpen}
                  setModalOpen={setSearchModalOpen}
                />
              </>
            )}

            {/*  Divider */}
            <hr className="w-px h-6 bg-slate-200 mx-3" />
            <UserMenu />
            <LangMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
