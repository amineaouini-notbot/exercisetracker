const mongoose = require('mongoose')
const {Schema, model} = mongoose

const ExercisesModel = new Schema({
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date, default: Date.now}
})

module.exports = model('exercises', ExercisesModel)