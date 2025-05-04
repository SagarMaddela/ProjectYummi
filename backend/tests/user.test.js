// const request = require('supertest');
// const app = require('../app');
// const chai = require('chai');
// const expect = chai.expect;


// describe('User Routes', () => {
//   let token;

//   before(async () => {
//     const login = await request(app)
//       .post('/api/auth/login')
//       .send({ email: 'bhargav@gmail.com', password: 'bhargav@22' });
//     token = login.body.token;
//   });

//   // Log the token for debugging
//   it('should fetch restaurants', async () => {
//     const res = await request(app)
//       .get('/api/user/userrestaurants')
//       .set('Authorization', `Bearer ${token}`);
//       console.log('User-Token:', token);
//     expect(res.statusCode).to.equal(200);
//   });

//   it('should get user profile', async () => {
//     const res = await request(app)
//       .get('/api/user/getprofile')
//       .set('Authorization', `Bearer ${token}`);
//       console.log('User-Token:', token);
//     expect(res.statusCode).to.equal(200);
//   });

//   it('should get active orders', async () => {
//     const res = await request(app)
//       .get('/api/user/activeorders')
//       .set('Authorization', `Bearer ${token}`);
//       console.log('User-Token:', token);
//     expect(res.statusCode).to.equal(200);
//   });

//   it('should get order history', async () => {
//     const res = await request(app)
//       .get('/api/user/orderhistory')
//       .set('Authorization', `Bearer ${token}`);
//       console.log('User-Token:', token);
//     expect(res.statusCode).to.equal(200);
//   });
// });
