import createHttp from './BaseService';

const http = createHttp(true);

export const createAuction = (Auction) => http.post('/auction/', Auction)
export const getAuctions = () => http.get('/auction/')
export const getAuction = (id) => http.get(`/auction/${id}`)
export const editAuction = (id, body) => http.put(`/auction/${id}`, body)
export const closeAuction = (id) => http.put(`/auction/${id}/close`)
export const norifyAuction = (id) => http.put(`/auction/${id}/notify`)
export const lauchAuction = (id, body) => http.put(`/auction/${id}/launch`, body)