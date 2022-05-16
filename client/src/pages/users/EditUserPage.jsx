import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import SquareLoader from "react-spinners/SquareLoader";
import { getUsers } from "../../services/user";
import moment from "moment";
import { scanSuccess } from "../../utils/Utils";

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

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <span className="font-montserat font-bold text-2xl text-secondary">
            User #{userID && userID}
          </span>
          <form className="grid grid-cols-2 grid-gap-4 mt-10">
            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                First name : <span className="text-primary">*</span>
              </label>
              <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="your firstname here ..."
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
                placeholder="your firstname here ..."
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
                placeholder="your firstname here ..."
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
                placeholder="your firstname here ..."
                required
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="col-span-2">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-secondary text-sm d mb-2">
                Generate password : <span className="text-primary">*</span>
              </label>
              <div className="flex items-center w-full">
                <input
                  className="appearance-none border flex-grow-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  placeholder="your firstname here ..."
                  required
                />

                <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Generate
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </Layout>
  );
};
