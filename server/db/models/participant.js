const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Participant = db.define("participant", {});

// find conversation given two user Ids

module.exports = Participant;
