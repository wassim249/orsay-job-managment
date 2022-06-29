import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import moment from "moment";
import Layout from "../layout/Layout";
import UserContext from "../contexts/UserContext";
import { getUsers } from "../services/user";
import { scanSuccess } from "../utils/Utils";
import LangContext from "../contexts/LangContext";
import LANG from "../../../i18n/lang.json";
import { Status } from "../components/Status";

export const ProfilePage = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [lang] = useContext(LangContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUsers(user.id);
      if (data?.user) setFetchedUser(data.user);
      else navigate("/notfound");

      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <BeatLoader color="#6366f1" loading={loading} size="20px" />
        </div>
      ) : (
        <div className="w-full">
          <span className="  font-bold text-2xl">
            {LANG["profile"]["Your profile"][lang]}
          </span>
          <div className="grid grid-cols-2 grid-gap-4 mt-10">
            <div>
              <label className="block text-sm d mb-2  ">
                {LANG["profile"]["First name"][lang]}
              </label>
              <span className="text-primary   font-bold">
                {fetchedUser && fetchedUser.firstName}:
              </span>
            </div>

            <div>
              <label className="block text-sm d mb-2  ">
                {LANG["profile"]["Last name"][lang]}:
              </label>
              <span className="text-primary   font-bold">
                {fetchedUser && fetchedUser.lastName}
              </span>
            </div>

            <div>
              <label className="block text-sm d mb-2  ">
                {LANG["profile"]["Email adress"][lang]} :
              </label>
              <span className="text-primary   font-bold">
                {fetchedUser && fetchedUser.email}
              </span>
            </div>

            <div>
              <label className="block text-sm d mb-2  ">Role :</label>
              <UserRole
                role={
                  fetchedUser && LANG["common"]["roles"][fetchedUser.role][lang]
                }
              />
            </div>
          </div>

          <span className="  font-bold text-2xl mt-10">
            {LANG["profile"]["Latest scans"][lang]}
          </span>

          <table className="table-auto w-full mt-4 overflow-x-auto">
            <thead className="bg-indigo-500 text-white  font-medium text-center">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Destination</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchedUser?.Scan &&
                fetchedUser?.Scan.map((scan, key) => (
                  <tr key={key} className="text-sm text-center">
                    <td className="border p-2">
                      {scan &&
                        moment(scan.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td className="border p-2">{scan && scan.sourceFile}</td>
                    <td className="border p-2">
                      {scan && scan.destinationFile}
                    </td>

                    <td className="border p-2 font-bold">
                      {scan && <Status success={scanSuccess(scan)} icon />}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-transparent hover:bg-indigo-500 text-indigo-500 font-semibold hover:text-white py-2 px-4 border border-indigo-500 rounded-lg hover:border-transparent transition-all duration-300 ease-in-out"
                        onClick={() => {
                          navigate(`/scan/${scan.id}`);
                        }}
                      >
                        {LANG["common"]["view"][lang]}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

const UserRole = ({ role = "viewer" }) => (
  <div
    className={`flex items-center justify-center w-1/4 rounded-lg  ${
      role == "admin" ? "bg-rose-500" : "bg-indigo-500"
    }   font-bold py-2 px-4 text-white`}
  >
    {role}
  </div>
);
