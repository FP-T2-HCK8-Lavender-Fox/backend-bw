const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { Admin, Category, Event, Image, Leaderboard, User_Event, User } = require("../models");
const { hashPassword, verifPassword, signToken } = require("../helpers/helper");
let access_token;
beforeAll(async () => {
    try {
        // access_token = signToken({ id: 1 });
        // console.log(access_token);
        await sequelize.queryInterface.bulkInsert(
            "Admins",
            require("../data/admins.json").map((el) => {
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
    await sequelize.queryInterface.bulkDelete("Admins", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });
});

// GET admin
describe("GET /admin", () => {
    // success
    test("200 - success to get list of admin ", async () => {
        const response = await request(app).get("/admin").set("access_token", access_token)

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("username", expect.any(String));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("password", expect.any(String));
    })

    // failed because access_token null
    test("401 Failed to get list of admin due to authentication problem", async () => {
        const response = await request(app)
            .get("/admin")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

// GET admin/:id
describe("GET /admin/:id", () => {
    test("200 - success to get admin with certain id", async () => {
        const response = await request(app).get("/admin/1").set("access_token", access_token)

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("username", expect.any(String));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("password", expect.any(String));
    })

    test("401 Failed to get list of admin due to authentication problem", async () => {
        const response = await request(app)
            .get("/admin/1")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
    // Failed because id not found
    // test("401 Failed to get list of admin due to id not found", async () => {
    //     const response = await request(app)
    //         .get("/admin/100000")
    //         .set("access_token", access_token);

    //     expect(response.status).toBe(401);
    //     expect(response.body).toHaveProperty("message", "require a valid token!");
    // });
})

// POST admin/register
describe("POST /admin/register", () => {
    test("201 - success create account", async () => {
        const response = await request(app).post("/admin/register").send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "JohnSmith successfully registered");
    })

    // 400 register failed - username null should return error
    test("400 - register failed because username is null", async () => {
        const response = await request(app).post("/admin/register").send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "username is required!");
    })

    // 400 register failed - email null should return error
    test("400 - register failed because email is null", async () => {
        const response = await request(app).post("/admin/register").send({
            name: "John Smith",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "email is required!");
    })

    // 400 register failed - password null should return error
    test("400 - register failed because password is null", async () => {
        const response = await request(app).post("/admin/register").send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "password is required!");
    })

    // 400 register failed - name null should return error
    test("400 - register failed because name is null", async () => {
        const response = await request(app).post("/admin/register").send({
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
            password: "securepassword123"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    })

    // invalid email format
    test("400 - register failed because invalid email format", async () => {
        const response = await request(app).post("/admin/register").send({
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
        const response = await request(app).post("/admin/register").send({
            name: "John Smith",
            email: "JohnSmith@gmail.com",
            username: "JohnSmith",
            password: "secure"
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "minimum password length is 7!");
    })
})

// POST admin/login
// describe("POST /admin/login", () => {
//     test("200 success to login", async () => {
//         const response = (await request(app).post("/admin/login")).send({
//             username: "JohnDoe",
//             password: "securepassword123",
//         })
//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("access_token", expect.any(String));
//         access_token = response.body.access_token;
//     })

//     // 400 login failed - username null should return error
//     test("400 login failed - username null should return error", async () => {
//         const response = (await request(app).post("/admin/login")).send({
//             password: "securepassword123",
//         })
//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty("message", "username is required!");
//     })

//     // 400 login failed - password null should return error
//     test("400 login failed - password null should return error", async () => {
//         const response = (await request(app).post("/admin/login")).send({
//             username: "JohnDoe",
//         })
//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty("message", "password is required!");
//     })

//     // 401 login failed - login with wrong username
//     test("401 login failed - login with wrong username", async () => {
//         const response = (await request(app).post("/admin/login")).send({
//             username: "JohnSena",
//             password: "securepassword123"
//         })
//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty("message", "invalid email/password");
//     })

//     // 401 login failed - login with wrong password
//     test("401 login failed - login with wrong password", async () => {
//         const response = (await request(app).post("/admin/login")).send({
//             username: "JohnDoe",
//             password: "securepassword"
//         })
//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty("message", "invalid email/password");
//     })
// })








