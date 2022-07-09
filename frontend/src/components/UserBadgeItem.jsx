import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction ,selectedChat}) => {
  
  return (
    <Box px="2" py="1" borderRadius="lg" m="1" mb='2' cursor='pointer' fontSize={12} variant="solid" onClick={handleFunction} border='1px' backgroundColor={'#9c89b8'}>
      {user.username}
      {!selectedChat && <CloseIcon paddingLeft='1' />}
      {selectedChat.isGroupChat && user._id === selectedChat.groupAdmin._id && (<b> -admin</b>)}
      {selectedChat.isGroupChat && user._id !== selectedChat.groupAdmin._id && (<CloseIcon paddingLeft='1'/>)}
        
    </Box>
    )
}

export default UserBadgeItem