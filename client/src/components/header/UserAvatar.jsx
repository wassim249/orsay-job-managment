import React from "react";

export const UserAvatar = ({ firstName = "X", lastName = "X" }) => {
  return (
    <div className="w-8 h-8 flex justify-center items-center  bg-lightPrimary text-primary   font-bold text-[80%] border border-primary">
      {`${firstName && firstName.charAt(0)}${
        lastName && lastName.charAt(0)
      }`.toUpperCase()}
    </div>
  );
};