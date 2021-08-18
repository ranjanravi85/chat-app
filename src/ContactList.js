import { React } from 'react';
import { App } from './App.js';
import { CometChat } from "@cometchat-pro/chat";


const getLoggedInUser = (props) => {
	var user = CometChat.getLoggedinUser().then(
  user => {
    console.log("user details:", { user });
  },
  error => {
    console.log("error getting details:", { error });
  }
);
}

let usersRequest = new CometChat.UsersRequestBuilder().setLimit(30).build();
