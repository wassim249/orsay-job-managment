import React from "react";
import { BsSearch } from "react-icons/bs";
import FilterButton from "./actions/FilterButton";

export const SearchBar = () => {
  return (
    <div className="bg-slate-100 p-4 w-full shadow">
      <div className="flex items-center justify-between">
        <div class="relative flex-grow mr-2">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <BsSearch />
          </div>
          <input
            type="search"
            id="default-search"
            class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500  "
            placeholder="Enter search term"
            required
          />
          <button
            type="submit"
            class="text-gray-900 absolute right-2.5 bottom-2.5 font-medium text-sm px-4 py-2"
          >
            X
          </button>
        </div>
        <select>
          <option defaultValue value="">
            All
          </option>
          <option value="">Scans</option>
          <option value="">Orders</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <select placeholder="Sort by ">
          <option defaultValue value="">
            Oldest to newest
          </option>
          <option value="">Newest to oldest</option>
          <option value="">A-Z</option>
          <option value="">Z-A</option>
        </select>{" "}
        <FilterButton />
      </div>
    </div>
  );
};
