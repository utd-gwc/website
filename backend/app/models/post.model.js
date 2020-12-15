module.exports = mongoose => {
    const Post = mongoose.model(
        "post",
        mongoose.Schema(
            {
                alt: {type: String, trim: true},
                url: {type: String, unique: true, required: true},
                src: {type: String, unique: true, required: true},
            },
            {timestamps: true}
        )
    );
    return Post;
}