const express = require("express");
const usersAuth = require("../middlewares/usersAuth");
const friendshipController = require("../controllers/friendship");
const friendship = express.Router();

friendship
  .get("/friends/", usersAuth, friendshipController.getFriendLists)
  .get(
    "/friends/request",
    usersAuth,
    friendshipController.getFriendsToAcceptLists
  )
  .get("/friends/pending", usersAuth, friendshipController.pendingFriendships)
  .delete(
    "/friends/decline/:id",
    usersAuth,
    friendshipController.ignoreOrDeclineFriend
  )
  .post("/friends/:id", usersAuth, friendshipController.addFriend)
  .patch("/friends/:id", usersAuth, friendshipController.acceptFriend);

module.exports = friendship;
