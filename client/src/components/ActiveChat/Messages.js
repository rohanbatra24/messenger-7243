import React, { Fragment } from "react";
import moment from "moment";
import { Box } from "@material-ui/core";

import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { BadgeAvatar } from "../Sidebar";

const Messages = (props) => {
  const { messages, otherUser, userId, lastMessageIdSeenByOtherUser } = props;

  const sortedMessagesByTimeAsc = messages.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <Box>
      {sortedMessagesByTimeAsc.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <Fragment>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {lastMessageIdSeenByOtherUser === message.id && (
              <BadgeAvatar
                photoUrl={otherUser.photoUrl}
                username={otherUser.username}
                online={otherUser.online}
                sidebar={true}
                alignRight={true}
              />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <OtherUserBubble
              key={message.id}
              text={message.text}
              time={time}
              otherUser={otherUser}
            />
            {lastMessageIdSeenByOtherUser === message.id && (
              <BadgeAvatar
                photoUrl={otherUser.photoUrl}
                username={otherUser.username}
                online={otherUser.online}
                sidebar={true}
                alignRight={true}
              />
            )}
          </Fragment>
        );
      })}
    </Box>
  );
};

export default Messages;
