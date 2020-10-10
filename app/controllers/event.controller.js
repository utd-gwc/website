const db = require("../models");
const Event = db.events;

// Create and save a new Event
exports.create = (req, res) => {
    if (req.body.title == null || req.body.description == null) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    // Create an Event
    const event = new Event({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        flyerUrl: req.body.flyerUrl,
    });

    // Save Event in the database
    event
        .save(event)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ocurred while creating the event."
            });
        });
};

// Retrieve all Events from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: {$regex: new RegExp(title), $options: "i"}} : {};

    Event.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving events."
            });
        });
};

// Find a single Event with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Event.findById(id)
        .then(data => {
            if(data == null) {
                res.status(404).send({ message: "Not found Event with id " + id})
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({message: "Error retrieving Event with id=" + id});
        });
};

// Update a Event by the id in the request
exports.update = (req, res) => {
    if(req.body == null) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Event.findByIdAndUpdate(id, req.body)
        .then(data => {
            if(data == null) {
                res.status(404).send({
                    message: `Cannot update Event with id=${id}. Maybe Event was not found!`
                });
            } else {
                res.send({message: "Event was updated successfully."})
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Event with id=" + id
            });
        });
};

// Delete an Event with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Event.findByIdAndRemove(id)
        .then(data => {
            if(data == null) {
                res.status(404).send({
                    message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
                });
            } else {
                res.send({
                    message: "Event was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Event with id=" + id
            })
        })
};

// Delete all Events from the database
exports.deleteAll = (req, res) => {
    Event.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Events were successfully deleted!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all events."
            });
        });
}

