const { User, Thought } = require('../models');

module.exports = {

    // get all users //

    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                return res.json(users);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
 // get a single user by their id//

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select("-__v")
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: "User ID did not match!" })
                    : res.json({
                          user,
                      })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
// create a new user //

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
// update a user // 

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No user found with that id!" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
// delete a user and their name from thought section //

    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "User is no longer available!" })
                    : Thought.findOneAndUpdate(
                          { users: req.params.userId },
                          { $pull: { users: req.params.userId } },
                          { new: true }
                      )
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                          message: "User deleted, but no thoughts found",
                      })
                    : res.json({ message: "User successfully deleted" })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // add a friend //

    addFriend(req, res) {
        console.log("Friend is now added!");
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                          .status(404)
                          .json({ message: "No user found with that ID" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
 // remove friend //
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            {
                $pull: {
                    friends: req.params.friendId,
                },
            },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                          .status(404)
                          .json({ message: "No user found with that ID" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};