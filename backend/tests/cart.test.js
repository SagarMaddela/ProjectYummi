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
  // Log the token for debugging
//   it('should add an item to cart', async () => {
//     const res = await request(app)
//       .post('/api/cart/add')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ itemId: 'item123', quantity: 2 });
//     expect(res.statusCode).to.equal(201);
//   });

  it('should get cart items', async () => {
    const res = await request(app)
      .get('/api/cart/menu')
      .set('Authorization', `Bearer ${token}`);
      console.log('Cart-Token:', token);
    expect(res.statusCode).to.equal(200);
  });

//   it('should update cart quantity', async () => {
//     const res = await request(app)
//       .put('/api/cart/updatequantity/item123')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ quantity: 5 });
//     expect(res.statusCode).to.equal(200);
//   });
});
