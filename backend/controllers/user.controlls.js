const userModel = require('../models/complaint');

async function userDetails(req, res) {
    try {
        //const { id } = req.params.id
        const user = await userModel.findById(req.body.id)
        if (user) {
            const { password, ...info } = user._doc;
            res.status(200).json(info);
        }
        else {
            res.json({ message: `No User wuth id ${id}` })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

async function addComplaint(req, res) {
    try {
        const user = await userModel.create(req.body)
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
    }
}

async function updateComplaint(req, res) {
    if (req.user.id === req.body.id || req.user.isAdmin) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                req.body.id,
                {
                    $set: req.body
                },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only update your own account!");
    }
};

async function deleteComplaint(req, res) {
    if (req.user.id === req.body.id || req.user.isAdmin) {
        try {
            const deleteUser = await userModel.findByIdAndDelete(req.body.id)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can only delete complaints on your account!");
    }
    const user = await userModel.find({})
    res.status(200).json(user);
}

module.exports = {userDetails, updateComplaint, addComplaint, deleteComplaint}