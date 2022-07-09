import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';

const Groupchatmodal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupName, setGroupName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchRes, setSearchRes] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = ChatState();


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

    const handleSubmit = async() => {
      if (!groupName || !selectedUsers) {
          toast({
            title: "Invalid Credentials",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top'
          });
          return ;
      }
      try {
        const config = {
          headers: {
            Authorization:`Bearer ${user.token}`,
          }
        }
        const { data } = await axios.post('/api/chat/group', {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id))
        }, config);
        setChats([data, ...chats]);
        onClose();
      } catch (error) {
        toast({
            title: "Error Creating Group",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top'
          });
      }
    }
  const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
          toast({
            title: "User Added",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top'
          });
          return ;
      }
    setSelectedUsers([...selectedUsers,userToAdd]);
    }

  const handleDelete = (deleteUser) => {
      setSelectedUsers(selectedUsers.filter((sel)=> sel._id!==deleteUser._id))
  }
  return (
    <>  
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader  display={'flex'}  justifyContent='center'>Create Group</ModalHeader>
          <ModalCloseButton />
        <ModalBody  display={'flex'} flexDirection='column' alignItems={'center'}>
          <FormControl m={'1rem'}>
            <Input placeholder='Group Name' onChange={(e)=> setGroupName(e.target.value)}/>
          </FormControl>
          <FormControl>
            <Input placeholder='Add Users' mb={'1px'} onChange={(e)=> handleSearch(e.target.value)}/>
          </FormControl>
          <Box display='flex' flexWrap='wrap'>
            {selectedUsers.map(u => (
              <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)} />))}
          </Box>
          {loading ? (<div>Loading...</div>) : (searchRes?.slice(0, 4).map(u => (
              <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />)))}
        </ModalBody>
        <ModalFooter>
          <Button backgroundColor='#9c89b8'  onClick={handleSubmit}>Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  )
}

export default Groupchatmodal