module.exports = mongoose => {
    const Event = mongoose.model(
        "event",
        mongoose.Schema(
            {
                title: {type: String, unique: true, trim: true, required: true},
                description: {type: String, required: true},
                date: {type: Date, min: new Date(1970, 1, 1)},
                flyerUrl: String,
            },
            {timestamps: true}
        )
    );
    return Event;
}