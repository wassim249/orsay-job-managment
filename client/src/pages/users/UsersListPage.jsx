import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { BiGroup } from "react-icons/bi";
import SquareLoader from "react-spinners/SquareLoader";
import moment from "moment";

import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/user";

export const UsersListPage = () => {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getUsers();
      if (data) setUsers(data.users);
      else alert(data?.message);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-secondary font-bold font-montserat flex items-center">
              <BiGroup size={40} color="#f88c6c" className="mr-2" /> Users list
            </h1>
            <button
              className="bg-secondary text-white py-2 px-3 font-montserat"
              onClick={() => navigate("/user/create")}
            >
              + Create user
            </button>
          </div>

          <table className="table-auto w-full mt-4 font-montserat overflow-x-auto">
            <thead>
              <tr className="bg-primary text-white  font-medium text-center">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Full name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">last connection</th>
                <th className="px-4 py-2 bg-lightPrimary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, key) => (
                  <tr key={key}>
                    <td className=" p-2">{user && user.id}</td>
                    <td className=" p-2">
                      {user && `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className=" p-2">{user && user.email}</td>
                    <td className=" p-2 text-center">
                      {user &&
                        (moment(user.lastConnection).toDate().getFullYear() !=
                        1970
                          ? moment(user.lastConnection).format(
                              "DD/MM/YYYY HH:mm"
                            )
                          : "Never")}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-transparent hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent"
                        onClick={() => {
                          navigate(`/user/${user.id}`);
                        }}
                      >
                        View
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
