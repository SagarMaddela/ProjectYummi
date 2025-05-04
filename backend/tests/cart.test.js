const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;


describe('Cart Routes', () => {
  let token;

  before(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bhargav@gmail.com', password: 'bhargav@22' });
    token = login.body.token;
  });


  it('should get cart items', async () => {
    const res = await request(app)
      .get('/api/cart/menu')
      .set('Authorization', `Bearer ${token}`);
      console.log('Cart-Token:', token);
    expect(res.statusCode).to.equal(200);
  });

});
