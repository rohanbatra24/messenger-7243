import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateSeenByOtherUser,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });

  socket.on("messages-seen", (data) => {
    store.dispatch(updateSeenByOtherUser(data.conversationId));
  });
});

export default socket;
