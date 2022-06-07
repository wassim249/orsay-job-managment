import axios from "./axiosConfig";
const lang = () => localStorage.getItem("ORSAY_LANG") || "en";

export const loginService = async (email, password) => {
  try {
    const { data } = await axios.post("/auth/login", {
      email,
      password,
      lang: lang(),
    });

    return data;
  } catch (error) {
    console.log(error);
    return {
      message: "Unkown error",
      user: null,
    };
  }
};

export const requestService = async () => {
  try {
    const { data } = await axios.get("/auth/register/request");
    return data;
  } catch (error) {
    console.log(error);
    return {
      message: "Unkown error",
    };
  }
};

export const getAllRequests = async () => {
  try {
    const { data } = await axios.get("/register/request/all");
    return data;
  } catch (error) {
    console.log(error);
    return {
      message: "Unkown error",
    };
  }
};
