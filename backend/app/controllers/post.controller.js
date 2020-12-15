const db = require("../models");
const Post = db.posts;

// Create and save a new Post
exports.create = (req, res) => {
    if (req.body.url == null || req.body.src == null) {
        res.status(400).send({message: "URL and/or src can not be empty!"});
        return;
    }

    // Create a Post
    const post = new Post({
        url: req.body.url,
        src: req.body.src,
        alt: req.body.alt,
    });

    // Save Post in the database
    post
        .save(post)
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
// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
    const srcQ = req.query.src;
    var condition = srcQ ? { src: {$regex: new RegExp(srcQ), $options: "i"}} : {};

    const sortQuery = req.query.sort ? req.query.sort : {};

    Post.find(condition).sort(sortQuery)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving officers."
            });
        });
};

// Find a single Post with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Post.findById(id)
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

// Update a Post by the id in the request
exports.update = (req, res) => {
    if(req.body == null) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Post.findByIdAndUpdate(id, req.body)
        .then(data => {
            if(data == null) {
                res.status(404).send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found!`
                });
            } else {
                res.send({message: "Post was updated successfully."})
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Post with id=" + id
            });
        });
};

// Delete an Post with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Post.findByIdAndRemove(id)
        .then(data => {
            if(data == null) {
                res.status(404).send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
                });
            } else {
                res.send({
                    message: "Post was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Pos with id=" + id
            })
        })
};

// Delete all Post from the database
exports.deleteAll = (req, res) => {
    Post.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Post were successfully deleted!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all posts."
            });
        });
}

