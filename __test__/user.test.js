const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { User } = require("../models");
const { hashPassword, verifPassword, signToken } = require("../helpers/helper");

let access_token;
beforeAll(async () => {
    try {
        await sequelize.queryInterface.bulkInsert(
            "Users",
            require("../data/users.json").map((el) => {
                console.log(el);
                el.createdAt = el.updatedAt = new Date();
                el.password = hashPassword(el.password);
                return el;
            })
        );
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });
});

// POST users/register
describe("POST /users/register", () => {
    try {
        test("201 - success create account", async () => {
            const response = await request(app).post("/users/register").send({
                name: "John Smith",
                email: "JohnSmith@gmail.com",
                gender: "Male",
                password: "securepassword123",
            })
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "JohnSmith@gmail.com successfully registered");
        })
    } catch (error) {
        console.log(error);
    }

    // 400 register failed - name null should return error
    try {
        test("400 - register failed because name is null", async () => {
            const response = await request(app).post("/users/register").send({
                email: "JohnSmith@gmail.com",
                password: "securepassword123",
                gender: "Male",
            })
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "name is required!");
        })
    } catch (error) {
        console.log(error);
    }


    // 400 register failed - gender null should return error
    test("400 - register failed because gender is null", async () => {
        const response = await request(app).post("/users/register").send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "gender is required!");
    })

    // 400 register failed - email null should return error
    test("400 - register failed because email is null", async () => {
        const response = await request(app).post("/users/register").send({
            name: "John Smith",
            gender: "Male",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "email is required!");
    })

    // 400 register failed - password null should return error
    test("400 - register failed because password is null", async () => {
        const response = await request(app).post("/users/register").send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            gender: "Male"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "password is required!");
    })

    // 400 register failed - name null should return error
    test("400 - register failed because name is null", async () => {
        const response = await request(app).post("/users/register").send({
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    })

    // invalid email format 
    test("400 - register failed because password less than 7", async () => {
        const response = await request(app).post("/users/register").send({
            name: "John Smith",
            email: "JohnSmithgmail.com",
            gender: "Male",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid email format!");
    })

    // password length less than 7 
    test("400 - register failed because password less than 7", async () => {
        const response = await request(app).post("/users/register").send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            password: "secure",
            gender: "Male"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "minimum password length is 7!");
    })
})

// POST users/login
describe("POST /users/login", () => {
    test("201 success to login", async () => {
        const response = await request(app).post("/users/login").send({
            email: "johndoe@example.com",
            password: "securepassword123",
        })
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token", expect.any(String));
        access_token = response.body.access_token;
    })

    // 400 login failed - username null should return error
    test("400 login failed - email null should return error", async () => {
        const response = await request(app).post("/users/login").send({
            password: "securepassword123",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "email is required!");
    })

    // 400 login failed - password null should return error
    test("400 login failed - password null should return error", async () => {
        const response = await request(app).post("/users/login").send({
            email: "johndoe@example.com",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "password is required!");
    })

    // 401 login failed - login with wrong email
    test("400 login failed - login with wrong username", async () => {
        const response = await request(app).post("/users/login").send({
            email: "johnDOE@example.com",
            password: "securepassword123"
        })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "invalid email/password");
    })

    // 401 login failed - login with wrong password
    test("400 login failed - login with wrong password", async () => {
        const response = await request(app).post("/users/login").send({
            email: "johndoe@example.com",
            password: "securepassword9871661"
        })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "invalid email/password");
    })
})












