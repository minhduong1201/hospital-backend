const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const http = require('http').Server(express);
const io = require('socket.io')(http);

// Lấy tất cả tin nhắn giữa bệnh viện và khách hàng
router.get('/', async (req, res) => {
  const { hospitalId, customerId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { hospitalId, customerId },
        { hospitalId: customerId, customerId: hospitalId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Gửi tin nhắn mới
router.post('/', async (req, res) => {
  const { hospitalId, customerId, sender, message } = req.body;

  try {
    const newMessage = new Message({
      hospitalId,
      customerId,
      sender,
      message,
    });

    // Lưu tin nhắn mới vào cơ sở dữ liệu
    await newMessage.save();

    // Gửi tin nhắn mới cho tất cả các client kết nối qua socket
    io.emit('message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
