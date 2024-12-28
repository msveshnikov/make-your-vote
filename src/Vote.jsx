import { useState } from 'react';
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
    Grid,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText
} from '@chakra-ui/react';
import { FaVoteYea, FaChartLine, FaUsers, FaGlobeAmericas } from 'react-icons/fa';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false
    },
    styles: {
        global: {
            body: {
                bg: 'white'
            }
        }
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'normal'
            },
            variants: {
                solid: {
                    bg: 'blue.400',
                    color: 'white',
                    _hover: {
                        bg: 'blue.500'
                    }
                }
            }
        }
    }
});

function Vote() {
    const [activeTopics] = useState([
        {
            id: 1,
            title: 'Current Events',
            votes: 1200,
            participants: 450,
            category: 'News'
        },
        {
            id: 2,
            title: 'Sports',
            votes: 800,
            participants: 320,
            category: 'Entertainment'
        },
        {
            id: 3,
            title: 'Society',
            votes: 950,
            participants: 380,
            category: 'Social'
        }
    ]);

    const stats = [
        {
            icon: FaUsers,
            label: 'Active Users',
            number: '10,000+',
            help: 'Growing community'
        },
        {
            icon: FaVoteYea,
            label: 'Total Votes',
            number: '160,000+',
            help: 'In just two weeks'
        },
        {
            icon: FaChartLine,
            label: 'Conversion Rate',
            number: '35%',
            help: 'Visitor to voter'
        },
        {
            icon: FaGlobeAmericas,
            label: 'Avg. Engagement',
            number: '16',
            help: 'Votes per user'
        }
    ];

    return (
        <ChakraProvider theme={theme}>
            <Box minH="100vh" bg="white" color="gray.800">
                <Container maxW="container.xl" py={12}>
                    <Flex justifyContent="space-between" alignItems="center" mb={12}>
                        <Flex alignItems="center" gap={3}>
                            <Icon as={FaVoteYea} w={8} h={8} color="blue.400" />
                            <Heading size="xl" fontWeight="bold" letterSpacing="tight">
                                MakeYour.vote
                            </Heading>
                        </Flex>
                    </Flex>

                    <VStack spacing={12} align="stretch">
                        <Box>
                            <Heading size="lg" mb={4} fontWeight="semibold" letterSpacing="tight">
                                The Definitive Source for Public Opinion
                            </Heading>
                            <Text fontSize="xl" color="gray.600" lineHeight="tall">
                                Unifying fragmented sentiment into official, actionable data
                            </Text>
                        </Box>

                        <Grid
                            templateColumns={{
                                base: '1fr',
                                md: 'repeat(2, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            }}
                            gap={8}
                        >
                            {stats.map((stat, index) => (
                                <Box
                                    key={index}
                                    p={6}
                                    bg="white"
                                    borderRadius="lg"
                                    shadow="sm"
                                    border="1px"
                                    borderColor="gray.100"
                                >
                                    <Stat>
                                        <Flex align="center" mb={2}>
                                            <Icon
                                                as={stat.icon}
                                                w={5}
                                                h={5}
                                                color="blue.400"
                                                mr={2}
                                            />
                                            <StatLabel fontSize="sm">{stat.label}</StatLabel>
                                        </Flex>
                                        <StatNumber fontSize="2xl" fontWeight="bold">
                                            {stat.number}
                                        </StatNumber>
                                        <StatHelpText>{stat.help}</StatHelpText>
                                    </Stat>
                                </Box>
                            ))}
                        </Grid>

                        <Box>
                            <Heading size="md" mb={6} fontWeight="semibold">
                                Trending Topics
                            </Heading>
                            <VStack spacing={4}>
                                {activeTopics.map((topic) => (
                                    <Box
                                        key={topic.id}
                                        p={8}
                                        borderRadius="xl"
                                        bg="white"
                                        shadow="sm"
                                        border="1px"
                                        borderColor="gray.100"
                                        w="100%"
                                        transition="all 0.2s"
                                        _hover={{ shadow: 'md' }}
                                    >
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <VStack align="start" spacing={2}>
                                                <Flex align="center" gap={2}>
                                                    <Heading size="md" fontWeight="medium">
                                                        {topic.title}
                                                    </Heading>
                                                    <Badge colorScheme="blue" variant="subtle">
                                                        {topic.category}
                                                    </Badge>
                                                </Flex>
                                                <Text fontSize="sm" color="gray.600">
                                                    {topic.votes.toLocaleString()} votes •{' '}
                                                    {topic.participants.toLocaleString()}{' '}
                                                    participants
                                                </Text>
                                            </VStack>
                                            <Button colorScheme="blue" size="md" borderRadius="lg">
                                                Vote Now
                                            </Button>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>

                        <Box textAlign="center" py={12}>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                px={12}
                                py={7}
                                fontSize="lg"
                                borderRadius="lg"
                                shadow="md"
                                _hover={{ shadow: 'lg' }}
                            >
                                Join the Discussion
                            </Button>
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </ChakraProvider>
    );
}

export default Vote;
