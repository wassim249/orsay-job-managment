import axios from './axiosConfig'

export const loginService = async (email, password, rememberMe) => {
  try {
    const { data } = await axios.post('/auth/login', {
      email,
      password,
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
