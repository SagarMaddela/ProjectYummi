const request = require('supertest');
const app = require('../app');
let chai;
let expect;

before(async () => {
  // Dynamically import chai
  chai = await import('chai');
  expect = chai.expect;
});


describe('Cart Routes', () => {
  let token;

  before(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'akhil12@gmail.com', password: 'akhil@12' });
    token = login.body.token;
  });


  // it('should get cart items', async () => {
  //   const res = await request(app)
  //     .get('/api/cart/menu')
  //     .set('Authorization', `Bearer ${token}`);
  //     console.log('Cart-Token:', token);
  //   expect(res.statusCode).to.equal(200);
  // });
  it('should get cart items', async () => {
    const res = await request(app)
      .get('/api/cart/menu')
      .set('Authorization', `Bearer ${token}`);
    // console.log('Response Body:', res.body);
    // console.log('Response Headers:', res.headers);
    // console.log('Cart-Token:', token);
    expect(res.statusCode).to.equal(200);
  });

});
