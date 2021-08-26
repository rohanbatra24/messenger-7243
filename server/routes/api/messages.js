const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({
        senderId,
        text,
        conversationId,
        read: false,
      });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      read: false,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// expects {messageId,readStatus } in body
router.put("/readStatus", async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  // check if the user is a part of this conversation
  let conversation = await Conversation.findOne({
    where: {
      id: req.body.conversationId,
    },
  });

  if (
    conversation.user1Id !== req.user.id &&
    conversation.user2Id !== req.user.id
  ) {
    return res.sendStatus(401);
  }

  try {
    const { conversationId } = req.body;

    // update message read status
    const message = await Message.update(
      { read: true },
      {
        where: {
          conversationId: conversationId,
          [Op.not]: { senderId: req.user.id },
        },
      }
    );

    res.json(message);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
