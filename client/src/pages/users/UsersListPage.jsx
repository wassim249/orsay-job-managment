import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { BiGroup } from "react-icons/bi";
import SquareLoader from "react-spinners/SquareLoader";
import moment from "moment";
import LANG from "../../../../i18n/lang.json";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/user";
import { AlertContext } from "../../contexts/AlertContext";
import LangContext from "../../contexts/LangContext";
import { AlertMessage } from "../../components/AlertMessage";

export const UsersListPage = () => {
  const [lang] = useContext(LangContext);
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [alertData, setAlertData] = useContext(AlertContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user.role != "admin") navigate("/home");
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getUsers();
      if (data) setUsers(data.users);
      else
        setAlertData({
          message: data?.message,
          type: "success",
        });
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          {alertData && <AlertMessage />}
          <SquareLoader color="#6366f1" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold   flex items-center">
              <BiGroup size={40} color="#6366f1" className="mr-2" />
              {LANG["usersList"]["Users list"][lang]}
            </h1>
            <button
                className="border-2 border-rose-400 text-rose-400 hover:text-white hover:bg-rose-400 p-2 font-bold rounded-lg transition-all duration-300 ease-in-out"
                onClick={() => navigate("/user/create")}
            >
              + {LANG["usersList"]["Create user"][lang]}
            </button>
          </div>

          <table className="table-auto w-full mt-4 overflow-x-auto">
            <thead
            className="bg-indigo-500 text-white  font-medium text-center"
            >
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">
                  {LANG["usersList"]["Full name"][lang]}
                </th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">
                  {LANG["usersList"]["last connection"][lang]}
                </th>
                <th className="px-4 py-2 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, key) => (
                  <tr key={key}>
                    <td className=" p-2 border">{user && user.id}</td>
                    <td className=" p-2 border">
                      {user && `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className=" p-2 border">{user && user.email}</td>
                    <td className=" p-2 text-center border">
                      {user &&
                        (moment(user.lastConnection).toDate().getFullYear() !=
                        1970
                          ? moment(user.lastConnection).format(
                              "DD/MM/YYYY HH:mm"
                            )
                          : LANG["common"]["Never"][lang])}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-transparent hover:bg-indigo-500 text-indigo-500 font-semibold hover:text-white py-2 px-4 border border-indigo-500 rounded-lg hover:border-transparent"
                        onClick={() => {
                          navigate(`/user/${user.id}`);
                        }}
                      >
                        {LANG["common"]["view"][lang]}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
};
