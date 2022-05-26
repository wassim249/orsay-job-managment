import axios from "./axiosConfig";

export const getSearchedScans = async (searchValue,filter) => {
    try {
        const {data} = await axios.post(`/search/scans/`, {
          
                searchValue,
                filter
            
        });
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}