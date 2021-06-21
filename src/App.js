import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client"; // On top of App.js :

function App() {
  const [messageList, setMessageList] = useState([]);
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState(null);

  // When the component mounts :
  // TODO: set the socket in the state to use it later
  useEffect(() => {
    const s = socketIOClient("http://localhost:3001");
    setSocket(s);

    s.on("initialMessageList", (messages) => {
      setMessageList(messages);
    });

    s.on("messageFromServer", (newMessage) => {
      setMessageList((currentMessageList) => [
        ...currentMessageList,
        newMessage,
      ]);
    });
    return () => {
      s.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("messageFromClient", {
      text: newMessageText,
      author: nickName,
    });
  };

  return (
    <div className='App'>
      <h2>Messages</h2>
      {messageList.map((message) => {
        return (
          <div key={message.id}>
            {message.author} : {message.text}
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type='text'
          name='author'
          placeholder='nickname'
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input
          type='text'
          name='messageContent'
          placeholder='message'
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input type='submit' value='send' />
      </form>
    </div>
  );
}

export default App;
