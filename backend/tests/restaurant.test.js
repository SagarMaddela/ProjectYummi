const request = require('supertest');
const app = require('../app');
let chai;
let expect;

before(async () => {
  // Dynamically import chai
  chai = await import('chai');
  expect = chai.expect;
});


describe('Restaurant Routes', () => {
  let token;

  before(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'redcafe@gmail.com', password: 'redcafe@1' });
    token = login.body.token;
  });


  it('should get restaurant dashboard', async () => {
    const res = await request(app)
      .get('/api/restaurant/restaurantDash')
      .set('Authorization', `Bearer ${token}`);
      console.log('Restaurant-Token:', token);
    expect(res.statusCode).to.equal(200);
  });

  it('should get menu management', async () => {
    const res = await request(app)
      .get('/api/restaurant/menu')
      .set('Authorization', `Bearer ${token}`);
      console.log('Restaurant-Token:', token);
    expect(res.statusCode).to.equal(200);
  });

  it('should get analytics', async () => {
    const res = await request(app)
      .get('/api/restaurant/analytics')
      .set('Authorization', `Bearer ${token}`);
      console.log('Restaurant-Token:', token);
    expect(res.statusCode).to.equal(200);
  });

  it('should get reviews', async () => {
    const res = await request(app)
      .get('/api/restaurant/reviews')
      .set('Authorization', `Bearer ${token}`);
      console.log('Restaurant-Token:', token);
    expect(res.statusCode).to.equal(200);
  });
});
