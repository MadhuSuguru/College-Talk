import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Text, useToast, useDisclosure } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { getSender } from '../Logics';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

const Sidedrawer = () => {
    const [search, setSearch] = useState("");
    const [searchRes, setSearchRes] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [loadingChat, setloadingChat] = useState();
    const { user,selectedChat,setSelectedChat,chats,setChats,notifications, setNotifications} = ChatState();
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }

    const handleSearch = async() => {
        if (!search) {
            toast({
            title: "Please Search a User",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top'
            });
            setisLoading(false);
            return;
        }
        try {
            setisLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setisLoading(false);
            setSearchRes(data);
        } catch (error) {
            toast({
            title: "Error!! Please try reloading",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top'
            });
            
        }
    }

    const accessChat = async(u) => {
            try {
                setloadingChat(true);
                const config = {
                    headers : {
                        "Content-type" : "application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
                const userId = u._id;
                const name = u.username;
                const { data } = await axios.post('/api/chat', { userId,name }, config);
                if (!chats.find((c) => c._id === data._id)) {
                    setChats([...chats,data]);
                }
                setSelectedChat(data);
                setloadingChat(false);
                onClose();

            } catch (error) {
                toast({
                title: "Error Fetching Chat",
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
            }
        }
    return (
        <>
        <Box display='flex' justifyContent='space-between' alignItems='center' w="100%" padding="5px 10px" backgroundColor='#9c89b8'>
            <Button variant='ghost' onClick={onOpen}>
                <i className="fas fa-search" />
                <Text display={{base:'none' , md:'flex'}} px='4'>
                    Search
                </Text>
            </Button>  
                <Text fontSize={'4xl'}>College Talk</Text>
                <div>
                    <Menu>
                        <MenuButton p='1' >
                            <NotificationBadge
                                count={notifications.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize='2xl' m={'0.4rem' } />
                        </MenuButton>
                        <MenuList>
                            {!notifications.length && " "}
                            {notifications.map((notification) => (
                                <MenuItem key={notification._id} onClick={() => {
                                    setSelectedChat(notification.chat)
                                    setNotifications(notifications.filter((notify)=> notify._id!==notification._id))
                                }}>
                                    
                                    {notification.chat.isGroupChat ? `New message in ${notification.chat.chatName}` : `New Message from ${getSender(user,notification.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button}  rightIcon={<ChevronDownIcon />}>
                            <Avatar size={'sm'} cursor='pointer' name={user.username} src={user.dp} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>

                    </Menu>

                </div>
            </Box>
            
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        <Box display={'flex'} paddingBottom='2px'>
                            <Input marginRight='2' value={search} onChange={(e)=>setSearch(e.target.value)}>
                            </Input>
                            <Button onClick={handleSearch}>Search</Button>
                        </Box>
                        {isLoading ? (
                            <ChatLoading />
                        ) : (
                                searchRes?.map((u) => (
                                <UserListItem        
                                    key={u._id}
                                    user={u}
                                    handleFunction={()=>accessChat(u)} />    
                         ))
                        )}
                    </DrawerBody>

                </DrawerContent>
            </Drawer>
        </>
  )
}

export default Sidedrawer