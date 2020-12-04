module.exports = app => {
    const officers = require('../controllers/officer.controller.js');

    var router = require('express').Router();

    // Create a new Event
    router.post("/", officers.create);

    // Retrieve all Events
    router.get("/", officers.findAll);

    // Retieve a single Event with id
    router.get("/:id", officers.findOne);

    // Update a Event with id
    router.put("/:id", officers.update);

    // Delete a Event with id
    router.delete("/:id", officers.delete);

    app.use("/api/officers", router)
}