import React from "react";
import { BsSearch } from "react-icons/bs";
import FilterButton from "./actions/FilterButton";

export const SearchBar = ({
  setSearchTerm,
  searchTerm,
  filter,
  setFilter,
  searchType,
  setSearchType,
  sort,
  setSort,
  handleSearch,
}) => {
  return (
    <form className="bg-slate-100 p-4 w-full shadow" onSubmit={handleSearch}>
      <div className="flex items-center justify-between">
        <div className="relative flex-grow mr-2">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <BsSearch />
          </div>
          <input
            type="search"
            value={searchTerm}
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500  "
            placeholder="Enter search term"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span
            onClick={() => {
              setSearchTerm("");
            }}
            className="text-gray-900 absolute right-2.5 bottom-2.5 font-medium text-sm px-4 py-2 hover:cursor-pointer"
          >
            X
          </span>
        </div>
        <button
          className="px-3 py-1 bg-primary hover:bg-darkPrimary text-white h-14"
          type="submit"
        >
          Search
        </button>
      </div>
      <div className="flex items-center justify-between mt-4">
        <select
          onClick={(e) => {
            setSort(e.target.value);
          }}
          className="p-4 w-1/3 h-14 text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary  "
          placeholder="Sort by "
        >
          <option defaultValue value="oldnew">
            Oldest to newest
          </option>
          <option value="newold">Newest to oldest</option>
          {searchType == "orders" && <option value="az">A-Z</option>}
          {searchType == "orders" && <option value="za">Z-A</option>}
        </select>
        <select
          onChange={(e) => {
            setSearchType(e.target.value);
          }}
          className="p-4 w-1/5 h-14 text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary  "
          value={searchType}
        >
          <option value="scans">Scans</option>
          <option value="orders">Orders</option>
        </select>
        <FilterButton
          searchType={searchType}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
    </form>
  );
};
