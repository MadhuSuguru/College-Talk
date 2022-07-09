import { Box } from '@chakra-ui/react';
import React from 'react'
import { useState } from 'react';
import ChatBox from '../components/ChatBox';
import Contacts from '../components/Contacts';
import Header from '../components/Header';
import {ChatState} from '../Context/ChatProvider';
const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <div style={{ width: "100%" }}>
      {user && <Header />}

      <Box display="flex" justifyContent="space-between" w="100%" h="91vh" p="5px" gridTemplate="10% 90%">
        {user && <Contacts fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain } />}
      </Box>

    </div>
  );
}

export default Chat;