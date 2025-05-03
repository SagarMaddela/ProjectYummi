const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;


describe('Admin Routes', () => {
  let token;

  before(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'harish@gmail.com', password: 'harish@22' });
    token = login.body.token;
    console.log('Token:', token); // Log the token for debugging
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/admin/adminuser')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('should get order list', async () => {
    const res = await request(app)
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

//   it('should get total revenue', async () => {
//     const res = await request(app)
//       .get('/api/admin/total-revenue')
//       .set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).to.equal(200);
//   });

//   it('should get most ordered items', async () => {
//     const res = await request(app)
//       .get('/api/admin/most-ordered-items')
//       .set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).to.equal(200);
//   });
});
