import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import SquareLoader from "react-spinners/SquareLoader";
import UserContext from "../../contexts/UserContext";
import LangContext from "../../contexts/LangContext";
import { useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/AlertMessage";
import { AlertContext } from "../../contexts/AlertContext";
import {RiFilePaperLine} from 'react-icons/ri'

export const RequestsListPage = () => {
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useContext(AlertContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);
  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <> {alertData && <AlertMessage />}
             <h1 className="text-2xl text-secondary font-bold flex items-center">
              <RiFilePaperLine size={40} color="#f88c6c" className="mr-2" />
              Lastest authentification requests 
            </h1>
        </>
      )}
    </Layout>
  );
};
