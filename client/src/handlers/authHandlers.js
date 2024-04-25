import axios from 'axios';

const api = axios.create({
    //baseURL: process.env.baseURL || 'http://localhost:3001/api/',
    baseURL: process.env.REACT_APP_API_URL + 'api/',
  });

const login = async (email, password) => {
    try {
        const res = await api.post('/login', { email, password });
        console.log(res);
        if (res.status === 200) {
            localStorage.setItem('accessToken', res.data.token);
            console.log("Access token stored to local storage");
            return res.data;
        }
    } catch (error) {
        throw error.response.data;
    }
}

const register = async (
    email, 
    password,
    rollno,
    name,
    role,
    department) => {
    try {
        const res = await api.post('/register', { email, password, rollno, name,role, department });
        if (res.status === 200) {
        console.log(res.data);
        localStorage.setItem('accessToken', res.data.token);
        console.log("Access token stored to local storage");
        return res.data;
        }
    } catch (error) {
        throw error.response.data;
    }
};

const logout = async () => {
    try {
        //const res = await api.post('/logout');
        //if (res.status === 200) {
        //    localStorage.removeItem('accessToken');
        //    return res.data;
        //}
        localStorage.removeItem('accessToken');
        console.log("Access token removed from local storage");
    } catch (error) {
        return error.response.data;
    }
}
const getUserInfo = async (token) => {
    try {
        const userInfo = await api.post('/getUser', {}, { headers: { Authorization: `Bearer ${token}` } });
        return userInfo.data;
    } catch (error) {
        console.error(error);
    }
}

export { login, logout, register, getUserInfo };