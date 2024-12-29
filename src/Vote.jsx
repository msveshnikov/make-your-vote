import { useState, useEffect, useCallback } from 'react';
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
    useToast,
    Progress,
    HStack,
    Tooltip,
    useMediaQuery,
    Select
} from '@chakra-ui/react';
import { FaVoteYea, FaPlus, FaChartLine, FaShare } from 'react-icons/fa';
import { API_URL } from './App';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: 'full'
            }
        }
    }
});

function Vote() {
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState({ title: '', optionA: '', optionB: '', category: '' });
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const fetchTopics = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/topics`);
            const data = await response.json();
            setTopics(data);
        } catch {
            toast({
                title: 'Error fetching topics',
                status: 'error',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    const handleVote = async (topicId, option) => {
        try {
            const response = await fetch(`${API_URL}/api/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topicId, value: option })
            });
            if (!response.ok) throw new Error('Vote failed');
            toast({
                title: 'Vote recorded',
                status: 'success',
                duration: 2000
            });
            fetchTopics();
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
            setNewTopic({ title: '', optionA: '', optionB: '', category: '' });
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

    const handleShare = async (topic) => {
        try {
            await navigator.share({
                title: `Vote on ${topic.title}`,
                text: `${topic.optionA} vs ${topic.optionB}`,
                url: window.location.href
            });
        } catch {
            toast({
                title: 'Error sharing topic',
                status: 'error',
                duration: 3000
            });
        }
    };

    return (
        <ChakraProvider theme={theme}>
            <Box minH="100vh" bg="white" color="gray.800">
                <Container maxW="container.xl" py={6}>
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mb={8}
                        flexDir={isMobile ? 'column' : 'row'}
                        gap={4}
                    >
                        <Flex alignItems="center" gap={3}>
                            <Icon as={FaVoteYea} w={8} h={8} color="blue.400" />
                            <Heading size="xl">Make Your Vote</Heading>
                        </Flex>
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="blue"
                            onClick={onOpen}
                            size={isMobile ? 'sm' : 'md'}
                        >
                            Create Topic
                        </Button>
                    </Flex>

                    {loading ? (
                        <Progress size="xs" isIndeterminate />
                    ) : (
                        <VStack spacing={6}>
                            {topics.map((topic) => (
                                <Box
                                    key={topic._id}
                                    w="full"
                                    p={6}
                                    borderRadius="xl"
                                    border="1px"
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: 'md' }}
                                >
                                    <VStack spacing={4} align="stretch">
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <Heading size="md">{topic.title}</Heading>
                                            <HStack>
                                                <Tooltip label="View Analytics">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="blue"
                                                    >
                                                        <Icon as={FaChartLine} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip label="Share">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="blue"
                                                        onClick={() => handleShare(topic)}
                                                    >
                                                        <Icon as={FaShare} />
                                                    </Button>
                                                </Tooltip>
                                            </HStack>
                                        </Flex>
                                        <Flex
                                            gap={4}
                                            flexDir={isMobile ? 'column' : 'row'}
                                            align="center"
                                        >
                                            <Button
                                                flex="1"
                                                onClick={() => handleVote(topic._id, -1)}
                                                colorScheme="blue"
                                                variant="outline"
                                            >
                                                {topic.optionA}
                                            </Button>
                                            <Text fontWeight="bold">vs</Text>
                                            <Button
                                                flex="1"
                                                onClick={() => handleVote(topic._id, 1)}
                                                colorScheme="blue"
                                            >
                                                {topic.optionB}
                                            </Button>
                                        </Flex>
                                        <Flex justifyContent="space-between">
                                            <Badge colorScheme="purple" fontSize="sm">
                                                {topic.category}
                                            </Badge>
                                            <Badge colorScheme="blue" fontSize="sm">
                                                {topic.totalVotes} votes
                                            </Badge>
                                        </Flex>
                                    </VStack>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Container>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Topic</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input
                                value={newTopic.title}
                                onChange={(e) =>
                                    setNewTopic({ ...newTopic, title: e.target.value })
                                }
                                placeholder="Enter topic title"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Option 1</FormLabel>
                            <Input
                                value={newTopic.optionA}
                                onChange={(e) =>
                                    setNewTopic({ ...newTopic, optionA: e.target.value })
                                }
                                placeholder="Enter first option"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Option 2</FormLabel>
                            <Input
                                value={newTopic.optionB}
                                onChange={(e) =>
                                    setNewTopic({ ...newTopic, optionB: e.target.value })
                                }
                                placeholder="Enter second option"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Category</FormLabel>
                            <Select
                                placeholder="Select category"
                                value={newTopic.category}
                                onChange={(e) =>
                                    setNewTopic({ ...newTopic, category: e.target.value })
                                }
                            >
                                <option value="Politics">Politics</option>
                                <option value="Technology">Technology</option>
                                <option value="Sports">Sports</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Science">Science</option>
                                <option value="Other">Other</option>
                            </Select>
                        </FormControl>
                        <Button
                            mt={6}
                            w="full"
                            colorScheme="blue"
                            onClick={handleCreateTopic}
                            isDisabled={
                                !newTopic.title ||
                                !newTopic.optionA ||
                                !newTopic.optionB ||
                                !newTopic.category
                            }
                        >
                            Create Topic
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
}

export default Vote;
