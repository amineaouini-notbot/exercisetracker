const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const usersSchema = new Schema({
    username: String,
    exercises: [mongoose.Schema.Types.ObjectId]
})

module.exports = model('users', usersSchema);