import { AddIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { getSender, getSenderObject } from '../Logics';
import { ChatState } from '../Context/ChatProvider';
import Groupchatmodal from './Groupchatmodal';

const Contacts = ({fetchAgain}) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggeduser, setLoggeduser] = useState();
  const toast = useToast();
  const FetchChats = async () => {
    try {
      const config = {
      headers: {
        Authorization : `Bearer ${user.token}`
      }
      }
    const { data } = await axios.get('/api/chat', config);
    setChats(data);
    } catch (error) {
      toast({
            title: "Error Fetching chat",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top'
        });
    }
  }
  useEffect(() => {
    setLoggeduser(JSON.parse(localStorage.getItem('user')));
    FetchChats();
  },[fetchAgain])
  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems={'center'}
      w={{ base: '100%', md: '31%' }}
      backgroundColor='#e5e5e5'>
      <Box
        display={'flex'}
        justifyContent='space-between'
        alignItems={'center'}
        w='100%' p={'3'}
        fontSize={{ base: "30px", md: '20px', lg: '30px' }}
        color='black'>
        Contacts
      <Groupchatmodal>
        <Button display={'flex'} fontSize={{ base: "17px", md: '10px', lg: '17px' }} leftIcon={<AddIcon />} color='black'>
        Group
          </Button>
      </Groupchatmodal>
      </Box>
      <Box display={'flex'} flexDir='column' w='100%' h='100%' overflowY={'hidden'}>
        {chats ? (
          <Stack overflowY='scroll' >
            {chats.map((chat) => (
              <Box onClick={()=>setSelectedChat(chat)} display={'flex'} alignItems='center' cursor='pointer' key={chat._id} bg={selectedChat === chat ? "#9c89b8" : '#b8bedd'} padding="1rem" borderRadius={'sm'} width='100%' >
                <Avatar src={!chat.isGroupChat ? (getSenderObject(loggeduser,chat.users).dp) : 'https://img.icons8.com/external-flatart-icons-outline-flatarticons/344/external-users-cv-resume-flatart-icons-outline-flatarticons.png'} />
                <Text paddingLeft={'1rem'}>
                  {!chat.isGroupChat ? (getSender(loggeduser,chat.users)) : chat.chatName}
                </Text>
              </Box>
            )             
            )}
        </Stack>
        ) : (
            <h3>Loading...</h3>
        )}
      </Box>
    </Box>
  )
}

export default Contacts