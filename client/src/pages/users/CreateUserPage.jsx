import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import SquareLoader from "react-spinners/SquareLoader";
import { generatePassword, validateEmail } from "../../utils/Utils";
import { createUser } from "../../services/user";
import { AlertContext } from "../../contexts/AlertContext";
import LangContext from "../../contexts/LangContext";
import LANG from "../../../../i18n/lang.json";

export const CreateUserPage = () => {
  const [lang] = useContext(LangContext);
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [alertData, setAlertData] = useContext(AlertContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role != "admin") navigate("/");
  }, []);

  const handleUserCreate = async (e) => {
    e.preventDefault();
    if (createdUser?.firstName.trim() === "")
      return setAlertData({
        message: "First name is required",
        type: "error",
      });
    if (createdUser?.lastName.trim() === "")
      return setAlertData({
        message: "Last name is required",
        type: "error",
      });
    if (createdUser?.email.trim() === "")
      return setAlertData({
        message: "Email is required",
        type: "error",
      });
    if (!validateEmail(createdUser?.email))
      return setAlertData({
        message: "Email is not valid",
        type: "error",
      });
    if (createdUser?.password.trim() === "")
      return setAlertData({
        message: "Password is required",
        type: "error",
      });
    setLoading(true);
    const data = await createUser(createdUser);
    if (data) {
      if (data.message)
        return setAlertData({
          message: data.message,
          type: "success",
        });
      else navigate(`/user/${data.newUser.id}`);
    } else
      setAlertData({
        message: data?.message,
        type: "success",
      });
    setLoading(false);
  };

  return (
    <Layout>
      {alertData && <AlertMessage />}
      <span className="  font-bold text-2xl text-secondary">Create User</span>
      <span className="block   text-sm">User will be notified by email</span>
      <form className="grid grid-cols-2 gap-5 mt-8  ">
        <div className="col-span-2">
          <label className="block text-secondary text-sm d mb-2">
            {LANG["createUser"]["First name"][lang]} :{" "}
            <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={createdUser?.firstName || ""}
            onChange={(e) =>
              setCreatedUser({ ...createdUser, firstName: e.target.value })
            }
            placeholder="eg. John"
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
            value={createdUser?.lastName || ""}
            onChange={(e) =>
              setCreatedUser({ ...createdUser, lastName: e.target.value })
            }
            placeholder="eg. Doe"
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
            value={createdUser?.email || ""}
            onChange={(e) =>
              setCreatedUser({ ...createdUser, email: e.target.value })
            }
            placeholder="eg. john.doe@email.com"
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
            defaultValue={createdUser?.role || "viewer"}
            onChange={(e) =>
              setCreatedUser({ ...createdUser, role: e.target.value })
            }
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
            <span className="text-primary">*</span>
          </label>
          <div className="flex justify-between items-center w-full ">
            <input
              className="appearance-none border grow py-2 px-3 text-slate-700 bg-slate-100 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              disabled
              value={createdUser?.password || ""}
              placeholder="•••••••••••••••"
              required
            />

            <button
              className="bg-transparent border   border-secondary hover:bg-primary-dark text-secondary ml-3 py-2 px-4 focus:outline-none focus:shadow-outline hover:bg-secondary hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                const password = generatePassword();
                setCreatedUser({ ...createdUser, password });
              }}
            >
              {LANG["createUser"]["Generate"][lang]}
            </button>
          </div>
        </div>

        <div className="col-span-2">
          <button
            onClick={handleUserCreate}
            className="bg-primary hover:bg-darkPrimary w-full text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
          >
            {loading ? (
              <SquareLoader size={20} color={"#fff"} />
            ) : (
              LANG["createUser"]["Create"][lang]
            )}
          </button>
        </div>
      </form>
    </Layout>
  );
};
