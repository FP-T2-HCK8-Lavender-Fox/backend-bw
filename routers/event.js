const express = require("express");
const eventController = require("../controllers/eventController");
const adminAuth = require("../middlewares/adminAuth");
const event = express.Router();

event
  .get("/events", eventController.getAllEvents)
  .get("/events/user", eventController.getAllEventsUser) //ini
  .get("/events/category/", eventController.getEventsByCategoryId)
  .get("/events/detail/:id", eventController.getEventByEventId)
  .get("/events/:id", eventController.getEventById)
  .post("/events", adminAuth, eventController.postEvent)
  .patch("/events/status/:id", adminAuth, eventController.patchEventStatus)
  .delete("/events/:id", adminAuth, eventController.deleteEvent)
  .put("/events/:id", adminAuth, eventController.editEvent);

module.exports = event;
