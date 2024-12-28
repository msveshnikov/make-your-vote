import { useState, useEffect } from 'react';
import {
    ChakraProvider,
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
    Flex,
    Icon,
    extendTheme,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react';
import { FaVoteYea, FaPlus } from 'react-icons/fa';
import { API_URL } from './App';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false
    }
});

function Vote() {
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState({ optionA: '', optionB: '' });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchTopics();
        // socket.on('newVote', handleVoteUpdate);
        // return () => socket.off('newVote', handleVoteUpdate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await fetch(`${API_URL}/api/topics`);
            const data = await response.json();
            setTopics(data);
        } catch {
            toast({
                title: 'Error fetching topics',
                status: 'error',
                duration: 3000
            });
        }
    };

    const handleVote = async (topicId, option) => {
        try {
            const response = await fetch(`${API_URL}/api/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topicId, vote: option })
            });
            if (!response.ok) throw new Error('Vote failed');
            toast({
                title: 'Vote recorded',
                status: 'success',
                duration: 2000
            });
        } catch {
            toast({
                title: 'Error recording vote',
                status: 'error',
                duration: 3000
            });
        }
    };

    const handleCreateTopic = async () => {
        try {
            const response = await fetch(`${API_URL}/api/topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTopic)
            });
            if (!response.ok) throw new Error('Failed to create topic');
            onClose();
            fetchTopics();
            setNewTopic({ optionA: '', optionB: '' });
            toast({
                title: 'Topic created successfully',
                status: 'success',
                duration: 2000
            });
        } catch {
            toast({
                title: 'Error creating topic',
                status: 'error',
                duration: 3000
            });
        }
    };

    return (
        <ChakraProvider theme={theme}>
            <Box minH="100vh" bg="white" color="gray.800">
                <Container maxW="container.xl" py={12}>
                    <Flex justifyContent="space-between" alignItems="center" mb={12}>
                        <Flex alignItems="center" gap={3}>
                            <Icon as={FaVoteYea} w={8} h={8} color="blue.400" />
                            <Heading size="xl">MakeYour.vote</Heading>
                        </Flex>
                        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
                            Create Topic
                        </Button>
                    </Flex>

                    <VStack spacing={8}>
                        {topics.map((topic) => (
                            <Box
                                key={topic._id}
                                w="full"
                                p={6}
                                borderRadius="lg"
                                border="1px"
                                borderColor="gray.200"
                            >
                                <Flex justifyContent="space-between" alignItems="center">
                                    <VStack align="start" spacing={2}>
                                        <Heading size="md">{topic.title}</Heading>
                                        <Flex gap={4}>
                                            <Button
                                                onClick={() => handleVote(topic._id, 'optionA')}
                                                colorScheme="blue"
                                            >
                                                {topic.optionA}
                                            </Button>
                                            <Text>vs</Text>
                                            <Button
                                                onClick={() => handleVote(topic._id, 'optionB')}
                                                colorScheme="blue"
                                            >
                                                {topic.optionB}
                                            </Button>
                                        </Flex>
                                    </VStack>
                                    <Badge colorScheme="blue">{topic.totalVotes} votes</Badge>
                                </Flex>
                            </Box>
                        ))}
                    </VStack>
                </Container>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Topic</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Option 1</FormLabel>
                            <Input
                                value={newTopic.optionA}
                                onChange={(e) =>
                                    setNewTopic({ ...newTopic, optionA: e.target.value })
                                }
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Option 2</FormLabel>
                            <Input
                                value={newTopic.optionB}
                                onChange={(e) =>
                                    setNewTopic({ ...newTopic, optionB: e.target.value })
                                }
                            />
                        </FormControl>
                        <Button
                            mt={4}
                            colorScheme="blue"
                            onClick={handleCreateTopic}
                            isDisabled={!newTopic.optionA || !newTopic.optionB}
                        >
                            Create
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
}

export default Vote;
