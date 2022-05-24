import axios from "./axiosConfig";

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
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScan = async (id) => {
  try {
    const { data } = await axios.get(`/scan/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScans = async (userId) => {
  try {
    if (userId) {
      const { data } = await axios.get(`/scanbyuser/${userId}`);
      return data;
    }
    const { data } = await axios.get(`/scan`);
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
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
