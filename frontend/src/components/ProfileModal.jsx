import { ViewIcon } from '@chakra-ui/icons'
import { Image ,Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
      <>
          {children ? (<span onClick={onOpen}>{children}</span>) : (
              <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
          )}
          <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
                <Image src={user.dp} borderRadius='full'></Image>
          </ModalBody>
            <Text display='flex' justifyContent='center' fontSize='50px' padding={'1rem'}>{user.username}</Text>
            <Text display='flex' justifyContent='center' fontSize='15px' padding={'1rem'}>{user.college}</Text>
        </ModalContent>
      </Modal>
      </>
  )
}

export default ProfileModal