import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    useToast,
    Container,
    Link as ChakraLink
} from '@chakra-ui/react';
import { API_URL } from './App';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const googleLogin = (response) => {
        handleSubmit(null, response.credential);
    };

    const handleSubmit = async (e, credential) => {
        e?.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/${credential ? 'signup' : 'login'}`, {
                email,
                password,
                credential
            });
            localStorage.setItem('token', response.data.token);
            toast({
                title: 'Login successful',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            navigate('/app');
        } catch (error) {
            toast({
                title: 'Login failed',
                description: error.response?.data?.message || 'An error occurred',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        navigate('/forgot');
    };

    return (
        <Container maxW="container.sm" py={8}>
            <Box>
                <VStack spacing={6} align="stretch">
                    <Heading as="h1" size="xl" textAlign="center">
                        Login
                    </Heading>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                width="full"
                                isLoading={isLoading}
                                size="lg"
                            >
                                Login
                            </Button>
                            <GoogleLogin size="large" onSuccess={googleLogin} />
                        </VStack>
                    </form>

                    <VStack spacing={2}>
                        <ChakraLink onClick={handleForgotPassword} color="blue.500">
                            Forgot Password?
                        </ChakraLink>
                        <Text>
                            Don&apos;t have an account?{' '}
                            <Link to="/signup" style={{ color: 'blue' }}>
                                Sign up
                            </Link>
                        </Text>
                    </VStack>
                </VStack>
            </Box>
        </Container>
    );
};

export default Login;
