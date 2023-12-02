// users.js

const router = require("express").Router();

const {User, validate} = require("../models/user");

const bcrypt = require("bcrypt");

router.post("/", async(req, res) => {
    const {error} = validate(req.body);


    if (error) return res.status(400).send({message:error.details[0].message});


    const user = await User.findOne({email:req.body.email});


    if (user)
        return res.status(403).send({message: "User with given email already exists!!!"})


    const salt = await bcrypt.genSalt(Number(proceq.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.passwaord, salt);


    let newUser = await new User({
       ...req.body,
       passwaord: hashPassword
    }).save()

    newUser.password = undefined;
    newUser.__v = undefined;

    res.status(200).send({data:newUser, message: "Account Created Successfully!"})

})


module.exports = router;