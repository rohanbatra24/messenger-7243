export const addMessageToStore = (state, payload) => {
  const { message, recipient, sender, isNewConvo } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (isNewConvo) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      recipient,
      participants: [sender, recipient],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };

      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.recipient = recipient;
      convoCopy.participants = [sender, recipient];
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, sender, recipient, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipient.id) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.participants = [sender, recipient];
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};
