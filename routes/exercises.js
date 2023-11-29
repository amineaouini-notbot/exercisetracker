const express = require('express')
const router = express.Router()
const Exercises = require('../models/exercisesModel')
const Users = require('../models/usersModel')

router.post('/:_id/exercises', async (req, res) => {
    let { _id } = req.params
    let {description, duration, date} = req.body;
    dateSetup = new Date(date)
    date =  dateSetup.toString() === 'Invalid Date' ?
        new Date().toDateString() :
        dateSetup.toDateString()
    
    try {
        let newExercise = new Exercises({description, duration, date: date})
        await newExercise.save()
        let user = await Users.findByIdAndUpdate(_id, {$push: newExercise._id})
        let { username } = user;
        let response = {
            _id, username, date: date, duration, description
        }
        res.json(response)
        
    } catch(err) { res.json(err)}
})  

router.get('/:_id/logs', (req, res) =>{
    let {_id} = req.params;
    Users.findOne({_id})
    .then(user => {
        let count = user.exercises.length
        let {username, exercises} = user;

        Exercises.find({_id: exercises}).select('description duration date')
        .then(logs =>{
            let response = {
                _id, username,count, logs 
            }
            res.json(response);
            
        })
        .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
})

module.exports = router;