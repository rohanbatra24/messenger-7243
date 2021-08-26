import React from "react";
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
          <>
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
          </>
        ) : (
          <>
            <OtherUserBubble
              key={message.id}
              text={message.text}
              time={time}
              otherUser={otherUser}
            />
          </>
        );
      })}
    </Box>
  );
};

export default Messages;
