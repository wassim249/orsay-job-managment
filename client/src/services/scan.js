import axios from "./axiosConfig";
const lang = () => localStorage.getItem("ORSAY_LANG") || "en";

export const createScan = async (
  source,
  destination,
  orders,
  logFile,
  userId
) => {
  try {
    const { data } = await axios.post("/scan/create", {
      source,
      destination,
      orders,
      logFile,
      userId,
      lang: lang(),
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScan = async (id) => {
  try {
    const { data } = await axios.post(`/scan/${id}`, {
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScans = async () => {
  try {
    const { data } = await axios.post(`/scan`, {
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const scheduleScan = async (
  cron,
  source,
  destination,
  orders,
  logFile,
  userId
) => {
  try {
    const { data } = await axios.post("/scan/schedule", {
      cron,
      source,
      destination,
      orders,
      logFile,
      userId,
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
