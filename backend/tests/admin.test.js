const request = require('supertest');
const app = require('../app');
let chai;
let expect;

before(async () => {
  // Dynamically import chai
  chai = await import('chai');
  expect = chai.expect;
});

describe('Admin Routes', function() {
    this.timeout(10000);
  let token;

 
before(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'harish@gmail.com', password: 'harish@22' });
  
    // Log full response if token is undefined
    if (!loginRes.body.token) {
      console.error('Login Response:', loginRes.body);
      throw new Error('Failed to retrieve token');
    }
  
    token = loginRes.body.token;
    console.log('Admin-Token:', token); // Optional: for debugging
  })

   // Log the token for debugging
  it('should get all users', async () => {
    console.log('Admin-Token:', token);
    const res = await request(app)
      .get('/api/admin/adminuser')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('should get order list', async () => {
    console.log('Admin-Token:', token);
    const res = await request(app)
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

});
