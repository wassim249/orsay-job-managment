import axios from "./axiosConfig";

export const getSuccVsFail = async (range) => {
  try {
    const { data } = await axios.post("/stats/successvsfailure", {
      range,
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScanInfo = async (range) => {
  try {
    const { data } = await axios.post("/stats/scaninfo", { range });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFailReason = async (range) => {
  try {
    const { data } = await axios.post("/stats/failedreason", { range });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNewUsers = async (range) => {
  try {
    const { data } = await axios.post("/stats/newusers", { range });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
