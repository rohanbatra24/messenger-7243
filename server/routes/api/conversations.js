const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const Participant = require("../../db/models/participant");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        { model: User, where: { id: userId } },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      const convoParticipants = await Participant.findAll({
        attributes: ["userId"],
        where: { conversationId: convo.id },
      });

      // set a property "otherUsers" so that frontend will have easier access
      convoJSON.otherUsers = convoParticipants;

      // set property for online status of all other users
      convoJSON.otherUsers = convoJSON.otherUsers.map((user) => {
        if (onlineUsers.includes(user.userId)) {
          return { userId: user.userId, online: true };
        } else {
          return { userId: user.userId, online: false };
        }
      });

      //sort messages by oldest first
      const sortedMessagesByTimeAsc = convoJSON.messages.sort((a, b) => {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      convoJSON.messages = sortedMessagesByTimeAsc;

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
