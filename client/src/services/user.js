import axios from "./axiosConfig";

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
    console.log(id, userData);
    const { data } = await axios.put(`/user/${id}`, userData);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async (userData) => {
  try {
    console.log(userData);
    const { data } = await axios.post(`/user`, userData);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
