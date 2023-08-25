const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { Category } = require("../models");

let access_token;
beforeAll(async () => {
    await sequelize.queryInterface.bulkInsert(
        "Categories",
        require("../data/categories.json").map((el) => {
            el.createdAt = el.updatedAt = new Date();
            el.password = hashPassword(el.password);
            return el;
        })
    );
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Categories", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });
});

// GET users
describe("GET /categories", () => {
    // success
    test("200 - success to get list of categories ", async () => {
        const response = await request(app).get("/categories").set("access_token", access_token)

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
    })

    // failed because access_token null
    test("401 Failed to get list of categories due to authentication problem", async () => {
        const response = await request(app)
            .get("/categories")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

// GET categories/:id
describe("GET /categories/:id", () => {
    test("200 - success to get categories with certain id", async () => {
        const response = await request(app).get("/categories/1").set("access_token", access_token)

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
    })

    test("401 Failed to get list of categories due to authentication problem", async () => {
        const response = await request(app)
            .get("/users/1")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

// POST /categories/
describe("POST /categories/", () => {
    test("201 - success create category", async () => {
        const response = (await request(app).post("/categories/")).send({
            name: "",
        })
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "JohnSmith successfully registered");
    })

    // 400 adding category failed - name null should return error
    test("400 - adding category failed because name is null", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: null
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    })
})

// DELETE users
describe("DELETE /users/:id", () => {
    // success
    test("200 - success delete account with certain id", async () => {
        const response = (await request(app).delete("/users/1")).set("access_token", access_token)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "users successfully deleted");
    })

    // failed - unauthenticated
    test("401 Failed to get list of users due to authentication problem", async () => {
        const response = await request(app).delete("/users/1").set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

describe("PUT /categories/:id", () => {
    // success
    test("200 - success update category with certain id", async () => {
        const response = await request(app).put("/categories/1")
            .set("access_token", access_token)
            .send({
                name: "",
            })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "category successfully edited");
    })

    // failed - unauthenticated
    test("401 Failed to update category due to authentication problem", async () => {
        const response = await request(app).delete("/categories/1")
            .set("access_token", null)
            .send({
                name: "",
            })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})







