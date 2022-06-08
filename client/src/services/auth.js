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
    console.log(lang());
    const { data } = await axios.post("/auth/register/request", {
      lang: lang(),
    });
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
    const { data } = await axios.get("auth/register/request/all", {
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return {
      message: "Unkown error",
    };
  }
};

export const changeStatus = async (id, status) => {
  try {
    const { data } = await axios.post("auth/register/request/status", {
      lang: lang(),
      id,
      status,
    });
    return data;
  } catch (error) {
    console.log(error);
    return {
      message: "Unkown error",
    };
  }
};
