import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import {Select} from "chakra-react-select";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const RegisterComp = () => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [college, setCollege] = useState(null);
    const [password, setPassword] = useState();
    const [confirmpass, setconfirmpass] = useState();
    const [dp, setdp] = useState();
    const [dploading, setdploading] = useState();
    const [showpass, setshowpass] = useState(false);
    const [options, setOptions] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();
    
  const func = async () => {
      try {
        await axios.get('/api/colleges').then(res => res.data).then(data => setOptions(data));
      } catch (error) {
        toast({
        title: "Error Fetching Colleges",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      }
      
    }
    useEffect(() => {
      func();
    }, [options])
    
    const handleSubmit = async() => {
    setdploading(true);
    if (!username || !email || !college || !password ) {
      toast({
        title: "Enter all Credentials",
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      setdploading(false); return ;
    
    }
    if (password !== confirmpass) {
      toast({
        title: "Confirm the Password",
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      setdploading(false); return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        }
      }
      const { data } = await axios.post("/api/user", { username, email, college, password, dp }, config);
      toast({
        title: "Registration Successful",
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
        title: "error occured",
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      setdploading(false);
      return;
    }
  }
  const handledp = (dp) => {
    setdploading(true);
    if (dp === undefined) {
      toast({
        title: "Upload a DP",
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
      setdploading(false); return;
    }
    if (dp.type === 'image/jpeg' || dp.type === 'image/png' || dp.type === 'image/jpg') {
      const data = new FormData();
      data.append("file", dp);
      data.append("upload_preset", "College Talk");
      data.append("cloud_name", "dfu71nfjr");
      const cloudinaryurl = "https://api.cloudinary.com/v1_1/dfu71nfjr/image/upload";
      fetch(cloudinaryurl, {
        method: "post",
        body: data,
      }).then((res) => res.json()).then((data) => {
        setdp(data.url.toString());
        setdploading(false);
      })
    }
    else {
      toast({
        title: "Upload a DP",
        status: 'warning',
        duration: 2000,
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
                  <Input placeholder='Username' onChange={(e) => {
                  setUsername(e.target.value);
                }}/>
      </FormControl>
      <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
                  <Input placeholder='Email' onChange={(e) => {
                  setEmail(e.target.value);
                }}/>
      </FormControl>
      <FormControl id='college' isRequired >
        <FormLabel>College</FormLabel>         
        {options && (<Select isSearchable placeholder='College Name' options={options} value={college} onChange={(value)=>setCollege(value)}   />
)}
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
                  <Input type={showpass ? 'text' :'password'} placeholder='Password' onChange={(e) => {
                  setPassword(e.target.value);
          }} />
          <InputRightElement onClick={()=>{setshowpass(!showpass)}}>
            <Button size={'sm'}>
              {showpass ? 'hide' : 'show'}
            </Button>
          </InputRightElement>
          </InputGroup>
      </FormControl>
      <FormControl id='confirmpassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input type={showpass ? 'text' : 'password'} placeholder='Confirm Password' onChange={(e) => {
            setconfirmpass(e.target.value);
          }} />
          <InputRightElement onClick={()=>{setshowpass(!showpass)}}>
            <Button size={'sm'}>
              {showpass ? 'hide' : 'show'}
            </Button>
          </InputRightElement>
          </InputGroup>
      </FormControl>
      <FormControl id='dp'>
        <FormLabel>Set DP</FormLabel>
        <Input
          type='file' p='0.3rem' accept='image/*' onChange={(e)=>{handledp(e.target.files[0])}}
        >
          
        </Input>
      </FormControl>
      <FormControl>
        <FormLabel>
          <Button p='1rem' onClick={handleSubmit} color='#9c89b8' isLoading={dploading}>
            Register
          </Button>
        </FormLabel>
      </FormControl>
    </VStack>
  )
}

export default RegisterComp