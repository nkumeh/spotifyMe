// users.js
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/validObjectId");


// POST User to create a new user

router.post("/", async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send({ message: error.details[0].message });

    const userToCreate = await User.findOne({ email: req.body.email });

    if (userToCreate)
        return res.status(403).send({ message: "User with given email already exists!!!" })

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let newUser = await new User({
       ...req.body,
       password: hashPassword
    }).save()

    newUser.password = undefined;
    newUser.__v = undefined;

    res.status(200).send({ data: newUser, message: "Account Created Successfully!" })
});

// GET User to get all Users routes 

router.get("/", admin, async (req, res) => {
    const usersToGet = await User.find().select("-password-__v");
    res.status(200).send({data: usersToGet});
});

// GET User by Id
router.get("/:id", [validObjectId, auth], async (req, res) => {
    const userToGet = await User.findById(req.params.id).select("-password-__v");
    res.status(200).send({data: userToGet});
});

// UPDATE user by Id
router.put("/:id", [validObjectId, auth], async (req, res) => {
    const userToUpdate = await User.findByIdAndUpdate(
        req.params.id, 
        {$set: req.body},
        {new:true})
        .select("-password-__v");
    res.status(200).send({data: userToUpdate});
});

// DELETE user by id
router.delete("/:id", [validObjectId, admin], async (req, res) => {
    const userToDelete = await User.findByIdAndDelete(
    res.status(200).send({data: userToDelete, message: "Successfully Deleted User"}));
});

module.exports = router;
// router.post("/", async(req, res) => {
//     const {error} = validate(req.body);

//     if (error) return res.status(400).send({message:error.details[0].message});

//     const user = await User.findOne({email:req.body.email});

//     if (user)
//         return res.status(403).send({message: "User with given email already exists!!!"})


//     const salt = await bcrypt.genSalt(Number(process.env.SALT));
//     const hashPassword = await bcrypt.hash(req.body.passwaord, salt);


//     let newUser = await new User({
//        ...req.body,
//        passwaord: hashPassword
//     }).save()

//     newUser.password = undefined;
//     newUser.__v = undefined;

//     res.status(200).send({data:newUser, message: "Account Created Successfully!"})

// })


// module.exports = router;
