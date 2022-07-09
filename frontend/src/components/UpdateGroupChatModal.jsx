import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, FetchMsg }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupName, setGroupName] = useState();
    const [search, setSearch] = useState("");
    const [searchRes, setSearchRes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleAddUser = async(u) => {
        if (selectedChat.users.find(x => x._id === u._id)) {
            toast({
                title: "User Exists",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "You are not an Admin!",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/add', {
                userId: u._id,
                chatId: selectedChat._id,
                
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
        }
        setLoading(false);
    }
    const handleRemoveUser = async(u) => {
        if (selectedChat.groupAdmin._id !== u._id || u._id !== user._id) {
            toast({
                title: "You are not an Admin!",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/remove', {
                userId: u._id,
                chatId: selectedChat._id,
                
            }, config);
            u._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            FetchMsg();
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
        }
        setLoading(false);
    }
    const handleRename = async() => {
        if (!groupName) return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }
            console.log(selectedChat);
            const { data } = await axios.put('/api/chat/renamegroup', {
                chatId: selectedChat._id,
                chatName : groupName
            }, config)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
        }
        setRenameLoading(false);
        setGroupName("");
    }
    const handleSearch = async(q) => {
        setSearch(q);
      if (!q) {
        return;
      }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                },
            }
          const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchRes(data);
        } catch (error) {
            toast({
            title: "Error Fetching data",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top'
        });
            
        }
    }
  return (
    <>
          <IconButton
              display={{ base: 'flex' }}
              icon={<ViewIcon />}
              onClick={onOpen}>Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent>
            <ModalHeader display={'flex'} justifyContent='center'>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box  display={'flex'} flexWrap='wrap' >
                          {selectedChat.users.map(u => (<UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemoveUser(u)} selectedChat={selectedChat} />))}
            </Box>
            <FormControl display={'flex'}paddingBottom="1rem" paddingTop='1rem' >
                <Input  placeholder='Rename Group' value={groupName} onChange={(e)=> setGroupName(e.target.value)} />
                <Button isLoading={renameLoading} onClick={handleRename}>Save
                </Button>              
            </FormControl>        
            <FormControl>
                <Input placeholder='Add User' onChange={(e) =>handleSearch(e.target.value)}/>       
            </FormControl>          
            {loading ? (<div>Loading...</div>) : (searchRes?.map((u) => (<UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />)))}          
          </ModalBody>

          <ModalFooter>
            <Button backgroundColor='#ff0000' color='white' onClick={()=>handleRemoveUser(user)}>
                Leave      
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal