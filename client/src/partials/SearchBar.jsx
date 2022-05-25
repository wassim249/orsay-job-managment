import React from "react";
import { BsSearch } from "react-icons/bs";
import FilterButton from "./actions/FilterButton";

export const SearchBar = ({
  searchRef,
  filter,
  setFilter,
  searchType,
  setSearchType,
  sort,
  setSort,
}) => {
  return (
    <div className="bg-slate-100 p-4 w-full shadow">
      <div className="flex items-center justify-between">
        <div class="relative flex-grow mr-2">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <BsSearch />
          </div>
          <input
            type="search"
            ref={searchRef}
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500  "
            placeholder="Enter search term"
            required
          />
          <button
            type="submit"
            onClick={() => {
              searchRef.current.value = "";
            }}
            class="text-gray-900 absolute right-2.5 bottom-2.5 font-medium text-sm px-4 py-2"
          >
            X
          </button>
        </div>
        <select
          onChange={(e) => {
            setSearchType(e.target.value);
          }}
          className="p-4 w-1/5 text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary  "
        >
          <option value="scans">Scans</option>
          <option value="orders">Orders</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <select
          onClick={(e) => {
            setSort(e.target.value);
          }}
          className="p-4 w-1/3 text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary  "
          placeholder="Sort by "
        >
          <option defaultValue value="">
            Oldest to newest
          </option>
          <option value="">Newest to oldest</option>
          <option value="">A-Z</option>
          <option value="">Z-A</option>
        </select>
        <FilterButton filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
};
