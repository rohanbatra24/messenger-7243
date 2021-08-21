import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  updateConvoLastOpenedInStore,
  updateSeenByOtherUserInStore,
  updateReadByMeInStore,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const UPDATE_CONVO_LAST_OPENED = "UPDATE_CONVO_LAST_OPENED";
const UPDATE_SEEN_BY_OTHER_USER = "UPDATE_SEEN_BY_OTHER_USER";
const UPDATE_READ_BY_ME = "UPDATE_READ_BY_ME";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const updateConvoLastOpened = (conversation) => {
  return {
    type: UPDATE_CONVO_LAST_OPENED,
    payload: {
      conversation,
    },
  };
};

export const updateReadByMe = (conversationId) => {
  return {
    type: UPDATE_READ_BY_ME,
    payload: {
      conversationId,
    },
  };
};

export const updateSeenByOtherUser = (convoId) => {
  return {
    type: UPDATE_SEEN_BY_OTHER_USER,
    payload: {
      convoId,
    },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversations;
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case UPDATE_CONVO_LAST_OPENED:
      return updateConvoLastOpenedInStore(state, action.payload);
    case UPDATE_SEEN_BY_OTHER_USER:
      return updateSeenByOtherUserInStore(state, action.payload);
    case UPDATE_READ_BY_ME: {
      return updateReadByMeInStore(state, action.payload);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    default:
      return state;
  }
};

export default reducer;
