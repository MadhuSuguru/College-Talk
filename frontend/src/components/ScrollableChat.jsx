import { Avatar } from '@chakra-ui/react';
import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin } from '../Logics'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './ProfileModal';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
  return (
      <div style={{scrollY:'auto' , scrollX:'none'}}>
          {messages && messages.map((msg, i) => (
              <div key={msg._id} style={{ display: 'flex' }}>
              {(isSameSender(messages, msg, i, user._id) || isLastMessage(messages, i, user._id)) && (
                <ProfileModal
                  user={msg.sender}>
                  <Avatar
                    mr={1}
                    mt='7px'
                    name={msg.sender.username}  
                    src={msg.sender.dp}
                    size='sm'
                    cursor={'pointer'}
                  />
                </ProfileModal>
                  )}
                  
                  <span style={{ backgroundColor: `${msg.sender._id === user._id ? "#9c89b3" : "#019492"}`, borderRadius: '15px',margin:'1px',padding:"5px 15px" ,maxWidth: "75%" , color:"white" , marginLeft: isSameSenderMargin(messages,msg,i,user._id)}} >
                      {msg.message}
                  </span>
            </div>
        ))}  
    </div>
  )
}

export default ScrollableChat
