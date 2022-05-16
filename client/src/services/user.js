import axios from './axiosConfig'


export  const getUsers = async (id) => {
    try {
        if(id)
        {
            const { data } = await axios.get(`/user/${id}`);
            return data;
        }
        const { data } = await axios.get(`/user`);
        return data;
    } catch (error) {
        console.log(error);
        return null
    
        
    }
}