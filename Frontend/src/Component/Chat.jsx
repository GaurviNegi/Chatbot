import React, { useState } from 'react'
import axios from "axios"
import {useMutation} from "@tanstack/react-query";
import "./chat.css"
import { IoSend } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
//function to make the http request....
const sendMessage = async (message)=>{
   const response = await axios.post("http://localhost:9090/ask",{message})
   return response.data
}

const Chat = () => {
    const [message, setMessage] = useState("");
    const [isTyping , setIsTyping] = useState(false);
    const [conversations , setConversations] = useState([{role:"assistant",content:"hello! how can i help you today"}])

    //mutation logic
    const mutation =useMutation({
        mutationFn:sendMessage,
        mutationKey:["chatbot"],
        onSuccess:(data)=>{
           setIsTyping(false);
           setConversations((preconversation)=>{
              return [...preconversation,{role:"assistant", content:data.message}]
           })
        }
    })

    //handling submit button ...
     const handleSendMessage = ()=>{
        const currentMessage = message.trim();
        if(!currentMessage){
            alert("please enter a message");
            return;
        }
        setConversations((preconversation)=>[...preconversation,{role:"user", content:currentMessage}]);
        setIsTyping(true);
        mutation.mutate(currentMessage);
        setMessage("");
     }; 
  return (
   <>
    <div className='header'>
    <h1 className='title'>AI Chatbot</h1>
    <p className='description'>Enter your message in the input field below to chat with the AI.</p></div>
    <div className='chat-container'>
        <div className='conversation'>
        {conversations.map((entry, index) => (
            <div key={index} className={`message ${entry.role}`}>
              <strong>{entry.role === "user" ? "You: " : <FaRobot />}</strong>
              {entry.content}
            </div>
          ))}
         {isTyping && (
            <div className="message assistant">
              <FaRobot />
              <strong>AI is typing...</strong>
            </div>
          )}
        </div>

   
   <div className='input-area'>
   <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-message"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />

         <button
            onClick={handleSendMessage}
            disabled={mutation.isPending}
            className="send-btn"
          >
            {mutation.isPending ? <IoSend className="icon-spin" /> : <IoSend />}
          </button>
            </div>
   </div>
    </>
  )
}

export default Chat
