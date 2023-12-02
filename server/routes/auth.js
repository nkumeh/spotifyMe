const router = require("express").Router();

const { User } = require("../models/user");

// auth.js

const bcrypt = require("bcrypt");

// using POST for authentication

router.post("/", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    // validate user
    if (!user)
        return res.status(400).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.hash(req.body.passwaord, user.password);

    // validate password
    if (!validPassword)
        return res.status(400).send({ message: "Invalid Email or Password" });

    const token = user.generateAuthToekn();

    res.status(200).send({ data: token, message: "Signing in Please wait!" });
});

module.exports = router;