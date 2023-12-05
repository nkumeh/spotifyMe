const mongoose = require("mongoose");

module.export = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res
        .status(404)
        .send({message: "Invalid ID."});
    next();
};