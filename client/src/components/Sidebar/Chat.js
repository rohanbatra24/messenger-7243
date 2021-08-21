import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import socket from "../../socket";
import {
  updateConvoLastOpened,
  updateReadByMe,
} from "../../store/conversations";

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

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);

    if (conversation.id) {
      // Emit message to notify that all messages in this conversation are seen
      socket.emit("messages-seen", {
        conversationId: conversation.id,
      });

      // Update store with the time this convo was last opened
      props.updateConvoLastOpened(conversation);
      props.updateReadByMe(conversation.id);
    }
  };

  const lastMessage = conversation.id
    ? conversation.messages[conversation.messages.length - 1].id
    : null;

  useEffect(() => {
    if (activeConversation === conversation.otherUser.username) {
      props.updateReadByMe(conversation.id);
    }
  }, [activeConversation, lastMessage]);

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
        <span style={unreadMessagesStyles}>{conversation.unreadByMe}</span>
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
    updateConvoLastOpened: (conversation) => {
      dispatch(updateConvoLastOpened(conversation));
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
