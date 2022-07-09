import { VStack,FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginComp = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
  const [showpass, setshowpass] = useState(false);
    const [dploading, setdploading] = useState();
  const toast = useToast();
  const navigate = useNavigate();
  const handleSubmit = async() => {
    setdploading(true);
    if (!username || !password) {
      toast({
        title: "Enter all Credentials",
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      setdploading(false); return ;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        }
      }
      const {data} = await axios.post("/api/user/login", { username,  password}, config);
      toast({
        title: "Welcome Back",
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
      });
      localStorage.setItem('user', JSON.stringify(data));
      setdploading(false);
      navigate('/chat');
    } catch (error) {
      
      toast({
        title: error.response.data.message,
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top'
      });
      setdploading(false);
      return;
    }
  }
  return (
      <VStack spacing='1rem'>
          <FormControl id='username' isRequired>
              <FormLabel>Username</FormLabel>
                  <Input placeholder='Username' value={username} onChange={(e) => {
                  setUsername(e.target.value);
                }}/>
      </FormControl>
      
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
                  <Input type={showpass ? 'text' :'password'} placeholder='Password' value={password} onChange={(e) => {
                  setPassword(e.target.value);
          }} />
          <InputRightElement onClick={()=>{setshowpass(!showpass)}}>
            <Button size={'sm'}>
              {showpass ? 'hide' : 'show'}
            </Button>
          </InputRightElement>
          </InputGroup>
      </FormControl>
      
      <FormControl>
        <FormLabel>
          <Button p='1rem' onClick={handleSubmit} color='#9c89b8'>
            Login
          </Button>
        </FormLabel>
      </FormControl>
    </VStack>
  )
}

export default LoginComp