import createHttp from './BaseService';

const http = createHttp();

export const register = (user) => http.post('/user/register', user);
export const loginMail = (user) => http.post('/user/login', user);