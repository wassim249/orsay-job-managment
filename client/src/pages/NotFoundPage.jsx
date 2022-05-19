import React from "react";
import Layout from "../layout/Layout";

export const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex flex-col  items-center justify-center h-screen">
        <h1
        
        className="text-6xl text-primary font-bold">404</h1>
        <span className="text-secondary">Page not found</span>
      </div>
    </Layout>
  );
};
