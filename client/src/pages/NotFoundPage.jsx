import React, { useContext } from "react";
import Layout from "../layout/Layout";
import LANG from "../../../i18n/lang.json";
import LangContext from "../contexts/LangContext";

export const NotFoundPage = () => {
  const [lang] = useContext(LangContext);

  return (
    <Layout>
      <div className="flex flex-col  items-center justify-center h-screen">
        <h1 className="text-6xl text-primary font-bold">404</h1>
        <span className="text-secondary">
          {LANG["404"]["Page not found"][lang]}
        </span>
      </div>
    </Layout>
  );
};
