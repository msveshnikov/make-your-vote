import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
    Flex,
    Icon,
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
    Select,
    Image,
    ButtonGroup,
    Stat,
    StatNumber,
    StatHelpText,
    StatArrow
} from '@chakra-ui/react';
import { FaVoteYea, FaPlus, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { API_URL } from './App';

function Vote() {
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState({ title: '', optionA: '', optionB: '', category: '' });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [votedTopics, setVotedTopics] = useState(new Set());
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const fetchTopics = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/topics?page=${currentPage}&limit=10`);
            const data = await response.json();
            setTopics(
                data.topics.map((topic) => ({
                    ...topic,
                    votePercentages: calculateVotePercentages(topic)
                }))
            );
            setTotalPages(data.totalPages);
        } catch {
            toast({
                title: 'Error fetching topics',
                status: 'error',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage, toast]);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    const calculateVotePercentages = (topic) => {
        return {
            optionA: topic.totalVotes ? (topic.optionAVotes / topic.totalVotes) * 100 : 50,
            optionB: topic.totalVotes ? (topic.optionBVotes / topic.totalVotes) * 100 : 50
        };
    };

    const handleVote = async (topicId, option) => {
        if (votedTopics.has(topicId)) {
            toast({
                title: 'You have already voted on this topic',
                status: 'warning',
                duration: 2000
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topicId, value: option })
            });
            if (!response.ok) throw new Error('Vote failed');

            setVotedTopics((prev) => new Set([...prev, topicId]));

            const updatedTopics = topics.map((topic) => {
                if (topic._id === topicId) {
                    return {
                        ...topic,
                        votePercentages: calculateVotePercentages(topic)
                    };
                }
                return topic;
            });
            setTopics(updatedTopics);

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <>
            <Box minH="100vh" bg="transparent" color="gray.800">
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
                            backdropFilter="blur(10px)"
                            bg="rgba(66, 153, 225, 0.9)"
                        >
                            Create Topic
                        </Button>
                    </Flex>

                    {loading ? (
                        <Progress size="xs" isIndeterminate />
                    ) : (
                        <>
                            <VStack spacing={6}>
                                {topics.map((topic) => (
                                    <Box
                                        key={topic._id}
                                        w="full"
                                        p={6}
                                        borderRadius="xl"
                                        bg="rgba(255, 255, 255, 0.8)"
                                        backdropFilter="blur(10px)"
                                        boxShadow="lg"
                                        transition="all 0.2s"
                                        _hover={{ transform: 'translateY(-2px)' }}
                                    >
                                        <VStack spacing={4} align="stretch">
                                            <Flex
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Heading size="md">{topic.title}</Heading>
                                                <HStack>
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
                                                <VStack flex="1">
                                                    {topic.optionAImage && (
                                                        <Image
                                                            src={topic.optionAImage}
                                                            alt={topic.optionA}
                                                            borderRadius="md"
                                                            objectFit="cover"
                                                            w="full"
                                                            h="200px"
                                                        />
                                                    )}
                                                    <Button
                                                        w="full"
                                                        onClick={() => handleVote(topic._id, -1)}
                                                        colorScheme="blue"
                                                        variant="outline"
                                                        isDisabled={votedTopics.has(topic._id)}
                                                    >
                                                        {topic.optionA}
                                                    </Button>
                                                    {votedTopics.has(topic._id) && (
                                                        <Stat>
                                                            <StatNumber>
                                                                {topic.votePercentages.optionA.toFixed(
                                                                    1
                                                                )}
                                                                %
                                                            </StatNumber>
                                                            <StatHelpText>
                                                                <StatArrow
                                                                    type={
                                                                        topic.votePercentages
                                                                            .optionA >= 50
                                                                            ? 'increase'
                                                                            : 'decrease'
                                                                    }
                                                                />
                                                            </StatHelpText>
                                                        </Stat>
                                                    )}
                                                </VStack>
                                                <Text fontWeight="bold">vs</Text>
                                                <VStack flex="1">
                                                    {topic.optionBImage && (
                                                        <Image
                                                            src={topic.optionBImage}
                                                            alt={topic.optionB}
                                                            borderRadius="md"
                                                            objectFit="cover"
                                                            w="full"
                                                            h="200px"
                                                        />
                                                    )}
                                                    <Button
                                                        w="full"
                                                        onClick={() => handleVote(topic._id, 1)}
                                                        colorScheme="blue"
                                                        isDisabled={votedTopics.has(topic._id)}
                                                    >
                                                        {topic.optionB}
                                                    </Button>
                                                    {votedTopics.has(topic._id) && (
                                                        <Stat>
                                                            <StatNumber>
                                                                {topic.votePercentages.optionB.toFixed(
                                                                    1
                                                                )}
                                                                %
                                                            </StatNumber>
                                                            <StatHelpText>
                                                                <StatArrow
                                                                    type={
                                                                        topic.votePercentages
                                                                            .optionB >= 50
                                                                            ? 'increase'
                                                                            : 'decrease'
                                                                    }
                                                                />
                                                            </StatHelpText>
                                                        </Stat>
                                                    )}
                                                </VStack>
                                            </Flex>
                                            <Flex justifyContent="space-between">
                                                <Badge colorScheme="purple" fontSize="sm">
                                                    {topic.category}
                                                </Badge>
                                                <Badge colorScheme="blue" fontSize="sm">
                                                    {Math.abs(topic.totalVotes)} votes
                                                </Badge>
                                            </Flex>
                                        </VStack>
                                    </Box>
                                ))}
                            </VStack>

                            <Flex justifyContent="center" mt={8}>
                                <ButtonGroup>
                                    <Button
                                        leftIcon={<FaChevronLeft />}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        isDisabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        rightIcon={<FaChevronRight />}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        isDisabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </ButtonGroup>
                            </Flex>
                        </>
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
        </>
    );
}

export default Vote;
