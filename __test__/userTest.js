const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { User } = require("../models");
const { hashPassword, verifPassword, signToken } = require("../helpers/helper");

let access_token;
beforeAll(async () => {
    await sequelize.queryInterface.bulkInsert(
        "Users",
        require("../data/users.json").map((el) => {
            el.createdAt = el.updatedAt = new Date();
            el.password = hashPassword(el.password);
            return el;
        })
    );
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });
});

// GET users
describe("GET /users", () => {
    // success
    test("200 - success to get list of users ", async () => {
        const response = await request(app).get("/users").set("access_token", access_token)

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
        expect(response.body[0]).toHaveProperty("gender", expect.any(String));
        expect(response.body[0]).toHaveProperty("birthDate", expect.any(String));
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("password", expect.any(String));
        expect(response.body[0]).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body[0]).toHaveProperty("address", expect.any(String));
        expect(response.body[0]).toHaveProperty("ktpId", expect.any(String));
    })

    // failed because access_token null
    test("401 Failed to get list of users due to authentication problem", async () => {
        const response = await request(app)
            .get("/users")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

// GET users/:id
describe("GET /users/:id", () => {
    test("200 - success to get users with certain id", async () => {
        const response = await request(app).get("/users/1").set("access_token", access_token)

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("username", expect.any(String));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("password", expect.any(String));
    })

    test("401 Failed to get list of users due to authentication problem", async () => {
        const response = await request(app)
            .get("/users/1")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
    // Failed because id not found
    test("401 Failed to get list of users due to id not found", async () => {
        const response = await request(app)
            .get("/users/100000")
            .set("access_token", access_token);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

// POST users/register
describe("POST /users/register", () => {
    test("201 - success create account", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "JohnSmith successfully registered");
    })

    // 400 register failed - name null should return error
    test("400 - register failed because name is null", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    })

    // 400 register failed - gender null should return error
    test("400 - register failed because gender is null", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "username is required!");
    })

    // 400 register failed - email null should return error
    test("400 - register failed because email is null", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: "John Smith",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "email is required!");
    })

    // 400 register failed - password null should return error
    test("400 - register failed because password is null", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "password is required!");
    })

    // 400 register failed - name null should return error
    test("400 - register failed because name is null", async () => {
        const response = (await request(app).post("/users/register")).send({
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    })

    // invalid email format 
    test("400 - register failed because password less than 7", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: "John Smith",
            email: "JohnSmithgmail.com",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid email format!");
    })

    // password length less than 7 
    test("400 - register failed because password less than 7", async () => {
        const response = (await request(app).post("/users/register")).send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
            password: "secure"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "minimum password length is 7!");
    })
})

// POST users/login
describe("POST /users/login", () => {
    test("200 success to login", async () => {
        const response = (await request(app).post("/users/login")).send({
            username: "JohnDoe",
            password: "securepassword123",
        })
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token", expect.any(String));
        access_token = response.body.access_token;
    })

    // 400 login failed - username null should return error
    test("400 login failed - username null should return error", async () => {
        const response = (await request(app).post("/users/login")).send({
            password: "securepassword123",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "username is required!");
    })

    // 400 login failed - password null should return error
    test("400 login failed - password null should return error", async () => {
        const response = (await request(app).post("/users/login")).send({
            username: "JohnDoe",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "password is required!");
    })

    // 401 login failed - login with wrong username
    test("401 login failed - login with wrong username", async () => {
        const response = (await request(app).post("/users/login")).send({
            username: "JohnSena",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "invalid email/password");
    })

    // 401 login failed - login with wrong password
    test("401 login failed - login with wrong password", async () => {
        const response = (await request(app).post("/users/login")).send({
            username: "JohnDoe",
            password: "securepassword"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "invalid email/password");
    })
})







