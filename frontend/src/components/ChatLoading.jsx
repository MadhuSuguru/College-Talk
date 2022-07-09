import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
      <Stack padding='1px'>
          <Skeleton height='50px'></Skeleton>
          <Skeleton height='50px'></Skeleton>
          <Skeleton height='50px'></Skeleton>
          <Skeleton height='50px'></Skeleton>
          <Skeleton height='50px'></Skeleton>
          <Skeleton height='50px'></Skeleton>
          <Skeleton height='50px'></Skeleton>

      </Stack>
  )
}

export default ChatLoading