import axios from "./axiosConfig";

export const getSearchedScans = async (searchValue, filter) => {
  try {
    const { data } = await axios.post(`/search/scans/`, {
      searchValue,
      filter,
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSearchedOrders = async (searchValue, filter) => {
  try {
    const { data } = await axios.post(`/search/orders/`, {
      searchValue,
      filter,
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
