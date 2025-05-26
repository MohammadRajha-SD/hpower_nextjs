"use client";
import React, { createContext, useContext, useState } from "react";

const AdminCtx = createContext();

const AdminProvider = ({ children }) => {
  const [PageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  // `<iframe title="Product Master" height="1060" src="https://app.powerbi.com/view?r=eyJrIjoiOTc5NzcyYWQtNjcxMi00NTAwLWIzMWUtMjY3YTU4ZDM3OTBhIiwidCI6IjJmZjQ1MTMyLTJlYzgtNDQ0MC1iMmNmLWI4MWM2OTNjMGZlMSIsImMiOjl9" className="w-full rounded-b-lg" frameBorder="0" allowFullScreen ></iframe>`
  return (
    <AdminCtx.Provider
      value={{
        PageTitle,
        pageContent,
        setPageContent,
        setPageTitle,
      }}
    >
      {children}
    </AdminCtx.Provider>
  );
};

export default AdminProvider;

export const useAdmin = () => {
  return useContext(AdminCtx);
};
