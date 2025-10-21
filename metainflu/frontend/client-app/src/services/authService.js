
import api from './api';

const API_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/auth/';

const register = async (userData) => {
  const data = await api(API_URL + 'register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }));
  }
  return data;
};

const login = async (userData) => {
  const data = await api(API_URL + 'login', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }));
  }
  return data;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export default {
  register,
  login,
  logout,
};

