const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");


router.get("/", auth, async (req, res) => {
    const token = req.get('Authorization');
    const userToken = await User.findOne({token});
    const user = userToken._id;
    try {
        const friends = await User.find(user).populate("friends");
        res.send(friends);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/all", auth, async (req, res) => {
    try {
        const friends = await User.find();
        res.send(friends);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/", auth, async (req, res) => {
    const token = req.get('Authorization');
    const currentUser = await User.findOne({token});

    const eventData = req.body;
    const email = eventData.email;
    const user = await User.findOne({_id: email});

    if(!currentUser.friends.includes(user._id)) {
        await User.findByIdAndUpdate(
            currentUser._id,
            { $push: { friends: user._id } },
            { new: true, useFindAndModify: false }
        );
    }

    try {
        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.delete("/:id", auth, async (req, res) => {
    const token = req.get('Authorization');
    const currentUser = await User.findOne({token});

    const id = req.params.id;
    const user = await User.findOne({_id: id});

    if(currentUser.friends.includes(user._id)) {
        await User.findByIdAndUpdate(
            currentUser._id,
            { $pull: { friends: user._id } },
            { new: true, useFindAndModify: false }
        );
    }
    try {
        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;