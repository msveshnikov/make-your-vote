import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Heading,
    Text,
    VStack,
    Button,
    Flex,
    Icon,
    Badge,
    Progress,
    HStack,
    Tooltip,
    Image,
    Stat,
    StatNumber,
    StatHelpText,
    StatArrow,
    Box,
    useMediaQuery,
    useToast
} from '@chakra-ui/react';
import { API_URL } from './App';
import ReactGA from 'react-ga4';
import { FaShare } from 'react-icons/fa';

const Topic = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile] = useMediaQuery('(max-width: 768px)');
    const [votedTopics, setVotedTopics] = useState(new Set());
    const toast = useToast();

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await fetch(`${API_URL}/api/topic/${id}`);
                if (!response.ok) throw new Error('Topic not found');
                const data = await response.json();
                setTopic(data);
                ReactGA.event({
                    category: 'Topic',
                    action: 'View',
                    label: data.title
                });
            } catch (err) {
                setError(err.message);
                console.error('Error fetching topic:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopic();
    }, [id]);

    const handleShare = async (topic) => {
        const shareUrl = `${window.location.origin}/topic/${topic._id}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Vote on ${topic.title}`,
                    text: `${topic.optionA} vs ${topic.optionB}`,
                    url: shareUrl
                });
            }
        } catch {
            toast({
                title: 'Error sharing topic',
                status: 'error',
                duration: 3000
            });
        }
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

            // const updatedTopics = topics.map((topic) => {
            //     if (topic._id === topicId) {
            //         return {
            //             ...topic,
            //             votePercentages: calculateVotePercentages(topic)
            //         };
            //     }
            //     return topic;
            // });
            // setTopics(updatedTopics);

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

    if (loading) return <Progress size="xs" isIndeterminate />;
    if (error) return <Text color="red.500">{error}</Text>;
    if (!topic) return null;

    return (
        <Container maxW="container.xl" py={8}>
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
                    <Flex justifyContent="space-between" alignItems="center">
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
                    <Flex gap={4} flexDir={isMobile ? 'column' : 'row'} align="center">
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
                                        {topic.votePercentages.optionA.toFixed(1)}%
                                    </StatNumber>
                                    <StatHelpText>
                                        <StatArrow
                                            type={
                                                topic.votePercentages.optionA >= 50
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
                                        {topic.votePercentages.optionB.toFixed(1)}%
                                    </StatNumber>
                                    <StatHelpText>
                                        <StatArrow
                                            type={
                                                topic.votePercentages.optionB >= 50
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
        </Container>
    );
};

export default Topic;
