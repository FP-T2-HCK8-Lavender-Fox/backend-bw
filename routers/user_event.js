const express = require("express");
const adminAuth = require("../middlewares/adminAuth");
const usersAuth = require("../middlewares/usersAuth");
const userEventController = require("../controllers/user_event");
const user_event = express.Router();

user_event
  .get("/users-event", userEventController.getAllEvents)
  .get(
    "/user-event/inactive",
    usersAuth,
    userEventController.getInactiveUserEventsByUserId
  )
  .get(
    "/users-event/category",
    usersAuth,
    userEventController.getUserEventsByCategoryId
  )
  .get(
    "/users-event/users/detail",
    usersAuth,
    userEventController.getUserEventsByUserId
  )
  .get("/users-event/event/:id", userEventController.getUserEventById)
  .get("/users-event/:id", usersAuth, userEventController.getEventByEventId)
  .post("/users-event/:event_id", usersAuth, userEventController.addEvent)
  .delete("/users-event/:id", adminAuth, userEventController.deleteEvent);

module.exports = user_event;
