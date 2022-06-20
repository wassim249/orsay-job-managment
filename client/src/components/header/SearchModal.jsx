import React, { useRef, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import Transition from "../../utils/Transition";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";

const SearchModal = ({ id, searchId, modalOpen, setModalOpen }) => {
  const modalContent = useRef(null);
  const searchInput = useRef(null);
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  const [recentSearch, setRecentSearch] = useState(
    JSON.parse(localStorage.getItem(`ORSAY_SEARCH_${user && user.id}`)) || []
  );
  const navigate = useNavigate();

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    modalOpen && searchInput.current.focus();
  }, [modalOpen]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center transform px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg"
        >
          {/* Search form */}
          <form
            className="border-b border-slate-200"
            onSubmit={async (e) => {
              e.preventDefault();
              localStorage.setItem(
                `ORSAY_SEARCH_${user.id}`,
                JSON.stringify([
                  ...(JSON.parse(
                    localStorage.getItem(`ORSAY_SEARCH_${user.id}`)
                  ) || []),
                  searchInput.current.value,
                ])
              );
              setModalOpen(false);
              navigate(`/search/`, {
                state: {
                  searchValue: searchInput.current.value,
                },
              });
            }}
          >
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                Search
              </label>
              <input
                className="w-full border-0 focus:ring-transparent placeholder-slate-400 appearance-none py-3 pl-10 pr-4"
                type="search"
                placeholder={LANG["layout"]["Search Anything"][lang]}
                ref={searchInput}
                required
              />
              <button
                className="absolute inset-0 right-auto group"
                type="submit"
                aria-label="Search"
              >
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-4 mr-2"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </div>
          </form>
          <div className="py-4 px-2">
            {recentSearch.length > 0 ? (
              <div className="mb-3 last:mb-0">
                <div className="w-full flex items-center justify-between text-xs font-semibold text-teal-500 px-2 mb-2">
                  <span className="">
                    {LANG["layout"]["Recent searches"][lang]}
                  </span>
                  <span
                    onClick={() => {
                      localStorage.removeItem(`ORSAY_SEARCH_${user.id}`);
                      setRecentSearch([]);
                    }}
                    className="hover:cursor-pointer hover:underline"
                  >
                    {LANG["layout"]["CLEAR"][lang]}
                  </span>
                </div>

                <ul className="text-sm">
                  {recentSearch.map((s, key) => (
                    <li key={key}>
                      <span
                        className="flex items-center p-2 text-indigo-400 hover:bg-indigo-500 hover:cursor-pointer hover:text-white group rounded-md"
                        onClick={() => {
                          setModalOpen(!modalOpen);
                          navigate(`/search/`, {
                            state: {
                              searchValue: s,
                            },
                          });
                        }}
                      >
                        <span>{s}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span>
                {LANG["layout"]["Search for a scan or an order number"][lang]}
              </span>
            )}
          </div>
        </div>
      </Transition>
    </>
  );
};

export default SearchModal;
