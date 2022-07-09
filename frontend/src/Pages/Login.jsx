import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Tabs,Tab, TabList, TabPanel, TabPanels, Text } from '@chakra-ui/react'
import LoginComp from '../components/LoginComp';
import RegisterComp from '../components/Register';

const Login = () => {
   const navigate = useNavigate();
    useEffect(() => {
        const userdata = JSON.parse(localStorage.getItem("user"));
        if (!userdata ) {
            navigate("/");
        }
    },[navigate])
  return (
    
    <Container maxW='xl' centerContent>
      <Box d='flex' justifyContent="center" p={3} bg="#9c89b8" w="100%"  m="1rem 0 0.5rem 0" borderRadius="lg" borderWidth="1px" >
        <Text fontSize="3xl" color="black" fontFamily="Raleway" >
          College Talk
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="0.1em">
        <Tabs isFitted variant='enclosed'>
        <TabList mb='1em'>
          <Tab>Login</Tab>
          <Tab>Register</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LoginComp />
          </TabPanel>
          <TabPanel>
            <RegisterComp />
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
    </Container>
          
    
  )
}

export default Login;