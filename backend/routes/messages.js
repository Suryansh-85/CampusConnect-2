const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get messages between two users
router.get('/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Send a new message
router.post('/', async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        const newMessage = new Message({ sender, receiver, content });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;