"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const NavCtx = createContext();

const NavContext = ({ children }) => {
  const [navOpened, setNavOpened] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  return (
    <NavCtx.Provider
      value={{
        navOpened,
        searchFocused,
        setNavOpened,
        setSearchFocused,
      }}
    >
      {children}
    </NavCtx.Provider>
  );
};

export default NavContext;

export const useNavCOLOR = () => {
  return useContext(NavCtx);
};
