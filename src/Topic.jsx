import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Heading, Text, Image, Flex, Badge, Progress } from '@chakra-ui/react';
import { API_URL } from './App';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet';

const Topic = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <Progress size="xs" isIndeterminate />;
    if (error) return <Text color="red.500">{error}</Text>;
    if (!topic) return null;

    const totalVotes = topic.optionAVotes + topic.optionBVotes;
    const optionAPercentage = totalVotes ? (topic.optionAVotes / totalVotes) * 100 : 0;
    const optionBPercentage = totalVotes ? (topic.optionBVotes / totalVotes) * 100 : 0;

    return (
        <Container maxW="container.xl" py={8}>
            <Helmet>
                <title>{`${topic.title} | MakeYour.vote`}</title>
                <meta
                    name="description"
                    content={`Vote on ${topic.title}: ${topic.optionA} vs ${topic.optionB}`}
                />
                <meta property="og:title" content={`${topic.title} | MakeYour.vote`} />
                <meta
                    property="og:description"
                    content={`Vote on ${topic.title}: ${topic.optionA} vs ${topic.optionB}`}
                />
                <meta property="og:image" content={topic.optionAImage} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <Box
                bg="white"
                borderRadius="lg"
                boxShadow="xl"
                p={6}
                backdropFilter="blur(10px)"
                backgroundColor="rgba(255, 255, 255, 0.8)"
            >
                <Heading size="xl" mb={4}>
                    {topic.title}
                </Heading>
                <Badge colorScheme="blue" mb={4}>
                    {topic.category}
                </Badge>

                <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
                    <Box flex={1}>
                        <Image
                            src={topic.optionAImage}
                            alt={topic.optionA}
                            borderRadius="md"
                            objectFit="cover"
                            w="300px"
                            h="200px"
                        />
                        <Text fontSize="xl" fontWeight="bold" mt={2}>
                            {topic.optionA}
                        </Text>
                        <Text>
                            {optionAPercentage.toFixed(1)}% ({topic.optionAVotes} votes)
                        </Text>
                        <Progress value={optionAPercentage} colorScheme="blue" mt={2} />
                    </Box>

                    <Box flex={1}>
                        <Image
                            src={topic.optionBImage}
                            alt={topic.optionB}
                            borderRadius="md"
                            objectFit="cover"
                            w="full"
                            h="200px"
                        />
                        <Text fontSize="xl" fontWeight="bold" mt={2}>
                            {topic.optionB}
                        </Text>
                        <Text>
                            {optionBPercentage.toFixed(1)}% ({topic.optionBVotes} votes)
                        </Text>
                        <Progress value={optionBPercentage} colorScheme="green" mt={2} />
                    </Box>
                </Flex>

                <Text mt={4} color="gray.600">
                    Total votes: {totalVotes}
                </Text>
            </Box>
        </Container>
    );
};

export default Topic;
