import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import SquareLoader from "react-spinners/SquareLoader";
import { editUser, getUsers } from "../../services/user";
import { generatePassword } from "../../utils/Utils";

export const EditUserPage = () => {
  const { id: userID } = useParams();
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
    else if (user.role != "admin") navigate("/");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUsers(userID);
      console.log(data.user);
      if (data?.user) setFetchedUser(data.user);
      else navigate("/notfound");

      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    if (fetchedUser?.firstName.trim() === "")
      return alert("First name is required");
    if (fetchedUser?.lastName.trim() === "")
      return alert("Last name is required");
    if (fetchedUser?.email.trim() === "") return alert("Email is required");

    setLoading(true);
    const data = await editUser(userID, {
      firstName: fetchedUser?.firstName,
      lastName: fetchedUser?.lastName,
      email: fetchedUser?.email,
      role: fetchedUser?.role,
      password: fetchedUser?.password,
    });
    if (data) navigate(`/user/${userID}`);
    else alert("Something went wrong");
    setLoading(false);
  };

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <span className="font-montserat font-bold text-2xl text-secondary">
            Edit User #{userID && userID}
          </span>
          <form className="grid grid-cols-2 gap-5 mt-10 font-montserat">
            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                First name : <span className="text-primary">*</span>
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                onChange={(e) =>
                  setFetchedUser({ ...fetchedUser, firstName: e.target.value })
                }
                placeholder="your firstname here ..."
                value={fetchedUser && fetchedUser.firstName}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                Last name : <span className="text-primary">*</span>
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                onChange={(e) =>
                  setFetchedUser({ ...fetchedUser, lastName: e.target.value })
                }
                placeholder="your firstname here ..."
                value={fetchedUser && fetchedUser.lastName}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                Email adress : <span className="text-primary">*</span>
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                onChange={(e) =>
                  setFetchedUser({ ...fetchedUser, email: e.target.value })
                }
                placeholder="your firstname here ..."
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
                placeholder="your firstname here ..."
                value={fetchedUser && fetchedUser.role}
                required
              >
                <option value="admin">Admin</option>
                <option value="scanner">Scanner</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="col-span-2 mt-4 mb-6">
              <label className="block text-secondary text-sm d mb-2">
                Generate password :
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
                  className="bg-transparent border font-montserat border-secondary hover:bg-primary-dark text-secondary ml-3 py-2 px-4 focus:outline-none focus:shadow-outline hover:bg-secondary hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    const password = generatePassword();
                    setFetchedUser({ ...fetchedUser, password });
                  }}
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <button
                onClick={handleUserUpdate}
                className="bg-primary hover:bg-darkPrimary w-full text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
              >
                Update
              </button>
            </div>
          </form>
        </>
      )}
    </Layout>
  );
};
