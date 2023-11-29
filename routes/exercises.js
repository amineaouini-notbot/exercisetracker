const express = require('express')
const router = express.Router()
const Exercises = require('../models/exercisesModel')
const Users = require('../models/usersModel')

router.post('/:_id/exercises', async (req, res) => {
    let { _id } = req.params
    let {description, duration, date} = req.body;
    console.log(_id,req.body)
    date = new Date(date) || new Date()
    try {
        let newExercise = new Exercises({description, duration, date})
        await newExercise.save()
        let user = await Users.findByIdAndUpdate(_id, {$push: newExercise._id})
        let { username } = user;
        let response = {
            _id, username, date, duration, description
        }
        res.json(response)
        
    } catch(err) { res.json(err)}
})  

module.exports = router;