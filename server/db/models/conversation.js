const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// find conversation given an array of user Ids

Conversation.findConversations = async function (userIdsArray) {
  const conversation = await Conversation.findAll({
    attributes: ["id"],
    order: [[Message, "createdAt", "DESC"]],
    include: [
      { model: Message, order: ["createdAt", "DESC"] },
      { model: User, where: { id: userIdsArray } },
    ],
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
