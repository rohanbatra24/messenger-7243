import React from "react";
import { Box, Badge, Avatar } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  profilePic: {
    height: 44,
    width: 44,
    marginTop: "1rem",
  },
  badge: {
    height: 13,
    width: 13,
    borderRadius: "50%",
    border: "2px solid white",
    backgroundColor: "#D0DAE9",
  },
  online: {
    backgroundColor: "#1CED84",
  },
  sidebar: {
    marginLeft: 17,
  },
  sidebarAlignRight: {
    marginLeft: "85%",
  },
}));

const UserAvatar = (props) => {
  const classes = useStyles();
  const { sidebar, username, photoUrl, online, alignRight } = props;

  return (
    <Box
      className={`${sidebar ? classes.sidebar : ""} ${
        alignRight && classes.sidebarAlignRight
      }`}
    >
      <Badge
        classes={{ badge: `${classes.badge} ${online && classes.online}` }}
        variant="dot"
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        overlap="circular"
      >
        <Avatar
          alt={username}
          src={photoUrl}
          className={classes.profilePic}
        ></Avatar>
      </Badge>
    </Box>
  );
};

export default UserAvatar;
