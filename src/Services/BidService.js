import createHttp from './BaseService';

const http = createHttp(true);

export const createBid = (bidData) => http.post('/bid/', bidData);
export const getBids = () => http.get('/bid/')
export const getBid = (id) => http.get(`/bid/${id}`) 
export const editBid = (id, body) => http.put(`/bid/${id}`, body) 
export const deleteBid = (id) => http.delete(`/bid/${id}`) 
export const getBidForAuctionAndCompany = (auctionId, companyId) => http.get(`/bid/by-auction-and-company?auction=${auctionId}&company=${companyId}`);