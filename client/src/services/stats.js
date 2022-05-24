import axios from "./axiosConfig";


export const getSuccVsFail = async () => {
    try {
        const {data} = await axios.get('/stats/successvsfailure');
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getScanInfo = async () => {
    try {
        const {data} = await axios.get('/stats/scaninfo');
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getFailReason = async () => {
    try {
        const {data} = await axios.get('/stats/failedreason');
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getNewUsers = async () => {
    try {
        const {data} = await axios.get('/stats/newusers');
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}