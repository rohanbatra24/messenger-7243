import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

import { updateMessageReadStatus } from "../../store/utils/thunkCreators";
import { updateReadByMe } from "../../store/conversations";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const unreadMessagesStyles = {
  backgroundColor: "#3D91FF",
  color: "white",
  marginRight: "1rem",
  width: "1.3rem",
  textAlign: "center",
  borderRadius: "50%",
};

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, activeConversation } = props;
  const { otherUser } = conversation;

  const lastMessageSeen = conversation.id
    ? conversation.messages[conversation.messages.length - 1]
    : null;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);

    if (conversation.id) {
      props.updateMessageReadStatus(lastMessageSeen, conversation.id);
    }
  };

  if (
    activeConversation === conversation.otherUser.username &&
    conversation.unreadByMe !== 0
  ) {
    props.updateReadByMe(conversation.id);
  }

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {conversation.unreadByMe ? (
        <Box style={unreadMessagesStyles}>{conversation.unreadByMe}</Box>
      ) : (
        ""
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },

    updateMessageReadStatus: (lastMessageSeen, conversationId) => {
      dispatch(updateMessageReadStatus(lastMessageSeen, conversationId));
    },
    updateReadByMe: (conversationId) => {
      dispatch(updateReadByMe(conversationId));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    activeConversation: state.activeConversation,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
