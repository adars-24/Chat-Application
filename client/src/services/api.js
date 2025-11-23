import axios from 'axios'

const url = 'https://chat-app-hqxd.onrender.com';

export const addUser = async (data) => {
    try {
        await axios.post(`${url}/add`, data)
    } catch (error) {
        console.log('error while calling api', error.message)
    }
}

export const  getUsers = async () => {
    try {
       let response=  await axios.get(`${url}/user`);
       
       return response.data;
       
    } catch (error) {
        console.log('error while calling api', error.message);
    }
}

export const setConversation = async (data) => {
    try {
        await axios.post(`${url}/conversation/add`, data);
    } catch (error) {
        console.log('error while calling  setConversation api', error.message);
        
    }
}

export const getConversation = async (data) => {
    try {
        let response = await axios.post(`${url}/conversation/get`, data);
        return response.data;
    } catch (error) {
        console.log('Error while calling getConversation API ', error);
    }
}


export const newMessage = async (data) => {
    console.log(data)
    try {
         await axios.post(`${url}/message/add`, data);
       
    } catch (error) {
        console.log('Error while calling newMessage API ', error);
    }
}


export const getMessage = async (id) => {
    try {
     let response =   await axios.get(`${url}/message/get/${id}`);
     return response.data;
       
    } catch (error) {
        console.log('Error while calling newMessage API ', error);
    }
}


export const uploadFile = async (data) => {
    try {
        return await axios.post(`${url}/file/upload`, data);
    } catch (error) {
        console.log('Error while calling uploadFile API ', error);
    }
}