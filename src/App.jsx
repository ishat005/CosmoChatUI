import logo from './logo.svg';
import './App.css';
import Activity from './components/Activity';
import React, { useEffect, useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react';

const API_KEY = "sk-proj-W1zIiR6ekfmlWHsxwLjLT3BlbkFJjYdGLovExENi3xj7RPhv";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = 
    {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    
    const newMessages = [...messages, newMessage]; // all the old messages, + the new message
    
    // Update our message state
    setMessages(newMessages);

    
    // set a typing indicator
    setTyping(true);

    // Process message to chatGPT (send it over and see the response)
    await processMessageToChatGPT(newMessages);
  }

  // Process Messages with ChatGTP AI
  async function processMessageToChatGPT(chatMessages){

    // chat messages formatted for api
    // role: "user" => a message from the user 
    // role: "assistant" => a response from ChatGPT
    // role: "system" => generally one initial message defining how we want ChatGPT to talk
    
    let apiMessages =  chatMessages.map((messageObject) => { 
      let role = "";
      if(messageObject.sender === "ChatGPT") {
        role = "assistant"
      } else {
          role = "user"
      }
      return { role: role, content: messageObject.message }
    });

    const systemMessage = { 
      role: "system",
      content: "Explain all concepts like I am 10 years old."
      //speak like a pirate, Explain like I am a 10 years of experience software engineer
    }
    
    const apiRequestBody = { 
       "model": "gpt-3.5-turbo",

       // all different messages in our conversation
       "messages": [
          systemMessage,
          ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
      { 
        method: "POST",       //posting messages to API
        headers: {
          "Authorization" : "Bearer " + API_KEY,
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }
    ).then((data) =>{ 
      return data.json(); //return data in json format from Open AI API
    }).then((data) =>{
      console.log(data); 
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
            message: data.choices[0].message.content,
            sender: "ChatGPT"
        }]
      );
      setTyping(false);
    });
  }

  return (
    <div className="App" >
      <div style={{ position: 'relative', height: '800px', width: '1000px', display: 'flex'}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content='ChatGPT is Typing' /> : null}
            >
              {messages.map((message, i) => {
                  return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend}/>
            
          </ChatContainer> 
        </MainContainer>

        <Activity />
     
      </div>


    </div>
  );
}

export default App;
