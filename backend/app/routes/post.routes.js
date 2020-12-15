
module.exports = app => {
    const posts = require('../controllers/post.controller.js');

    var router = require('express').Router();

    // Create a new Event
    router.post("/", posts.create);

    // Retrieve all Events
    router.get("/", posts.findAll);

    // Retieve a single Event with id
    router.get("/:id", posts.findOne);

    // Update a Event with id
    router.put("/:id", posts.update);

    // Delete a Event with id
    router.delete("/:id", posts.delete);

    app.use("/api/posts", router)
}