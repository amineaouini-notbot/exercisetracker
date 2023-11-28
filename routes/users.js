let express = require('express')
let router = express.Router();
let Users = require('../models/usersModel');


router.post('/', async (req, res)=>{
    let {username} = req.body;
    let newUser = new Users({username})
    try {
        await newUser.save()

    } catch(err){
        res.json(err)
    }
    res.json(newUser)
    
})

module.exports = router;