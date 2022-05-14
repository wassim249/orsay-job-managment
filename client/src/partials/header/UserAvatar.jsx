import React from 'react'

export const UserAvatar = ({firstName = 'X' , lastName = 'X'}) => {
  return (
    <div
    className = 'w-8 h-8 flex justify-center items-center  bg-lightPrimary text-primary font-montserat font-bold text-[80%] border border-primary'
    >
        
            {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
       
    </div>
  )
}
