import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import SquareLoader from "react-spinners/SquareLoader";
import { editUser, getUsers } from "../../services/user";
import { generatePassword, validateEmail } from "../../utils/Utils";
import { AlertContext } from "../../contexts/AlertContext";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";
import { AlertMessage } from "../../components/AlertMessage";

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

  const dotsPwd = (length) => {
    let pwd = "";
    for (let i = 0; i < length; i++) pwd += "•";
    return pwd;
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    console.log(!validateEmail(fetchedUser?.email.trim()));
    if (fetchedUser?.firstName.trim() === "") {
      setAlertData({
        message: LANG["alerts"]["First name is required"][lang],
        type: "error",
      });
      return;
    }
    if (fetchedUser?.lastName.trim() === "") {
      setAlertData({
        message: LANG["alerts"]["Last name is required"][lang],
        type: "error",
      });
      return;
    }
    if (fetchedUser?.email.trim() === "") {
      setAlertData({
        message: LANG["alerts"]["Email is required"][lang],
        type: "error",
      });
      return;
    }
    if (!validateEmail(fetchedUser?.email.trim())) {
      setAlertData({
        message: "Email is not valid",
        type: "error",
      });
      return;
    }

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
        message: LANG["alerts"]["Something went wrong"][lang],
        type: "error",
      });
    setLoading(false);
  };

  const handleDisableAccount = async (e) => {
    e.preventDefault();
    setLoading(true)
   
    const data = await editUser(userID, {
      disabled : !fetchedUser?.disabled }); console.log(data);
    if (data) {setAlertData({
      message: data.user?.disabled ?  LANG["editUser"]["Account disabled"][lang] : LANG["editUser"]["Account enabled"][lang],
      type: "success",
    });
    navigate(`/user/${userID}`);
  }
      else 
          setAlertData({
          message: LANG["alerts"]["Something went wrong"][lang],
          type: "error",
        });

      
      setLoading(false);
  }

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          {alertData && <AlertMessage />}
        
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
                {LANG["createUser"]["Last name"][lang]} :
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
                {fetchedUser?.password && (
                  <div className="border border-gray-600 bg-white w-full py-2 px-3">
                    <span className="font-bold text-xl">
                      {dotsPwd(fetchedUser?.password.length)}
                    </span>
                  </div>
                )}

                <button
                  className={`bg-transparent border border-secondary hover:bg-primary-dark text-secondary ml-3 py-2 px-4 focus:outline-none focus:shadow-outline hover:bg-secondary hover:text-white ${
                    !fetchedUser?.password && `w-full`
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!fetchedUser.password) {
                      const password = generatePassword();
                      setFetchedUser({ ...fetchedUser, password });
                    } else {
                      setFetchedUser({ ...fetchedUser, password: null });
                    }
                  }}
                >
                  {fetchedUser?.password
                    ? "X"
                    : LANG["createUser"]["Generate"][lang]}
                </button>
              </div>
            </div>

            <div className="col-span-2 text-center">
              <span
              onClick={(e)=>handleDisableAccount(e)}
              className="text-secondary text-sm d mb-2 hover:underline hover:text-primary hover:cursor-pointer"
              >
                {fetchedUser?.disabled ? LANG["editUser"]["Enable account"][lang] : LANG["editUser"]["Disable account"][lang]}
                
              </span>
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

