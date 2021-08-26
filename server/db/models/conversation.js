const db = require("../db");
const Message = require("./message");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

const User = require("./user");

const Conversation = db.define("conversation", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// find conversations given two user Ids

Conversation.findConversations = async function (senderId, recipientId) {
  const conversation = await Conversation.findAll({
    attributes: ["id"],
    order: [[Message, "createdAt", "DESC"]],
    include: [
      { model: Message, order: ["createdAt", "DESC"] },
      { model: User, where: { id: [senderId, recipientId] } },
    ],
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
