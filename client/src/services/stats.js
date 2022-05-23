import axios from "./axiosConfig";


export const getSuccVsFail = async () => {
    try {
        const {data} = await axios.get('/stats/successvsfailure');
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getScanInfo = async () => {
    try {
        const {data} = await axios.get('/stats/scaninfo');
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getFailReason = async () => {
    try {
        const {data} = await axios.get('/stats/failedreason');
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}