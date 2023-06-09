const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts//
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    // Get a single thought by _id//
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select("-__v")
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: "No thought with that ID" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => res.json(thought))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete a thought//
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: "No thought with that ID" })
                    : User.deleteMany({ _id: { $in: thought.users } })
            )
            .then(() => res.json({ message: "Thought deleted!" }))
            .catch((err) => res.status(500).json(err));
    },
 
    //update a thought //
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: "No thought with this id!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // add a reaction //
    addReaction(req, res) {
        console.log("You are adding a reaction");
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: "No thought found with that ID" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    
    // remove a reaction //

    removeReaction(req, res) {
       
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            {
                $pull: {
                    reactions: { reactionId: req.params.reactionId },
                },
            },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: "No thought found with that ID" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};
