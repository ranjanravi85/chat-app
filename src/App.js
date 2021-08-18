import { useState, useEffect } from 'react';
import { CometChat } from "@cometchat-pro/chat";

// import logo from './logo.svg';
import './App.css';
import { COMETCHAT_CONSTANTS } from './consts.js';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageBox, setMessageBox] = useState(false);


  const [userName, setUserName] = useState('superhero1')
  const [currentUser, setCurrentUser] = useState('')
  const [userList, setUserList] = useState([])
  const [messageText, setMessageText] = useState('');


  const [mesageList, setMessageList] = useState([])


  const login = (evt) => {
    evt.preventDefault();
    let uid = userName;
    let authKey = COMETCHAT_CONSTANTS.AUTH_KEY;

    CometChat.login(uid, authKey)
      .then((user) => {
        console.log('login user', user);
        setIsLoggedIn(user);
        userListData();
      })
      .catch((error) => {
        console.log('CometChatLogin Failed', error);
      });

  }

  const userListData = () => {

    let usersRequest = new CometChat.UsersRequestBuilder().setLimit(30).build();

    usersRequest.fetchNext().then((res) => {
        console.log('userList', res);
        setUserList(res)
      })
      .catch((error) => {
        console.log('User list fetching failed with error:', error)
      })
      // console.log(usersRequest);
  }

  const message = (user) => {
    console.log('message box', user);
    setMessageBox(true);
    setCurrentUser(user);




    const listenerID = "UNIQUE_LISTENER_ID";

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          console.log("Text message received successfully", textMessage);
          // Handle text message
         setMessageList(prevtextMessage => [...prevtextMessage, textMessage]);
        },
      })
    );
  }

  const messageSubmit = (event, message) => {
    event.preventDefault();

    console.log('submit message', currentUser);

    const receiverID = currentUser.uid;
    // const messageText = "Hello world!";
    const receiverType = CometChat.RECEIVER_TYPE.USER;
    const textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    );

    CometChat.sendMessage(textMessage).then(
      textMessage => {
        console.log("msg sent successfully:", textMessage);
      },
      error => {
        console.log("Message sending failed with error:", error);
      }
    );


  }

  useEffect(() => {
    console.log("NEW MESSAGE =>", mesageList);
  }, [mesageList]);


  return (
    <div className='App'>
      {/* login */}
      {!isLoggedIn && (
        <div className='login-container'>
          <h3>Login</h3>
          <form className='login-form' onSubmit={login}>
            <div className='form-group'>
              <div className='input-icon'>
                <input
                  type='text'
                  className='form-control'
                  name='user name'
                  placeholder='Enter User Name'
                  value={userName} onInput={e => setUserName(e.target.value)}
                />
              </div>
            </div>
            <button type='submit' className='btn btn-common log-btn mt-3'>
              Submit
            </button>
          </form>
        </div>)
      }


      {/* contact list */}
      {isLoggedIn && (
        <div className="user-list-container">
          <h3>Contact List</h3>



          {userList.length && userList.map((user, index) => (


            <div key={index}  style={{display: "flex", padding: "5px", position: "relative", borderBottom: "2px black solid"}} onClick={() => message(user)}>
                <div style={{width: "50px"}}>
                <img  style={{maxWidth: "100%"}} src={user.avatar} alt='jobs' />
              </div>
              <p>{user.name}</p>
            </div>
          ))}






        </div>)
      }






      {/* message list start here */}
      {isLoggedIn && <h3>Message List</h3>}
      {messageBox && mesageList.length && mesageList.map((msg, index) => (



      <div key={index}  style={{display: "flex"}}>
        <div style={{width: "50px"}}>
          {/* <img  style={{maxWidth: "100%"}} src={user.avatar} alt='jobs' /> */}
        </div>
        <p> <span style= {{fontWeight: "bold"}}>{msg.sender.name}:</span> {msg.text}</p>

      </div>
      ))}

    {/* */}


        {/* chat box  */}
      {
        messageBox &&(
          <div className="message-container">
          <h3>Message </h3>
          <form className='chat-form' onSubmit={messageSubmit}>
            <div className='form-group'>
              <div className='input-icon'>
                <textarea
                  type='text'
                  className='form-control'
                  name='user name'
                  placeholder='Type Message ...'
                  value={messageText} onInput={e => setMessageText(e.target.value)}
                />
              </div>
            </div>
            <button type='submit' className='btn btn-common log-btn mt-3'>
              Submit
            </button>
          </form>

          </div>
        )
      }


    </div>
  );
}

export default App;
