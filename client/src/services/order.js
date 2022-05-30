import axios from "./axiosConfig";

export const getAllOrders = async () => {
  try {
    const lang = () => localStorage.getItem("ORSAY_LANG") || "en";

    const { data } = await axios.get(`/order/`);
    return data;
  } catch (error) {
    console.log(error);
    return {
      message: "UNTERNAL ERROR",
    };
  }
};
