const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Participant = require("./participant");

// associations

User.belongsToMany(Conversation, {
  through: { model: Participant },
  foreignKey: "userId",
});

Conversation.belongsToMany(User, {
  through: { model: Participant },
  foreignKey: "conversationId",
});

Message.belongsTo(User, {
  foreignKey: "senderId",
});

Message.belongsTo(Conversation, {
  foreignKey: "senderId",
});

Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  Participant,
};
