module.exports = mongoose => {
    const Officer = mongoose.model(
        "officer",
        mongoose.Schema(
            {
                name: {type: String, unique: true, trim: true, required: true},
                position: {type: String, trim: true, required: true},
                bio: String,
                profilePhotoUrl: String,
                externalLinks: {type: Map, of: String},
            },
            {timestamps: true}
        )
    );
    return Officer;
}