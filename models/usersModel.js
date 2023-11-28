const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const usersSchema = new Schema({
    username: String
})

module.exports = model('users', usersSchema);