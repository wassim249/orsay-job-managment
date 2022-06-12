import React, { useState, useRef, useEffect, useContext } from "react";
import Transition from "../../utils/Transition";
import { IoIosArrowDown } from "react-icons/io";
import { MdLanguage } from "react-icons/md";
import LangContext from "../../contexts/LangContext";

function LangMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lang, setLang] = useContext(LangContext);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group ml-5"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className="flex items-center truncate">
          <MdLanguage size="20" color="gray" />
          <span className="truncate  text-sm   group-hover:text-darkPrimary">
            {lang.toUpperCase()}
          </span>
          <IoIosArrowDown size="15" color="black" />
        </div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <ul>
            <li>
              <a
                onClick={() => setLang("EN")}
                className="font-medium text-sm text-secondary   py-1 px-3 hover:cursor-pointer"
              >
                English <span className="text-primary">(EN)</span>
              </a>
            </li>

            <li>
              <a
                onClick={() => setLang("FR")}
                className="font-medium text-sm text-secondary   py-1 px-3 hover:cursor-pointer"
              >
                French <span className="text-primary">(FR)</span>
              </a>
            </li>

            <li>
              <a
                onClick={() => setLang("DE")}
                className="font-medium text-sm text-secondary   py-1 px-3 hover:cursor-pointer"
              >
                German <span className="text-primary">(DE)</span>
              </a>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default LangMenu;
