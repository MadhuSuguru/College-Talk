import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react'

const UserListItem = ({user, handleFunction }) => {

    return (
            <Box onClick={handleFunction} cursor='pointer' display={'flex'} alignItems='center' backgroundColor={'#b8bedd'} w="90%"  color='white'  px='3' py='3'  mt='2' borderRadius={'md'}>
            <Avatar src={user.dp} />
                <Box>
                    <Text>{user.username}</Text>
                </Box>               
            </Box>   
  )
}

export default UserListItem