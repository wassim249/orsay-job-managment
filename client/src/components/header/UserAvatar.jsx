import React from "react";

export const UserAvatar = ({ firstName = "X", lastName = "X" }) => {
  return (
    <div className="w-8 h-8 flex justify-center items-center  bg-indigo-100 text-indigo-700   font-bold text-[80%] border border-indigo-700 rounded-md">
      {`${firstName && firstName.charAt(0)}${
        lastName && lastName.charAt(0)
      }`.toUpperCase()}
    </div>
  );
};
