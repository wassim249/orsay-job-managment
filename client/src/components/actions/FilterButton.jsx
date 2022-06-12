import React, { useState, useRef, useEffect, useContext } from "react";
import Transition from "../../utils/Transition";
import { BiFilter } from "react-icons/bi";
import LangContext from "../../contexts/LangContext";
import LANG from "../../../../i18n/lang.json";

const FilterButton = ({ filter, setFilter, searchType }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lang] = useContext(LangContext);

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
        className="btn bg-white h-14 w-14 border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault();
          setDropdownOpen(!dropdownOpen);
        }}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Filter</span>
        <wbr />
        <BiFilter size={20} />
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="origin-top-right z-10 absolute top-full left-0 right-auto md:left-auto md:right-0 min-w-56 bg-white border border-slate-200 pt-1.5 shadow-lg overflow-hidden mt-1"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">
            {LANG["search"]["Filters"][lang]}
          </div>
          <ul className="mb-4">
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  checked={filter.last7Days}
                  onChange={() =>
                    setFilter({ ...filter, last7Days: !filter.last7Days })
                  }
                  type="checkbox"
                  className="form-checkbox"
                />
                <span className="text-sm font-medium ml-2">
                  {LANG["search"]["Last 7 days"][lang]}
                </span>
              </label>
            </li>
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  checked={filter.last30Days}
                  onChange={() =>
                    setFilter({ ...filter, last30Days: !filter.last30Days })
                  }
                  type="checkbox"
                  className="form-checkbox"
                />
                <span className="text-sm font-medium ml-2">
                  {LANG["search"]["Last 30 days"][lang]}
                </span>
              </label>
            </li>
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  checked={filter.failed}
                  onChange={() =>
                    setFilter({ ...filter, failed: !filter.failed })
                  }
                  type="checkbox"
                  className="form-checkbox"
                />
                <span className="text-sm font-medium ml-2">
                  {LANG["common"]["failed"][lang]}
                </span>
              </label>
            </li>
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  checked={filter.success}
                  onChange={() =>
                    setFilter({ ...filter, success: !filter.success })
                  }
                  type="checkbox"
                  className="form-checkbox"
                />
                <span className="text-sm font-medium ml-2">
                  {LANG["common"]["succeed"][lang]}
                </span>
              </label>
            </li>
            {searchType == "scans" && (
              <li className="py-1 px-3">
                <label className="flex items-center">
                  <input
                    checked={filter.scheduled}
                    onChange={() =>
                      setFilter({ ...filter, scheduled: !filter.scheduled })
                    }
                    type="checkbox"
                    className="form-checkbox"
                  />
                  <span className="text-sm font-medium ml-2">
                    {LANG["search"]["Scheduled"][lang]}
                  </span>
                </label>
              </li>
            )}
          </ul>
          <div className="py-2 px-3 border-t border-slate-200 bg-slate-50">
            <ul className="flex items-center justify-between">
              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFilter({
                      last7Days: false,
                      last30Days: false,
                      failed: false,
                      success: false,
                      scheduled: false,
                    });
                  }}
                  className="btn-xs rounded-none bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                >
                  {LANG["search"]["Clear"][lang]}
                </button>
              </li>
              <li>
                <button
                  className="px-3 py-1 bg-primary hover:bg-darkPrimary text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen(false);
                  }}
                  onBlur={() => setDropdownOpen(false)}
                >
                  {LANG["search"]["Apply"][lang]}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default FilterButton;
