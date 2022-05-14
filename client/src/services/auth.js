import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const loginService = async (email, password, rememberMe) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return data;
  } catch (error) {
    return {
      message: "Unkown error",
      user: null,
    };
  }
};
