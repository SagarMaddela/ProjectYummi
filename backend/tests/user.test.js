const request = require("supertest");
const app = require("../server"); 

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
