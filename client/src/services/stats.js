import axios from "./axiosConfig";
const lang = () => localStorage.getItem("ORSAY_LANG") || "en";

export const getSuccVsFail = async (range) => {
  try {
    const { data } = await axios.post("/stats/successvsfailure", {
      range,
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScanInfo = async (range) => {
  try {
    const { data } = await axios.post("/stats/scaninfo", {
      range,
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFailReason = async (range) => {
  try {
    const { data } = await axios.post("/stats/failedreason", {
      range,
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNewUsers = async (range) => {
  try {
    const { data } = await axios.post("/stats/newusers", {
      range,
      lang: lang(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
