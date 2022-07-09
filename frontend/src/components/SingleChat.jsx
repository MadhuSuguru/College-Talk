import { ArrowBackIcon } from '@chakra-ui/icons';
import {  Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import { useEffect ,useState} from 'react';
import { getSender } from '../Logics';
import { ChatState } from '../Context/ChatProvider';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import { BsEmojiSmileFill } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import styled from "styled-components";

const ENDPOINT = "https://college-talk.herokuapp.com/";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat,notifications, setNotifications} = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMsg, setNewmessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    const [showEmojiPicker,setShowEmojiPicker] = useState(false);

  const toast = useToast();
  
   
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit('setup', user);
      socket.on('connected', () => {
        setSocketConnected(true);
      });
      socket.on('typing', () => {
        setIsTyping(true);
      });
      socket.on('stop typing', () => {
        setIsTyping(false);
      });
   })
  
    useEffect(() => { 
      socket.on('msg received', (newmsg) => {
        if (!selectedChatCompare || selectedChatCompare._id !== newmsg.chat._id) {
          if (!notifications.includes(newmsg)) {
            setNotifications([newmsg, ...notifications]);
            setFetchAgain(!fetchAgain);
          }
        }
        else {
          setMessages([...messages, newmsg])
        }
      });
  })
  
  const handleEmojiPicker = ()=>{
        setShowEmojiPicker(!showEmojiPicker);
  }
  const handleEmojiClick = (event,emoji)=>{
    let message = newMsg;
      message+=emoji.emoji;
      setNewmessage(message);
  }
 
    const sendMsg = async(e) => {
      if (e.key === "Enter" && newMsg) {
        socket.emit('stop typing', selectedChat._id);
      try {
        const config ={
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${user.token}`
            }
        }
        setNewmessage("");
        const { data } = await axios.post('/api/message', { message: newMsg, chatId: selectedChat._id }, config);
        socket.emit('new msg', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
            title: "Error!! Please try reloading",
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top'
            });
      }
    }
  }
  const FetchMessages =  async() => {
    if (selectedChat) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
        const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);    
        setMessages(data);
        setLoading(false);
        socket.emit('join chat',selectedChat._id)
      } catch (error) {
        toast({
          title: "Error!! Please try reloading",
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
      }
    }
    else {
      return;
    }
  }
  
  useEffect(() => {
    FetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat])


  const handleTyping = (e) => {
    setNewmessage(e.target.value);
    if (!socketConnected) {
      return;
    }
    if (!typing) {
        setTyping(true);
        socket.emit('typing', selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timer = 3000;
      setTimeout(() => {
        var currTime = new Date().getTime();
        var timeDiff = currTime - lastTypingTime;
        if (timeDiff >= timer && typing) {
          socket.emit('stop typing', selectedChat._id);
          setTyping(false);
        }
      }, timer)
    
    
  }

  
  return (
    <>
        {selectedChat ?
        <>
            <Text fontSize={{ base: '28px', md: '30px ' }} width='100%' display='flex' paddingLeft='1rem' paddingRight={'1rem'} paddingY='0.5rem' justifyContent={{ base: "space-between" }} alignItems='center'>
              <IconButton display={{ base: 'flex', md: 'none' }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("") } />          
              {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                  
              </>) : (<>
                {selectedChat.chatName}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} FetchMsg={FetchMessages} />      
              </>) }
            </Text>
              <Box display={'flex'} flexDirection='column' justifyContent='flex-end' width={'100%'} height='100%' padding={3} overflowY={'hidden'} backgroundColor='#e5e5e5' borderRadius={'sm'}>
            {loading ? (<Spinner alignSelf={'center'} margin='auto'/>):(
              <div style={{display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                scrollbarWidth: 'none'}}>
                <ScrollableChat messages={messages} />
              </div>)}
            <FormControl onKeyDown={sendMsg} isRequired mt='3' >
              {isTyping && ( selectedChat.isGroupChat ? <div style={{paddingBottom :"1px"}}>Someone is Typing...</div> : <div>.....</div>)}
              <Box display={'flex'} justifyContent='space-between'>
                <Container>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem', fontSize: '20px' }} className='emoji' >
                  <BsEmojiSmileFill onClick={handleEmojiPicker} cursor={'pointer'}  />
                  { showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>  }
                </div>
                </Container>
                <Input value={newMsg} variant={'filled'} placeholder='Enter a Message' onChange={handleTyping} />
                </Box>  
            </FormControl>
              </Box></> : (
              <Box display={'flex'} justifyContent='center' alignItems={'center'} width='100%' height={'100%'} fontSize='2.5rem'>
                <Text>
                    Hello there...
                </Text>
            </Box>
        )}
      </>

  )
}

const Container = styled.div`
  .emoji{
    .emoji-picker-react{
      position:absolute;
      top: -350px;
      left:10px
    }
  }
`

export default SingleChat;