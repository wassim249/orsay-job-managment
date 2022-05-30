import axios from "./axiosConfig";
const lang = () => localStorage.getItem("ORSAY_LANG") || "en";

export const getUsers = async (id) => {
  try {
    if (id) {
      const { data } = await axios.get(`/user/${id}`);
      return data;
    }
    const { data } = await axios.get(`/user`);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const editUser = async (id, userData) => {
  try {
    const { data } = await axios.put(`/user/${id}`, {...userData, lang: lang()});
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await axios.post(`/user`, {...userData , lang: lang()});
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
