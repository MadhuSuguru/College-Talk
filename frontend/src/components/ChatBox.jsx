import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: 'flex' }}
      alignItems='center'
      flexDirection='column'
      w={{ base: "100%", md: "68%" }}
      borderRadius='lg'
      borderWidth='2px'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain }/>  
    </Box>
    )
}

export default ChatBox