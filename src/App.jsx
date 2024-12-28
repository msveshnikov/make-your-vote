import { useState } from 'react';
import {
    ChakraProvider,
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
    useColorMode,
    Flex,
    Icon
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaVoteYea } from 'react-icons/fa';

function App() {
    const [activeTopics] = useState([
        {
            id: 1,
            title: 'Current Events',
            votes: 1200,
            participants: 450
        },
        {
            id: 2,
            title: 'Sports',
            votes: 800,
            participants: 320
        },
        {
            id: 3,
            title: 'Society',
            votes: 950,
            participants: 380
        }
    ]);

    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <ChakraProvider>
            <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}>
                <Container maxW="container.xl" py={8}>
                    <Flex justifyContent="space-between" alignItems="center" mb={8}>
                        <Flex alignItems="center" gap={2}>
                            <Icon as={FaVoteYea} w={8} h={8} color="blue.500" />
                            <Heading size="xl">MakeYour.vote</Heading>
                        </Flex>
                        <Button onClick={toggleColorMode}>
                            <Icon as={colorMode === 'light' ? FaMoon : FaSun} />
                        </Button>
                    </Flex>

                    <VStack spacing={8} align="stretch">
                        <Box>
                            <Heading size="lg" mb={4}>
                                The Definitive Source for Public Opinion
                            </Heading>
                            <Text
                                fontSize="lg"
                                color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                            >
                                Unifying fragmented sentiment into official, actionable data
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={4}>
                                Trending Topics
                            </Heading>
                            <VStack spacing={4}>
                                {activeTopics.map((topic) => (
                                    <Box
                                        key={topic.id}
                                        p={6}
                                        borderRadius="lg"
                                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                                        shadow="md"
                                        w="100%"
                                    >
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <VStack align="start" spacing={1}>
                                                <Heading size="sm">{topic.title}</Heading>
                                                <Text
                                                    fontSize="sm"
                                                    color={
                                                        colorMode === 'light'
                                                            ? 'gray.600'
                                                            : 'gray.300'
                                                    }
                                                >
                                                    {topic.votes.toLocaleString()} votes •{' '}
                                                    {topic.participants.toLocaleString()}{' '}
                                                    participants
                                                </Text>
                                            </VStack>
                                            <Button colorScheme="blue" size="sm">
                                                Vote Now
                                            </Button>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>

                        <Box textAlign="center" py={8}>
                            <Button colorScheme="blue" size="lg">
                                Join the Discussion
                            </Button>
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </ChakraProvider>
    );
}

export default App;
