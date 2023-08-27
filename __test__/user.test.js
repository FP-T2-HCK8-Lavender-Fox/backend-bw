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
    // // Failed because id not found
    // test("401 Failed to get list of users due to id not found", async () => {
    //     const response = await request(app)
    //         .get("/users/100000")
    //         .set("access_token", access_token);

    //     expect(response.status).toBe(401);
    //     expect(response.body).toHaveProperty("message", "require a valid token!");
    // });
})

// POST users/register
describe("POST /users/register", () => {
    try {
        test.only("201 - success create account", async () => {
            const response = await request(app).post("/users/register").send({
                name: "John Smith",
                email: "JohnSmith@gmail.com",
                gender: "Male",
                birthDate: "1990-05-15",
                phoneNumber: "123-456-7890",
                address: "123 Main St, City",
                username: "JohnSmith",
                password: "securepassword123",
                ktpId: "1234567890123456"
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
                name: "John Smith",
                email: "JohnSmith@gmail.com",
                password: "securepassword123"
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
        expect(response.body).toHaveProperty("message", "username is required!");
    })

    // 400 register failed - email null should return error
    test("400 - register failed because email is null", async () => {
        const response = await request(app).post("/users/register").send({
            name: "John Smith",
            username: "JohnSmith",
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
            username: "JohnSmith",
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
            username: "JohnSmith",
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

    // // failed - id not found
    // test("400 - success delete account with certain id", async () => {
    //     const response = (await request(app).delete("/users/1")).set("access_token", access_token)
    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty("message", "users successfully deleted");
    // })
})

describe("PUT /users/:id", () => {
    // success
    test("200 - success update user account with certain id", async () => {
        const response = await request(app).put("/users/1")
            .set("access_token", access_token)
            .send({
                name: "",
                gender: "",
                birthDate: "",
                email: "",
                phoneNumber: "",
                address: "",
                ktpId: "",
            })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "user data successfully edited");
    })

    // failed - unauthenticated
    test("401 Failed to update user account due to authentication problem", async () => {
        const response = await request(app).delete("/users/1")
            .set("access_token", null)
            .send({
                name: "",
                gender: "",
                birthDate: "",
                email: "",
                phoneNumber: "",
                address: "",
                ktpId: "",
            })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

describe("POST /users/event/:id", () => {
    const id = 1;
    // success add event
    test("201 - success add event to list event user", async () => {
        const response = await request(app).post(`/users/event/${id}`)
            .set("access_token", access_token)
            .send({
                EventId: id
            })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "event successfully added")
    })

    // failed add event due to unautheticated
    test("401 Failed to add event due to authentication problem", async () => {
        const id = 1;
        const response = await request(app).post(`/users/event/${id}`)
            .set("access_token", null)
            .send({
                EventId: id
            })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})










