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
