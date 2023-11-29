const express = require('express')
const router = express.Router()
const Exercises = require('../models/exercisesModel')
const Users = require('../models/usersModel')

router.post('/:_id/exercises', async (req, res) => {
    let { _id } = req.params
    let {description, duration, date} = req.body;
    duration = Number(duration)
    dateSetup = new Date(date) 
    date =  dateSetup.toString() === 'Invalid Date' ?
    new Date().toDateString() :
    dateSetup.toDateString()
    console.log(date)
    
    try {
        let newExercise = new Exercises({description, duration, date})
        await newExercise.save()
        let user = await Users.findByIdAndUpdate(_id, {$push: {exercises: newExercise._id}})
        let { username } = user;
        
        let response = {
            _id, username, date, duration, description
        }
        res.json(response)
        
    } catch(err) { res.json(err)}
})  

router.get('/:_id/logs', (req, res) =>{
    let {_id} = req.params;
    Users.findOne({_id})
    .then(user => {
        let {username, exercises} = user;

        Exercises.find({_id: exercises}).select('-_id -__v').exec()
        .then(log =>{
            let response = {
                _id, username, count: log.length, log
            }
            res.json(response);
            
        })
        .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
})

module.exports = router;