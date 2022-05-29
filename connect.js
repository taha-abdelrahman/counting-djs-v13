const mongoose = require("mongoose")
module.exports = async (client) => {
    mongoose.connect(process.env.MongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false
    }).then(() => {
    console.log("(!) Mongoose is has been successfully connected.");
    }).catch(a => console.log("(!) Mongoose has failed to connect successfully."));
}