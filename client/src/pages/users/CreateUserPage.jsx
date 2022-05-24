import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import SquareLoader from "react-spinners/SquareLoader";
import { generatePassword, validateEmail } from "../../utils/Utils";
import { createUser } from "../../services/user";

export const CreateUserPage = () => {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role != "admin") navigate("/");
  }, []);

  const handleUserCreate = async (e) => {
    e.preventDefault();
    if (createdUser?.firstName.trim() === "")
      return alert("First name is required");
    if (createdUser?.lastName.trim() === "")
      return alert("Last name is required");
    if (createdUser?.email.trim() === "") return alert("Email is required");
    if (!validateEmail(createdUser?.email))
      return alert("Email format is invalid");
    if (createdUser?.password.trim() === "")
      return alert("Password is required");
    setLoading(true);
    const data = await createUser(createdUser);
    if (data) {
      if (data.message) return alert(data.message);
      else navigate(`/user/${data.newUser.id}`);
    } else alert("Something went wrong");
    setLoading(false);
  };

  return (
    <Layout>
      <span className="  font-bold text-2xl text-secondary">Create User</span>
      <span className="block   text-sm">User will be notified by email</span>
      <form className="grid grid-cols-2 gap-5 mt-8  ">
        <div className="col-span-2">
          <label className="block text-secondary text-sm d mb-2">
            First name : <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={createdUser?.firstName || ""}
            onChange={(e) =>
              setCreatedUser({ ...createdUser, firstName: e.target.value })
            }
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
            value={createdUser?.lastName || ""}
            onChange={(e) =>
              setCreatedUser({ ...createdUser, lastName: e.target.value })
            }
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
            value={createdUser?.email || ""}
            onChange={(e) =>
              setCreatedUser({ ...createdUser, email: e.target.value })
            }
            placeholder="your lastName here ..."
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
            placeholder="your firstname here ..."
            required
          >
            <option value="admin">Admin</option>
            <option value="scanner">Scanner</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="col-span-2 mt-4 mb-6">
          <label className="block text-secondary text-sm d mb-2">
            Generate password :<span className="text-primary">*</span>
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
              Generate
            </button>
          </div>
        </div>

        <div className="col-span-2">
          <button
            onClick={handleUserCreate}
            className="bg-primary hover:bg-darkPrimary w-full text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
          >
            {loading ? <SquareLoader size={20} color={"#fff"} /> : "Create"}
          </button>
        </div>
      </form>
    </Layout>
  );
};
