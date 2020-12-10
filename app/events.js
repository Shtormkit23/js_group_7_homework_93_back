const router = require("express").Router();
const Event = require("../models/Event");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
    const token = req.get('Authorization');
    const userToken = await User.findOne({token});
    const user = userToken._id;

    // const formatDate = (date) => {
    //     let dd = date.getDate();
    //     if (dd < 10) dd = '0' + dd;
    //
    //     let mm = date.getMonth() + 1;
    //     if (mm < 10) mm = '0' + mm;
    //
    //     let yy = date.getFullYear();
    //
    //     return yy + '-' + mm + '-' + dd;
    // }
    //
    // let newDate = new Date()
    // const currentDate = formatDate(newDate);

    try {
        const friendsIds = (await User.find({friends: { $all: [user] }}, '_id')).map(item => {
            return item._id
        })
        friendsIds.push(user)
        const events = await Event.find({user: {$in: friendsIds}}).populate('user');
        res.send(events);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/", auth, async (req, res) => {
    const eventData = req.body;
    const token = req.get('Authorization');
    const userToken = await User.findOne({token});

    eventData.user = userToken._id;

    const event = new Event(eventData);
    console.log(eventData)
    try {
        await event.save();
        res.send(event);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const event = await Event.find({_id: req.params.id})
        if (!event) {
            return res.status(422).send({message: 'Delete related fields first'});
        }
        await Event.findOneAndRemove({_id: req.params.id});
        return res.send({ message: `${req.params.id} removed` });
    } catch (e) {
        console.log(e)
        return res.status(422).send(e);
    }
});

module.exports = router;