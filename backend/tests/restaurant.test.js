const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;


describe('Restaurant Routes', () => {
  let token;

  before(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bhargav22@gmail.com', password: '12345678' });
    token = login.body.token;
  });

  it('should get restaurant dashboard', async () => {
    const res = await request(app)
      .get('/api/restaurant/restaurantDash')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('should get menu management', async () => {
    const res = await request(app)
      .get('/api/restaurant/menu')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('should get analytics', async () => {
    const res = await request(app)
      .get('/api/restaurant/analytics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('should get reviews', async () => {
    const res = await request(app)
      .get('/api/restaurant/reviews')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });
});
