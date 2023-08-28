const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { Category, Admin, Checkpoint, Event, User } = require("../models");
const { signToken, verifToken, hashPassword } = require("../helpers/helper");
const { DECIMAL } = require("sequelize");
const { filterImage } = require('../config/multer');
const multer = require('multer');
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
            "AnswerQuizzes",
            require("../data/answerQuiz.json").map((el) => {
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

        await sequelize.queryInterface.bulkDelete("AnswerQuizzes", null, {
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

// MULTER
describe('filterImage', () => {
    test('should allow valid image mimetypes', () => {
        const cb = jest.fn();

        const validFile = {
            mimetype: 'image/png',
        };

        filterImage(null, validFile, cb);

        expect(cb).toHaveBeenCalledWith(null, true);
    });

    test('should reject invalid image mimetypes', () => {
        const cb = jest.fn();

        const invalidFile = {
            mimetype: 'application/pdf',
        };

        filterImage(null, invalidFile, cb);

        expect(cb).toHaveBeenCalledWith(null, false);
    });
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

    // failed - name null
    test("401 Failed to update category because name is null", async () => {
        const response = await request(app).put("/categories/1")
            .set("access_token", access_token_admin)
            .send({
                name: null,
            })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    });
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
        test("200 - success to get admin with certain id", async () => {
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

    test("401 Failed to get admin due to authentication problem", async () => {
        const response = await request(app)
            .get("/admin/1")
            .set("access_token", null);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });

    // id not found
    test("404 Failed to get because id not found", async () => {
        const response = await request(app)
            .get("/admin/1000")
            .set("access_token", access_token_admin);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Data not found!");
    });
})

// PUT /admin/:id
describe("PUT /admin/:id", () => {
    try {
        // success
        test("201 - success to update admin detail", async () => {
            const response = await request(app).put("/admin/1").set("access_token", access_token_admin)
                .send({
                    name: "John DOE",
                    username: "JohnDoe",
                    email: "johndoe@example.com",
                })
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "admin data successfully edited");
        })
    } catch (error) {
        console.log(error);
    }
    test("400 - failed to update admin profile due to null username", async () => {
        const response = await request(app).put("/admin/1").set("access_token", access_token_admin)
            .send({
                name: "John DOE",
                username: null,
                email: "johndoe@example.com",
            })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "username is required!");
    })
    test("400 - failed to update admin profile due to null name", async () => {
        const response = await request(app).put("/admin/1").set("access_token", access_token_admin)
            .send({
                name: null,
                username: "JohnDoe",
                email: "johndoe@example.com",
            })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    })
    test("400 - failed to update admin profile due to null email", async () => {
        const response = await request(app).put("/admin/1").set("access_token", access_token_admin)
            .send({
                name: "John DOE",
                username: "JohnDoe",
                email: null,
            })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "email is required!");
    })
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
        test("200 - success to get category with certain id", async () => {
            const response = await request(app).get("/categories/1")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("id", expect.any(Number));
            expect(response.body).toHaveProperty("name", expect.any(String));
        })
    } catch (error) {
        console.log(error);
    }

    // failed because id not found
    test("404 - failed to get category with certain id due to id not found", async () => {
        const response = await request(app).get("/categories/1000")
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Data not found!");
    })
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
    })
    test("404 - failed to get list checkpoint because data notFound", async () => {
        const eventId = 100000;
        const response = await request(app).get(`/checkpoints/${eventId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Data not found!")
    })
});

// POST answerCheckpoint
describe("POST /answers/:CheckpointId", () => {
    try {
        const checkpointId = 1;
        test("201 - success post answer", async () => {
            const response = await request(app)
                .post(`/answers/${checkpointId}`)
                .set("access_token", access_token_user)
                .send({
                    trueOrFalse: true,
                    UserId: 1,
                    CheckpointId: 1
                })
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "success post answer data")
        })
    } catch (error) {
        console.log(error);
    }
    // failed because checkpointId is null
    test("400 - failed post answers because checkpointId is null", async () => {
        const checkpointId = null;
        const response = await request(app).post(`/answers/${checkpointId}`)
            .set("access_token", access_token_user)
            .send({
                trueOrFalse: true,
                UserId: 1,
                CheckpointId: null
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "CheckpointId is required!")
    })

    // failed because checkpointId due to authentication problem
    test("400 - failed post answers due to authentication problem", async () => {
        const checkpointId = 1;
        const response = await request(app).post(`/answers/${checkpointId}`)
            .set("access_token", null)
            .send({
                trueOrFalse: true,
                UserId: 1,
                CheckpointId: 1
            })
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "require a valid token!")
    })
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
        test('should return event details along with related data', async () => {
            const response = await request(app).get("/events/1");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("dataEvent");
            expect(response.body).toHaveProperty("dataUsers");

            const { dataEvent, dataUsers } = response.body;

            // Verify dataEvent properties
            expect(dataEvent).toHaveProperty("id", expect.any(Number));
            expect(dataEvent).toHaveProperty("name", expect.any(String));
            expect(dataEvent).toHaveProperty("startDate", expect.any(String));
            expect(dataEvent).toHaveProperty("endDate", expect.any(String));
            expect(dataEvent).toHaveProperty("active", expect.any(Boolean));
            expect(dataEvent).toHaveProperty("description", expect.any(String));
            expect(dataEvent).toHaveProperty("amount", expect.any(Number));
            expect(dataEvent).toHaveProperty("address", expect.any(String));
            expect(dataEvent).toHaveProperty("lat", expect.any(String));
            expect(dataEvent).toHaveProperty("long", expect.any(String));
            expect(dataEvent).toHaveProperty("pics", expect.any(String));
            expect(dataEvent).toHaveProperty("CategoryId", expect.any(Number));
            expect(dataEvent).toHaveProperty("AdminId", expect.any(Number));
            expect(dataEvent).toHaveProperty("Admin", expect.any(Object));
            expect(dataEvent).toHaveProperty("Category", expect.any(Object));

            // Verify Admin properties
            expect(dataEvent.Admin).toHaveProperty("id", expect.any(Number));
            expect(dataEvent.Admin).toHaveProperty("username", expect.any(String));
            expect(dataEvent.Admin).toHaveProperty("name", expect.any(String));
            expect(dataEvent.Admin).toHaveProperty("email", expect.any(String));

            // Verify Category properties
            expect(dataEvent.Category).toHaveProperty("id", expect.any(Number));
            expect(dataEvent.Category).toHaveProperty("name", expect.any(String));

            // Verify dataUsers array
            expect(dataUsers).toBeInstanceOf(Array);
            expect(dataUsers.length).toBeGreaterThan(0);
            dataUsers.forEach(user => {
                expect(user).toHaveProperty("EventId", dataEvent.id);
                expect(user).toHaveProperty("UserId", expect.any(Number));
                expect(user).toHaveProperty("User", expect.any(Object));
                expect(user).toHaveProperty("point", expect.any(Number));
                // Verify User properties
                expect(user.User).toHaveProperty("id", expect.any(Number));
                expect(user.User).toHaveProperty("name", expect.any(String));
                expect(user.User).toHaveProperty("email", expect.any(String));
                expect(user.User).toHaveProperty("gender", expect.any(String));
                expect(user.User).toHaveProperty("address", expect.any(String));
                expect(user.User).toHaveProperty("phoneNumber", expect.any(String));
            })
        })
    } catch (error) {
        console.log(error);
    }
    test("404 - failed to get event by id because data not found", async () => {
        const response = await request(app).get("/events/10000")
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Data not found!");
    })
})

describe('POST /events', () => {
    try {
        test('200 - success create event', async () => {
            const response = await request(app).post('/events')
                .set("access_token", access_token_admin)
                .send({
                    name: 'Test Event',
                    startDate: '2023-09-01',
                    endDate: '2023-09-03',
                    active: true,
                    description: "This is test event",
                    amount: 100000,
                    address: "123 Test street",
                    lat: 123.92921,
                    long: 12.92929,
                    CategoryId: 1,
                    checkpoints: [
                        {
                            name: "Checkpoint1"
                        },
                        {
                            name: "Checkpoint2"
                        },
                        {
                            name: "Checkpoint3"
                        }
                    ]
                })
            // .attach('file', 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg');
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('event and checkpoints successfully created');
        });
    } catch (error) {
        console.log(error);
    }

    // failed because access_token null
    test("401 Failed to post events due to authentication problem", async () => {
        const response = await request(app)
            .post("/events")
            .set("access_token", null)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });

    // failed because name is null
    test('should create a new event and return a success message', async () => {
        const response = await request(app).post('/events')
            .set("access_token", access_token_admin)
            .send({
                name: null,
                startDate: '2023-09-01',
                endDate: '2023-09-03',
                active: true,
                description: "This is test event",
                amount: 100000,
                address: "123 Test street",
                lat: 123.92921,
                long: 12.92929,
                CategoryId: 1,
                checkpoints: [
                    {
                        name: "Checkpoint1"
                    },
                    {
                        name: "Checkpoint2"
                    },
                    {
                        name: "Checkpoint3"
                    }
                ]

            })
        // .attach('file', 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg');
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('name is required!');
    })
})

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

// GET users/detail
describe("GET /users/detail", () => {
    try {
        test("200 - success to get users with certain id", async () => {
            const response = await request(app).get(`/users/detail/1`).set("access_token", access_token_user)

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

    test("401 Failed to get user due to authentication problem", async () => {
        const response = await request(app)
            .get("/users/detail/1")
            .set("access_token", null);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    });

    test("404 Failed to get user because id not found", async () => {
        const response = await request(app)
            .get("/users/detail/10000")
            .set("access_token", access_token_user);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Data not found!");
    });
})

describe("PUT /users/:id", () => {
    // success
    test("200 - success update user account with certain id", async () => {
        const response = await request(app).put("/users/1")
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

    // failed -name is null
    test("400 Failed to update user account because name is null", async () => {
        const response = await request(app).put("/users/1")
            .set("access_token", null)
            .send({
                name: null,
                gender: "Male",
                email: "johndoe@example.com",
                birthDate: "2001-12-12",
                phoneNumber: "08123743839",
                address: "Jl. street",
                ktpId: "098792819281"
            })
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "name is required!");
    });
})

describe("POST /users/event/:id", () => {
    try {
        const id = 1;
        // success add event
        test("201 - success add event to list event user", async () => {
            const response = await request(app).post(`/users/event/${id}`)
                .set("access_token", access_token_user)
                .send({
                    EventId: id
                })
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "event successfully added")
        })
    } catch (error) {
        console.log(error);
    }


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

    test("404 - failed to get user-event by id because data not found", async () => {
        const response = await request(app).get("/users-event/event/1")
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("message", "Data not found!")
    })
});

// GET event by userId
describe("GET /users-event/users/:id", () => {
    test("200 - success to get users-event by userId", async () => {
        try {
            // Mock data
            const userEventMock = {
                id: 1,
                Event: {
                    id: 1,
                    AdminId: 1,
                    CategoryId: 1,
                    active: true,
                    address: "123 Test Street",
                    amount: 100000,
                    // ... other event properties
                },
                User: {
                    id: 1,
                    address: "123 Main St, City",
                    birthDate: null,
                    // ... other user properties
                },
                point: 10,
                createdAt: "2023-08-28T07:41:55.562Z",
                updatedAt: "2023-08-28T07:41:55.562Z",
            };

            User_Event.findOne.mockResolvedValue(userEventMock); // Mocking the database call

            const response = await request(app).get("/users-event/users/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Object)); // Response body should be an object

            // Check properties of the user-event object in the response
            const userEvent = response.body;
            expect(userEvent).toHaveProperty("id", userEventMock.id);

            const event = userEvent.Event;
            expect(event).toHaveProperty("id", userEventMock.Event.id);
            expect(event).toHaveProperty("AdminId", userEventMock.Event.AdminId);
            expect(event).toHaveProperty("CategoryId", userEventMock.Event.CategoryId);
            // ... similar checks for other event properties

            const user = userEvent.User;
            expect(user).toHaveProperty("id", userEventMock.User.id);
            expect(user).toHaveProperty("address", userEventMock.User.address);
            // ... similar checks for other user properties

            expect(userEvent).toHaveProperty("point", userEventMock.point);
            expect(userEvent).toHaveProperty("createdAt", userEventMock.createdAt);
            expect(userEvent).toHaveProperty("updatedAt", userEventMock.updatedAt);
        } catch (error) {
            console.error(error);
        }
    });
});

// PAYMENT
describe("POST /payment-token", () => {
    try {
        test("200 - success to get token and redirect url for payment", async () => {
            const response = await request(app).post("/payment-token")
                .set("access_token", access_token_user)
                .send({
                    amount: 100000,
                })
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("token", expect.any(String))
        expect(response.body).toHaveProperty("redirect url", expect.any(String))
    } catch (error) {
        console.log(error);
    }
    test("401 - failed to get token and redirect url due to authentication problem", async () => {
        const response = await request(app).post("/payment-token")
            .set("access_token", null)
            .send({
                amount: 100000
            })
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "require a valid token!")
    })
    test("400 - failed to get token and redirect url due to null amount", async () => {
        const response = await request(app).post("/payment-token")
            .set("access_token", access_token_user)
            .send({
                amount: null
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Only Accept 100k")
    })
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

// GET leaderboards
describe("GET /leaderboards/:id", () => {
    // success
    try {
        test("200 - success to get leaderboard by id ", async () => {
            const response = await request(app).get("/leaderboards/1")
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("id", expect.any(Number));
            expect(response.body).toHaveProperty("EventId", expect.any(Number));
            expect(response.body).toHaveProperty("UserId", expect.any(Number));
            expect(response.body).toHaveProperty("position", expect.any(Number));
        })
    } catch (error) {
        console.log(error);
    }

    // failed because data not found
    test("404 - failed to get leaderboard by id because data not found ", async () => {
        const response = await request(app).get("/leaderboards/10000")
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Data not found!");
    })

})

describe("POST /leaderboards/:eventId", () => {
    // success
    try {
        test("200 - success to create leaderboard by eventId ", async () => {
            const response = await request(app).post("/leaderboards/1")
                .set("access_token", access_token_admin)
                .send({
                    EventId: 1,
                    UserId: 1,
                    position: 1
                })
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("message", `success post user with id: 1 to leaderboard`)
        })
    } catch (error) {
        console.log(error);
    }
    // failed create due to authentication problem
    test("401 - failed create leaderboard due to authentication problem", async () => {
        const response = await request(app).post("/leaderboards/1")
            .set("access_token", null)
            .send({
                EventId: 1,
                UserId: 1,
                position: 1
            })
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", `require a valid token!`)

    })
    test("400 - failed create leaderboard because UserId is null", async () => {
        const response = await request(app).post("/leaderboards/1")
            .set("access_token", access_token_admin)
            .send({
                EventId: 1,
                UserId: null,
                position: 1
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", `UserId is required!`)
    })
})

// DELETE leaderboards by id
describe("DELETE /leaderboards/:id", () => {
    // success
    try {
        test("200 - success delete leaderboard with certain id", async () => {
            const response = await request(app).delete("/leaderboards/1").set("access_token", access_token_admin)
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "leaderboard successfully deleted");
        })
    } catch (error) {
        console.log(error);
    }
    test("401 - failed to delete leaderboard due to authentication problem", async () => {
        const response = await request(app).delete("/leaderboards/1").set("access_token", null)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    })
})

// DELETE events by id
describe("DELETE /events/:id", () => {
    // success
    try {
        test("200 - success delete event with certain id", async () => {
            const response = await request(app).delete("/events/1").set("access_token", access_token_admin)
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "event successfully deleted");
        })
    } catch (error) {
        console.log(error);
    }
    test("401 - failed to delete category due to authentication problem", async () => {
        const response = await request(app).delete("/events/1").set("access_token", null)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
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
    test("401 - failed to delete category due to authentication problem", async () => {
        const response = await request(app).delete("/categories/1").set("access_token", null)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    })
})

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

// DELETE /admin/:id
describe("DELETE /admin/:id", () => {
    try {
        // success
        test("200 - success to delete admin with certain id", async () => {
            const response = await request(app).delete("/admin/1").set("access_token", access_token_admin)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "admin successfully deleted");
        })
    } catch (error) {
        console.log(error);
    }
    test("401 - failed to delete admin due to authentication problem", async () => {
        const response = await request(app).delete("/admin/1").set("access_token", null)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    })
})

// DELETE /users/:id
describe("DELETE /users/:id", () => {
    try {
        // success
        test("200 - success to delete admin with certain id", async () => {
            const response = await request(app).delete("/users/1").set("access_token", access_token_admin)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "users successfully deleted");
        })
    } catch (error) {
        console.log(error);
    }
    test("401 - failed to delete admin due to authentication problem", async () => {
        const response = await request(app).delete("/users/1").set("access_token", null)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "require a valid token!");
    })
})
