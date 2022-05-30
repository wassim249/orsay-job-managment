import axios from "./axiosConfig";

const lang = () => localStorage.getItem("ORSAY_LANG") || "en";

export const getSearchedScans = async (searchValue, filter) => {
  try {
    const { data } = await axios.post(`/search/scans/`, {
      searchValue,
      filter,
      lang: lang(),
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
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
