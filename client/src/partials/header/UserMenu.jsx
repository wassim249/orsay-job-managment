import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Transition from "../../utils/Transition";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import { UserAvatar } from "./UserAvatar";

const UserMenu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const [user, setUser] = useContext(UserContext);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <UserAvatar
          firstName={user && user.firstName}
          lastName={user && user.lastName}
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm   group-hover:text-darkPrimary text-primary">
            {user && user.firstName}
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
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800  ">
              {user && `${user.firstName} ${user.lastName}`}
            </div>
            <div className="text-xs text-slate-500 italic  ">
              {user && user.role}
            </div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-primary   hover:text-darkPrimary flex items-center py-1 px-3"
                to="/profile"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                Profile
              </Link>
            </li>
            <li>
              <span
                className="font-medium text-sm text-primary   hover:text-darkPrimary flex items-center py-1 px-3 hover:cursor-pointer"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  localStorage.removeItem("ORSAY_USER");
                  localStorage.removeItem(`ORSAY_SEARCH_${user.id}`);
                  setUser(null);
                }}
              >
                Sign Out
              </span>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
};

export default UserMenu;
