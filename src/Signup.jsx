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
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { API_URL } from './App';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const googleLogin = (response) => {
        handleSubmit(null, response.credential);
    };

    const handleSubmit = async (e, credential) => {
        e?.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/signup`, {
                email,
                password,
                firstName,
                lastName,
                credential
            });

            if (response.data.token) {
                if (credential) {
                    localStorage.setItem('token', response.data.token);
                    toast({
                        title: 'Account created.',
                        description: 'Successfully signed up with Google.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    navigate('/app');
                } else {
                    setVerificationSent(true);
                    toast({
                        title: 'Verification email sent',
                        description: 'Please check your email to verify your account.',
                        status: 'info',
                        duration: 5000,
                        isClosable: true
                    });
                }
            }
        } catch (error) {
            toast({
                title: 'An error occurred.',
                description: error.response?.data?.message || 'Unable to create account.',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={8}>
            <Box>
                <VStack spacing={6} align="stretch">
                    <Heading as="h1" size="xl" textAlign="center">
                        Sign Up
                    </Heading>

                    {verificationSent && (
                        <Alert status="success">
                            <AlertIcon />
                            Please check your email to verify your account
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    minLength={8}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter your first name"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter your last name"
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                width="full"
                                isLoading={isLoading}
                                size="lg"
                            >
                                Sign Up
                            </Button>
                            <GoogleLogin size="large" onSuccess={googleLogin} />
                        </VStack>
                    </form>
                    <Text textAlign="center">
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'blue' }}>
                            Log in
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default Signup;
