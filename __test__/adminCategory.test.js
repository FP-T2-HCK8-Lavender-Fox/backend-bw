const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { Category, Admin, Checkpoint, Event, User } = require("../models");
const { signToken, verifToken, hashPassword } = require("../helpers/helper");
const { DECIMAL } = require("sequelize");
let access_token_admin;
let access_token_user;

beforeAll(async () => {
    try {

        await sequelize.queryInterface.bulkInsert(
            "Admins",
            require("../data/admins.json").map((el) => {
                el.createdAt = el.updatedAt = new Date();
                el.password = hashPassword(el.password);
                return el;
            })
        );

        await sequelize.queryInterface.bulkInsert(
            "Users",
            require("../data/users.json").map((el) => {
                el.createdAt = el.updatedAt = new Date();
                el.password = hashPassword(el.password);
                return el;
            })
        );

        await sequelize.queryInterface.bulkInsert(
            "Categories",
            require("../data/categories.json").map((el) => {
                el.createdAt = el.updatedAt = new Date();
                return el;
            })
        );

        await sequelize.queryInterface.bulkInsert(
            "Events",
            require("../data/events.json").map((el) => {
                el.createdAt = el.updatedAt = new Date();
                return el;
            })
        );

        await sequelize.queryInterface.bulkInsert(
            "Checkpoints",
            require("../data/checkpoints.json").map((el) => {
                el.createdAt = el.updatedAt = new Date();
                return el;
            })
        );

        await sequelize.queryInterface.bulkInsert(
            "Leaderboards",
            require("../data/leaderboards.json").map((el) => {
                el.createdAt = el.updatedAt = new Date();
                return el;
            })
        );

        await sequelize.queryInterface.bulkInsert(
            "User_Events",
            require("../data/user-event.json").map((el) => {
                el.createdAt = el.updatedAt = new Date();
                return el;
            })
        );
        access_token = signToken({ id: 1 });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await sequelize.queryInterface.bulkDelete("Admins", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        });

        await sequelize.queryInterface.bulkDelete("User_Events", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        });

        await sequelize.queryInterface.bulkDelete("Leaderboards", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        });

        await sequelize.queryInterface.bulkDelete("Users", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        });

        await sequelize.queryInterface.bulkDelete("Categories", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        });

        await sequelize.queryInterface.bulkDelete("Checkpoints", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        });

        await sequelize.queryInterface.bulkDelete("Events", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        });
    } catch (error) {
        console.log(error);
    }

});

// USERS
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
        access_token_user = response.body.access_token;
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
describe("POST /admin/login", () => {
    try {
        test("200 success to login", async () => {
            const response = await request(app).post("/admin/login").send({
                username: "JohnDoe",
                password: "securepassword123",
            })
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("access_token", expect.any(String));
            access_token_admin = response.body.access_token;
        })
    } catch (error) {
        console.log(error);
    }

    // 400 login failed - username null should return error
    test("400 login failed - username null should return error", async () => {
        const response = await request(app).post("/admin/login").send({
            password: "securepassword123",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "username is required!");
    })

    // 400 login failed - password null should return error
    test("400 login failed - password null should return error", async () => {
        const response = await request(app).post("/admin/login").send({
            username: "JohnDoe",
        })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "password is required!");
    })

    // 401 login failed - login with wrong username
    test("401 login failed - login with wrong username", async () => {
        const response = await request(app).post("/admin/login").send({
            username: "JohnSena",
            password: "securepassword123"
        })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "invalid username/password");
    })

    // 401 login failed - login with wrong password
    test("401 login failed - login with wrong password", async () => {
        const response = await request(app).post("/admin/login").send({
            username: "JohnDoe",
            password: "securepassword"
        })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "invalid username/password");
    })
})

// ADMINS
describe("GET /admin", () => {
    // success
    try {
        test("200 - success to get list of admins ", async () => {
            const response = await request(app).get("/admin").set("access_token", access_token_admin)

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("id", expect.any(Number));
            expect(response.body[0]).toHaveProperty("name", expect.any(String));
            expect(response.body[0]).toHaveProperty("username", expect.any(String));
            expect(response.body[0]).toHaveProperty("email", expect.any(String));
            expect(response.body[0]).toHaveProperty("password", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }

    // failed because access_token null
    test("401 Failed to get list of admins due to authentication problem", async () => {
        const response = await request(app)
            .get("/admin")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

// GET admin/:id
describe("GET /admin/:id", () => {
    try {
        test("200 - success to get users with certain id", async () => {
            const response = await request(app).get("/admin/1").set("access_token", access_token_admin)

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("id", expect.any(Number));
            expect(response.body).toHaveProperty("name", expect.any(String));
            expect(response.body).toHaveProperty("email", expect.any(String));
            expect(response.body).toHaveProperty("username", expect.any(String));
            expect(response.body).toHaveProperty("password", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }

    test("401 Failed to get list of users due to authentication problem", async () => {
        const response = await request(app)
            .get("/users/1")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})


// GET categories
describe("GET /categories", () => {
    // success
    try {
        test("200 - success to get list of categories ", async () => {
            const response = await request(app).get("/categories")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("id", expect.any(Number));
            expect(response.body[0]).toHaveProperty("name", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }
})

// GET categories/:id
describe("GET /categories/:id", () => {
    try {
        test("200 - success to get categories with certain id", async () => {
            const response = await request(app).get("/categories/1")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("id", expect.any(Number));
            expect(response.body).toHaveProperty("name", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }
})

// POST /categories/
describe("POST /categories/", () => {
    try {
        test("201 - success create category", async () => {
            const response = await request(app)
                .post("/categories")
                .set("access_token", access_token_admin)
                .send({
                    name: "category3"
                })

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "category3 successfully created");
        })
    } catch (error) {
        console.log(error);
    }

    // 400 adding category failed - name null should return error
    test("400 - adding category failed because name is null", async () => {
        const response = await request(app).post("/categories")
            .set("access_token", access_token_admin)
            .send({
                name: null
            })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    })
})

// DELETE categories by id
describe("DELETE /categories/:id", () => {
    // success
    try {
        test("200 - success delete category with certain id", async () => {
            const response = await request(app).delete("/categories/1").set("access_token", access_token_admin)
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "category successfully deleted");
        })
    } catch (error) {
        console.log(error);
    }
})

// PUT categories
describe("PUT /categories/:id", () => {
    // success
    test("200 - success update category with certain id", async () => {
        const response = await request(app).put("/categories/1")
            .set("access_token", access_token_admin)
            .send({
                name: "CATEGORY3",
            })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "category successfully edited");
    })

    // failed - unauthenticated
    test("401 Failed to update category due to authentication problem", async () => {
        const response = await request(app).delete("/categories/1")
            .set("access_token", null)
            .send({
                name: "CATEGORY3",
            })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})


// EVENTS
// GET events
describe("GET /events", () => {
    // success
    try {
        test("200 - success to get list of events ", async () => {
            const response = await request(app).get("/events")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("id", expect.any(Number));
            expect(response.body[0]).toHaveProperty("name", expect.any(String));
            expect(response.body[0]).toHaveProperty("startDate", expect.any(String));
            expect(response.body[0]).toHaveProperty("endDate", expect.any(String));
            expect(response.body[0]).toHaveProperty("active", expect.any(Boolean));
            expect(response.body[0]).toHaveProperty("description", expect.any(String));
            expect(response.body[0]).toHaveProperty("amount", expect.any(Number));
            expect(response.body[0]).toHaveProperty("address", expect.any(String));
            expect(response.body[0]).toHaveProperty("description", expect.any(String));
            expect(response.body[0]).toHaveProperty("lat", expect.any(String));
            expect(response.body[0]).toHaveProperty("long", expect.any(String));
            expect(response.body[0]).toHaveProperty("pics", expect.any(String));
            expect(response.body[0]).toHaveProperty("CategoryId", expect.any(Number));
            expect(response.body[0]).toHaveProperty("AdminId", expect.any(Number));
            expect(response.body[0].Admin).toHaveProperty("id", expect.any(Number));
            expect(response.body[0].Admin).toHaveProperty("username", expect.any(String));
            expect(response.body[0].Admin).toHaveProperty("name", expect.any(String));
            expect(response.body[0].Admin).toHaveProperty("email", expect.any(String));
            expect(response.body[0].Category).toHaveProperty("id", expect.any(Number));
            expect(response.body[0].Category).toHaveProperty("name", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }
})

describe("GET /events/:id", () => {
    // success
    try {
        test("200 - success to get event by Id ", async () => {
            const response = await request(app).get("/events/1")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("id", expect.any(Number));
            expect(response.body).toHaveProperty("name", expect.any(String));
            expect(response.body).toHaveProperty("startDate", expect.any(String));
            expect(response.body).toHaveProperty("endDate", expect.any(String));
            expect(response.body).toHaveProperty("active", expect.any(Boolean));
            expect(response.body).toHaveProperty("description", expect.any(String));
            expect(response.body).toHaveProperty("amount", expect.any(Number));
            expect(response.body).toHaveProperty("address", expect.any(String));
            expect(response.body).toHaveProperty("description", expect.any(String));
            expect(response.body).toHaveProperty("lat", expect.any(String));
            expect(response.body).toHaveProperty("long", expect.any(String));
            expect(response.body).toHaveProperty("pics", expect.any(String));
            expect(response.body).toHaveProperty("CategoryId", expect.any(Number));
            expect(response.body).toHaveProperty("AdminId", expect.any(Number));
            expect(response.body.Admin).toHaveProperty("id", expect.any(Number));
            expect(response.body.Admin).toHaveProperty("username", expect.any(String));
            expect(response.body.Admin).toHaveProperty("name", expect.any(String));
            expect(response.body.Admin).toHaveProperty("email", expect.any(String));
            expect(response.body.Category).toHaveProperty("id", expect.any(Number));
            expect(response.body.Category).toHaveProperty("name", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }
})

describe('POST /events', () => {
    try {
        test('should create a new event and return a success message', async () => {
            const response = await request(app)
                .post('/events')
                .set("access_token", access_token_admin)
                .send({
                    name: 'Test Event',
                    startDate: '2023-09-01',
                    endDate: '2023-09-03',
                    active: true,
                    description: 'This is a test event',
                    amount: 100,
                    address: '123 Test Street',
                    lat: 123.456,
                    long: -78.901,
                    CategoryId: 1,
                    pics: "https://ik.imagekit.io/f6nnqueth/1693193499012-TRADING_SOFTWARE_DEVELOPMENT_BANNER1_krTaC0fH.jpg",
                    checkpoints: '[{"name": "Checkpoint 1"}, {"name": "Checkpoint 2"}, {"name": "Checkpoint 3"}]',
                })

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('event and checkpoints successfully created');
        });
    } catch (error) {
        console.log(error);
    }


    // // failed because access_token null
    // test("401 Failed to post events due to authentication problem", async () => {
    //     const response = await request(app)
    //         .get("/categories")
    //         .set("access_token", null)

    //     expect(response.status).toBe(401);
    //     expect(response.body).toHaveProperty("message", "require a valid token!");
    // });
})


// CHECKPOINTS
describe("GET /checkpoints", () => {
    // success
    try {
        test("200 - success to get list of checkpoints ", async () => {
            const response = await request(app).get("/checkpoints")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("id", expect.any(Number));
            expect(response.body[0]).toHaveProperty("lat", expect.any(String));
            expect(response.body[0]).toHaveProperty("long", expect.any(String));
            expect(response.body[0]).toHaveProperty("question", expect.any(String));
            expect(response.body[0]).toHaveProperty("trueAnswer", expect.any(String));
            expect(response.body[0]).toHaveProperty("wrongAnswerOne", expect.any(String));
            expect(response.body[0]).toHaveProperty("wrongAnswerTwo", expect.any(String));
            expect(response.body[0]).toHaveProperty("name", expect.any(String));
            expect(response.body[0]).toHaveProperty("EventId", expect.any(Number));
        })
    } catch (error) {
        console.log(error);
    }
})

describe("GET /checkpoints/:EventId", () => {
    test("should respond with 200 and list of checkpoints", async () => {
        try {
            const eventId = 1;

            const response = await request(app).get(`/checkpoints/${eventId}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            const firstCheckpoint = response.body[0];
            expect(firstCheckpoint).toHaveProperty("id", expect.any(Number));
            expect(firstCheckpoint).toHaveProperty("lat", expect.any(String));
            expect(firstCheckpoint).toHaveProperty("long", expect.any(String));
            expect(firstCheckpoint).toHaveProperty("question", expect.any(String));
            expect(firstCheckpoint).toHaveProperty("trueAnswer", expect.any(String));
            expect(firstCheckpoint).toHaveProperty("wrongAnswerOne", expect.any(String));
            expect(firstCheckpoint).toHaveProperty("wrongAnswerTwo", expect.any(String));
            expect(firstCheckpoint).toHaveProperty("name", expect.any(String));
            expect(firstCheckpoint).toHaveProperty("EventId", expect.any(Number));
        } catch (error) {
            console.log(error);
        }
    });
});


// GET users
describe("GET /users", () => {
    // success
    try {
        test("200 - success to get list of users ", async () => {
            const response = await request(app).get("/users").set("access_token", access_token_admin)

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("id", expect.any(Number));
            expect(response.body[0]).toHaveProperty("name", expect.any(String));
            expect(response.body[0]).toHaveProperty("gender", expect.any(String));
            expect(response.body[0]).toHaveProperty("email", expect.any(String));
            expect(response.body[0]).toHaveProperty("password", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }


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
    try {
        test("200 - success to get users with certain id", async () => {
            const response = await request(app).get("/users/1").set("access_token", access_token_admin)

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("id", expect.any(Number));
            expect(response.body).toHaveProperty("name", expect.any(String));
            expect(response.body).toHaveProperty("email", expect.any(String));
            expect(response.body).toHaveProperty("password", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }

    test("401 Failed to get list of users due to authentication problem", async () => {
        const response = await request(app)
            .get("/users/1")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

// DELETE users
describe("DELETE /users/:id", () => {
    // success
    try {
        test("200 - success delete account with certain id", async () => {
            const response = await request(app).delete("/users/1").set("access_token", access_token_admin)
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "users successfully deleted");
        })
    } catch (error) {
        console.log(error);
    }

    // failed - unauthenticated
    test("401 Failed to get list of users due to authentication problem", async () => {
        const response = await request(app).delete("/users/1").set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });
})

describe("PUT /users/:id", () => {
    // success
    test("200 - success update user account with certain id", async () => {
        const response = await request(app).put("/users/1")
            .set("access_token", access_token_admin)
            .send({
                name: "John DOE",
                gender: "Male",
                email: "johndoe@example.com",
                birthDate: "2001-12-12",
                phoneNumber: "08123743839",
                address: "Jl. street",
                ktpId: "098792819281"
            })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "user data successfully edited");
    })

    // failed - unauthenticated
    test("401 Failed to update user account due to authentication problem", async () => {
        const response = await request(app).delete("/users/1")
            .set("access_token", null)
            .send({
                name: "John DOE",
                gender: "Male",
                email: "johndoe@example.com",
                password: "securepassword123"
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
            .set("access_token", access_token_admin)
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

// USER-EVENT
describe("GET /users-event", () => {
    test("200 - success to get list of users-event", async () => {
        try {
            const response = await request(app).get("/users-event");
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);

            // Check properties of the first user-event object in the response array
            const userEvent = response.body[0];
            expect(userEvent).toHaveProperty("id", expect.any(Number));

            const event = userEvent.Event;
            expect(event).toHaveProperty("id", expect.any(Number));
            expect(event).toHaveProperty("AdminId", expect.any(Number));
            expect(event).toHaveProperty("CategoryId", expect.any(Number));
            expect(event).toHaveProperty("active", true);
            expect(event).toHaveProperty("address", expect.any(String));
            expect(event).toHaveProperty("amount", expect.any(Number));
            expect(event).toHaveProperty("createdAt", expect.any(String));
            expect(event).toHaveProperty("description", expect.any(String));
            expect(event).toHaveProperty("endDate", expect.any(String));
            expect(event).toHaveProperty("lat", expect.any(String));
            expect(event).toHaveProperty("long", expect.any(String));
            expect(event).toHaveProperty("name", expect.any(String));
            expect(event).toHaveProperty("pics", expect.any(String));
            expect(event).toHaveProperty("startDate", expect.any(String));
            expect(event).toHaveProperty("updatedAt", expect.any(String));

            const user = userEvent.User;
            expect(user).toHaveProperty("id", expect.any(Number));
            expect(user).toHaveProperty("address", expect.any(String));
            expect(user).toHaveProperty("birthDate", null);
            expect(user).toHaveProperty("createdAt", expect.any(String));
            expect(user).toHaveProperty("email", expect.any(String));
            expect(user).toHaveProperty("gender", expect.any(String));
            expect(user).toHaveProperty("ktpId", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("phoneNumber", expect.any(String));
            expect(user).toHaveProperty("updatedAt", expect.any(String));

            expect(userEvent).toHaveProperty("point", expect.any(Number));
            expect(userEvent).toHaveProperty("createdAt", expect.any(String));
            expect(userEvent).toHaveProperty("updatedAt", expect.any(String));
        } catch (error) {
            console.error(error);
        }
    });
});

describe("GET /users-event/:id", () => {
    test("200 - success to get users-event by id", async () => {
        try {
            const response = await request(app).get("/users-event/1");
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.length).toBeGreaterThan(0);

            // Check properties of the first user-event object in the response array
            const userEvent = response.body;
            expect(userEvent).toHaveProperty("id", expect.any(Number));

            const event = userEvent.Event;
            expect(event).toHaveProperty("id", expect.any(Number));
            expect(event).toHaveProperty("AdminId", expect.any(Number));
            expect(event).toHaveProperty("CategoryId", expect.any(Number));
            expect(event).toHaveProperty("active", true);
            expect(event).toHaveProperty("address", expect.any(String));
            expect(event).toHaveProperty("amount", expect.any(Number));
            expect(event).toHaveProperty("createdAt", expect.any(String));
            expect(event).toHaveProperty("description", expect.any(String));
            expect(event).toHaveProperty("endDate", expect.any(String));
            expect(event).toHaveProperty("lat", expect.any(String));
            expect(event).toHaveProperty("long", expect.any(String));
            expect(event).toHaveProperty("name", expect.any(String));
            expect(event).toHaveProperty("pics", expect.any(String));
            expect(event).toHaveProperty("startDate", expect.any(String));
            expect(event).toHaveProperty("updatedAt", expect.any(String));

            const user = userEvent.User;
            expect(user).toHaveProperty("id", expect.any(Number));
            expect(user).toHaveProperty("address", expect.any(String));
            expect(user).toHaveProperty("birthDate", null);
            expect(user).toHaveProperty("createdAt", expect.any(String));
            expect(user).toHaveProperty("email", expect.any(String));
            expect(user).toHaveProperty("gender", expect.any(String));
            expect(user).toHaveProperty("ktpId", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("phoneNumber", expect.any(String));
            expect(user).toHaveProperty("updatedAt", expect.any(String));

            expect(userEvent).toHaveProperty("point", expect.any(Number));
            expect(userEvent).toHaveProperty("createdAt", expect.any(String));
            expect(userEvent).toHaveProperty("updatedAt", expect.any(String));
        } catch (error) {
            console.error(error);
        }
    });
});

// GET event by userId
// describe("GET /users-event/users/:id", () => {
//     test("200 - success to get users-event by userId", async () => {
//         try {
//             // Mock data
//             const userEventMock = {
//                 id: 1,
//                 Event: {
//                     id: 1,
//                     AdminId: 1,
//                     CategoryId: 1,
//                     active: true,
//                     address: "123 Test Street",
//                     amount: 100000,
//                     // ... other event properties
//                 },
//                 User: {
//                     id: 1,
//                     address: "123 Main St, City",
//                     birthDate: null,
//                     // ... other user properties
//                 },
//                 point: 10,
//                 createdAt: "2023-08-28T07:41:55.562Z",
//                 updatedAt: "2023-08-28T07:41:55.562Z",
//             };

//             User_Event.findOne.mockResolvedValue(userEventMock); // Mocking the database call

//             const response = await request(app).get("/users-event/users/1");

//             expect(response.status).toBe(200);
//             expect(response.body).toEqual(expect.any(Object)); // Response body should be an object

//             // Check properties of the user-event object in the response
//             const userEvent = response.body;
//             expect(userEvent).toHaveProperty("id", userEventMock.id);

//             const event = userEvent.Event;
//             expect(event).toHaveProperty("id", userEventMock.Event.id);
//             expect(event).toHaveProperty("AdminId", userEventMock.Event.AdminId);
//             expect(event).toHaveProperty("CategoryId", userEventMock.Event.CategoryId);
//             // ... similar checks for other event properties

//             const user = userEvent.User;
//             expect(user).toHaveProperty("id", userEventMock.User.id);
//             expect(user).toHaveProperty("address", userEventMock.User.address);
//             // ... similar checks for other user properties

//             expect(userEvent).toHaveProperty("point", userEventMock.point);
//             expect(userEvent).toHaveProperty("createdAt", userEventMock.createdAt);
//             expect(userEvent).toHaveProperty("updatedAt", userEventMock.updatedAt);
//         } catch (error) {
//             console.error(error);
//         }
//     });
// });

// DELETE Event
describe("DELETE /users-event/:id", () => {
    try {
        test("200 - success to delete event by user", async () => {
            const response = await request(app).delete("/users-event/1").set("access_token", access_token_admin)
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "event successfully deleted")
        })
    } catch (error) {
        console.log(error);
    }
})

// GET leaderboards
describe("GET /leaderboards", () => {
    // success
    try {
        test("200 - success to get list of leaderboards ", async () => {
            const response = await request(app).get("/leaderboards")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("id", expect.any(Number));
            expect(response.body[0]).toHaveProperty("EventId", expect.any(Number));
            expect(response.body[0]).toHaveProperty("UserId", expect.any(Number));
            expect(response.body[0]).toHaveProperty("position", expect.any(Number));
        })
    } catch (error) {
        console.log(error);
    }
})






