const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const {json, urlencoded} = require('body-parser')
const mongoose = require('mongoose')

const MY_DB = process.env.MY_DB
mongoose.connect('mongodb://127.0.0.1:27017/exercisetracker')
.then(()=>{ console.log('DB is connected!!')})
.catch(err=> {throw err})

app.use(cors())

// parse incoming data
app.use(json()) 
app.use(urlencoded({ extended: false }))

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const usersRouter = require('./routes/users')
const exercisesRouter = require('./routes/exercises')

app.use('/api/users', usersRouter)
app.use('/api/users', exercisesRouter)

const listener = app.listen(3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
