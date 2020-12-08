const db = require("../models");
const Officer = db.officers;

// Create and save a new Officer
exports.create = (req, res) => {
    if (req.body.name == null || req.body.position == null) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    // Create an Officer
    const officer = new Officer({
        name: req.body.name,
        position: req.body.position,
        bio: req.body.bio,
        profilePhotoUrl: req.body.profilePhotoUrl,
        externalLinks: req.body.externalLinks,
    });

    // Save Officer in the database
    officer
        .save(officer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ocurred while creating an officer."
            });
        });

};
// Retrieve all Officers from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: {$regex: new RegExp(name), $options: "i"}} : {};

    Officer.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving officers."
            });
        });
};

// Find a single Officer with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Officer.findById(id)
        .then(data => {
            if(data == null) {
                res.status(404).send({ message: "Could not find Officer with id " + id})
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({message: "Error retrieving Officer with id=" + id});
        });
};

// Update a Officer by the id in the request
exports.update = (req, res) => {
    if(req.body == null) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Officer.findByIdAndUpdate(id, req.body)
        .then(data => {
            if(data == null) {
                res.status(404).send({
                    message: `Cannot update Officer with id=${id}. Maybe Officer was not found!`
                });
            } else {
                res.send({message: "Officer was updated successfully."})
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Officer with id=" + id
            });
        });
};

// Delete an Officer with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Officer.findByIdAndRemove(id)
        .then(data => {
            if(data == null) {
                res.status(404).send({
                    message: `Cannot delete Officer with id=${id}. Maybe Officer was not found!`
                });
            } else {
                res.send({
                    message: "Officer was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Officer with id=" + id
            })
        })
};

// Delete all Officers from the database
exports.deleteAll = (req, res) => {
    Officer.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Officer were successfully deleted!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all officers."
            });
        });
}

