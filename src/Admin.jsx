import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useToast,
    Input,
    HStack,
    Card,
    CardBody,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Badge,
    Text,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    VStack,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    SimpleGrid,
    Progress,
    Link,
    Box,
    Heading,
    Flex,
    Divider
} from '@chakra-ui/react';
import { DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { API_URL } from './App';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [topics, setTopics] = useState([]);
    const [users, setUsers] = useState([]);
    const [votes, setVotes] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTopics: 0,
        totalVotes: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });
    const cancelRef = React.useRef();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch dashboard stats',
                status: 'error',
                duration: 3000
            });
        }
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [topicsRes, usersRes, votesRes] = await Promise.all([
                fetch(`${API_URL}/api/topics?q=${searchTerm}&limit=100`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/votes`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const [topicsData, usersData, votesData] = await Promise.all([
                topicsRes.json(),
                usersRes.json(),
                votesRes.json()
            ]);

            setTopics(topicsData.topics);
            setUsers(usersData);
            setVotes(votesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch data',
                status: 'error',
                duration: 3000
            });
        }
    };

    const confirmDelete = (id, type) => {
        setItemToDelete({ id, type });
        setIsDeleteAlertOpen(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/${itemToDelete.type}/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            toast({
                title: 'Success',
                description: `${itemToDelete.type} deleted successfully`,
                status: 'success',
                duration: 3000
            });

            fetchData();
            fetchStats();
        } catch (error) {
            console.error('Error deleting item:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete item',
                status: 'error',
                duration: 3000
            });
        } finally {
            setIsDeleteAlertOpen(false);
            setItemToDelete({ id: null, type: null });
        }
    };

    const renderDemographicsInsights = () => (
        <Box mt={8}>
            <Heading size="md" mb={4}>
                Demographics Insights
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                <Card>
                    <CardBody>
                        <Heading size="sm" mb={4}>
                            Top countryCodes
                        </Heading>
                        {stats?.demographics?.map((a) => (
                            <Box key={a._id} mb={2}>
                                <Flex justify="space-between">
                                    <Text>{a._id}</Text>
                                    <Text>{a.count}</Text>
                                </Flex>
                                <Progress value={a.count} size="sm" colorScheme="green" />
                            </Box>
                        ))}
                    </CardBody>
                </Card>
            </SimpleGrid>
        </Box>
    );

    return (
        <Container maxW="container.xl" py={8}>
            <StatGroup mb={8}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                    <Card>
                        <CardBody>
                            <Stat>
                                <StatLabel>Total Users</StatLabel>
                                <StatNumber>{stats?.stats?.totalUsers}</StatNumber>
                            </Stat>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <Stat>
                                <StatLabel>Total Topics</StatLabel>
                                <StatNumber>{stats?.stats?.totalTopics}</StatNumber>
                            </Stat>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <Stat>
                                <StatLabel>Total Votes</StatLabel>
                                <StatNumber>{stats?.stats?.totalVotes}</StatNumber>
                            </Stat>
                        </CardBody>
                    </Card>
                </SimpleGrid>
            </StatGroup>

            {renderDemographicsInsights()}

            <Divider my={8} />

            <Tabs>
                <TabList>
                    <Tab>Topics</Tab>
                    <Tab>Users</Tab>
                    <Tab>Votes</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <HStack mb={6}>
                            <Input
                                placeholder="Search topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                maxW="300px"
                            />
                        </HStack>

                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Title</Th>
                                    <Th>Options</Th>
                                    <Th>Total Votes</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {topics?.map((topic) => (
                                    <Tr key={topic._id}>
                                        <Td>
                                            <Link onClick={() => navigate(`/topic/${topic._id}`)}>
                                                {topic.title} <ExternalLinkIcon mx="2px" />
                                            </Link>
                                        </Td>
                                        <Td>
                                            <VStack align="start">
                                                <Text>{topic.optionA}</Text>
                                                <Progress
                                                    value={
                                                        (topic.optionAVotes /
                                                            (topic.optionAVotes +
                                                                topic.optionBVotes)) *
                                                        100
                                                    }
                                                    size="sm"
                                                    w="100px"
                                                />
                                                <Text>{topic.optionB}</Text>
                                                <Progress
                                                    value={
                                                        (topic.optionBVotes /
                                                            (topic.optionAVotes +
                                                                topic.optionBVotes)) *
                                                        100
                                                    }
                                                    size="sm"
                                                    w="100px"
                                                />
                                            </VStack>
                                        </Td>
                                        <Td>{topic.optionAVotes + topic.optionBVotes}</Td>
                                        <Td>
                                            <Button
                                                colorScheme="red"
                                                size="sm"
                                                leftIcon={<DeleteIcon />}
                                                onClick={() => confirmDelete(topic._id, 'topics')}
                                            >
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TabPanel>

                    <TabPanel>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Joined</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {users?.map((user) => (
                                    <Tr key={user._id}>
                                        <Td>{user.email}</Td>
                                        <Td>
                                            <Badge colorScheme={user.isAdmin ? 'purple' : 'gray'}>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </Badge>
                                        </Td>
                                        <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                                        <Td>
                                            <Button
                                                colorScheme="red"
                                                size="sm"
                                                leftIcon={<DeleteIcon />}
                                                onClick={() => confirmDelete(user._id, 'users')}
                                            >
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TabPanel>

                    <TabPanel>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Topic</Th>
                                    <Th>Metadata</Th>
                                    <Th>Vote</Th>
                                    <Th>Date</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {votes?.map((vote) => (
                                    <Tr key={vote._id}>
                                        <Td>{vote?.topic?.title}</Td>
                                        <Td>{JSON.stringify(vote.metadata)}</Td>
                                        <Td>{vote.value}</Td>
                                        <Td>{new Date(vote.createdAt).toLocaleString()}</Td>
                                        <Td>
                                            <Button
                                                colorScheme="red"
                                                size="sm"
                                                leftIcon={<DeleteIcon />}
                                                onClick={() => confirmDelete(vote._id, 'votes')}
                                            >
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <AlertDialog
                isOpen={isDeleteAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsDeleteAlertOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Delete Confirmation</AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
};

export default Admin;
