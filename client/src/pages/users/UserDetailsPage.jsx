import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import BeatLoader from "react-spinners/BeatLoader";
import { getUsers } from "../../services/user";
import moment from "moment";
import { scanSuccess } from "../../utils/Utils";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";
import { Status } from "../../components/Status";

export const UserDetailsPage = () => {
  const { id: userID } = useParams();
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role != "admin") navigate("/");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUsers(userID);

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
        <>
          {fetchedUser?.disabled && <Disabled lang={lang} />}
          <span className="  font-bold text-2xl">
            {LANG["profile"]["User"][lang]} #{userID}
          </span>
          <div className="grid grid-cols-2 grid-gap-4 mt-10">
            <div>
              <label className="block text-sm d mb-2  ">
                {LANG["profile"]["First name"][lang]} :
              </label>
              <span className="text-primary   font-bold">
                {fetchedUser && fetchedUser.firstName}
              </span>
            </div>

            <div>
              <label className="block text-sm d mb-2  ">
                {LANG["profile"]["Last name"][lang]} :
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
              <label className="block text-sm d mb-2  ">
                Role :
              </label>
              <UserRole role={fetchedUser && fetchedUser.role || 'viewer'} lang={lang} />
            </div>

            <div>
              <label className="block text-sm   ">
                {LANG["usersList"]["last connection"][lang]} :
              </label>
              <span className="text-primary   font-bold">
                {fetchedUser &&
                  (moment(fetchedUser.lastConnection).toDate().getFullYear() !=
                  1970
                    ? moment(fetchedUser.lastConnection).format(
                        "DD/MM/YYYY HH:mm"
                      )
                    : "Never")}
              </span>
            </div>
          </div>

          <span className="  font-bold text-2xl mt-6">
            {fetchedUser && fetchedUser.firstName}'s Scans
          </span>

          <table className="table-auto w-full mt-4 overflow-x-auto">
            <thead
            className="bg-indigo-500 text-white  font-medium text-center"
            >
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
                      {scan && (
                        <Status success={scanSuccess(scan.status)} icon />
                      )}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-transparent hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent"
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

          <div className="flex justify-between items-center mt-10">
            <button
              onClick={() => {
                navigate(`/user/edit/${userID}`);
              }}
              className="bg-rose-500 text-white font-bold py-2 px-4 hover:rounded-sm rounded-lg transition-all duration-300 ease-in-out"
            >
              {LANG["usersList"]["Edit"][lang]}
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

const UserRole = ({ role = "viewer" , lang }) => (
  <div
    className={`flex items-center justify-center w-1/4 rounded-lg  ${
      role == "admin" ? "bg-rose-500" : "bg-indigo-500"
    }   font-bold py-2 px-4 text-white`}
  >
    {LANG['common']['roles'][role][lang]}
  </div>
);

const Disabled = ({ lang }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-slate-700 text-white w-1/6">
    <span className="font-bold">{LANG["editUser"]["Disabled"][lang]}</span>
  </div>
)
