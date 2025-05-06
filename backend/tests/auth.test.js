const request = require('supertest');
const app = require('../app');
let chai;
let expect;

before(async () => {
  // Dynamically import chai
  chai = await import('chai');
  expect = chai.expect;
});

describe('Auth Routes', () => {
  // it('should register a new user', async () => {
  //   const res = await request(app)
  //     .post('/api/auth/signup')
  //     .send({
  //       username: 'Test User',
  //       email: 'testuser@example.com',
  //       password: 'Test1234@'
  //     });
  //   expect(res.statusCode).to.equal(201);
  // });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test1234@'
      });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
    console.log('Login Token:', res.body.token); 
  });
});
