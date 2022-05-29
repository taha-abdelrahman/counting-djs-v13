const mongoose = require("mongoose");
let Data = new mongoose.Schema({
guild: String,
channel: String,
author: String,
count: Number
});

module.exports = mongoose.model("counts-data", Data);