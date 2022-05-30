import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import SquareLoader from "react-spinners/SquareLoader";
import { editUser, getUsers } from "../../services/user";
import { generatePassword } from "../../utils/Utils";
import { AlertContext } from "../../contexts/AlertContext";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";

export const EditUserPage = () => {
  const { id: userID } = useParams();
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [alertData, setAlertData] = useContext(AlertContext);

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

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    if (fetchedUser?.firstName.trim() === "")
      return setAlertData({
        message: "First name is required",
        type: "error",
      });
    if (fetchedUser?.lastName.trim() === "")
      return setAlertData({
        message: "Last name is required",
        type: "error",
      });
    if (fetchedUser?.email.trim() === "")
      return setAlertData({
        message: "Email is required",
        type: "error",
      });

    setLoading(true);
    const data = await editUser(userID, {
      firstName: fetchedUser?.firstName,
      lastName: fetchedUser?.lastName,
      email: fetchedUser?.email,
      role: fetchedUser?.role,
      password: fetchedUser?.password,
    });
    if (data) navigate(`/user/${userID}`);
    else
      setAlertData({
        message: "Something went wrong",
        type: "error",
      });
    setLoading(false);
  };

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          {alertData && <AlertMessage />}
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <span className="  font-bold text-2xl text-secondary">
            {LANG["editUser"]["Edit User"][lang]} #{userID}
          </span>
          <form className="grid grid-cols-2 gap-5 mt-10  ">
            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                {LANG["createUser"]["First name"][lang]} :{" "}
                <span className="text-primary">*</span>
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                onChange={(e) =>
                  setFetchedUser({ ...fetchedUser, firstName: e.target.value })
                }
                placeholder="eg. John"
                value={fetchedUser && fetchedUser.firstName}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                {LANG["createUser"]["Last name"][lang]} :{" "}
                <span className="text-primary">*</span>
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                onChange={(e) =>
                  setFetchedUser({ ...fetchedUser, lastName: e.target.value })
                }
                placeholder="eg. Doe"
                value={fetchedUser && fetchedUser.lastName}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                {LANG["createUser"]["Email adress"][lang]} :{" "}
                <span className="text-primary">*</span>
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                onChange={(e) =>
                  setFetchedUser({ ...fetchedUser, email: e.target.value })
                }
                placeholder="eg. john.doe@email.com"
                value={fetchedUser && fetchedUser.email}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                Role : <span className="text-primary">*</span>
              </label>
              <select
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                onChange={(e) =>
                  setFetchedUser({ ...fetchedUser, role: e.target.value })
                }
                value={fetchedUser && fetchedUser.role}
                required
              >
                <option value="admin">
                  {LANG["common"]["roles"]["admin"][lang]}
                </option>
                <option value="scanner">
                  {LANG["common"]["roles"]["scanner"][lang]}
                </option>
                <option value="viewer">
                  {LANG["common"]["roles"]["viewer"][lang]}
                </option>
              </select>
            </div>

            <div className="col-span-2 mt-4 mb-6">
              <label className="block text-secondary text-sm d mb-2">
                {LANG["createUser"]["Generate password"][lang]} :
              </label>
              <div className="flex justify-between items-center w-full ">
                <input
                  className="appearance-none border grow py-2 px-3 text-slate-700 bg-slate-100 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  disabled
                  value={fetchedUser && fetchedUser.password}
                  placeholder="•••••••••••••••"
                  required
                />

                <button
                  className="bg-transparent border   border-secondary hover:bg-primary-dark text-secondary ml-3 py-2 px-4 focus:outline-none focus:shadow-outline hover:bg-secondary hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    const password = generatePassword();
                    setFetchedUser({ ...fetchedUser, password });
                  }}
                >
                 {LANG["createUser"]["Generate"][lang]}
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <button
                onClick={handleUserUpdate}
                className="bg-primary hover:bg-darkPrimary w-full text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
              >
                {LANG["editUser"]["Update"][lang]}
              </button>
            </div>
          </form>
        </>
      )}
    </Layout>
  );
};
