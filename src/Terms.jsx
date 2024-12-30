import {
    Box,
    Container,
    Heading,
    Text,
    Link,
    VStack,
    UnorderedList,
    ListItem
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from './App';

const Terms = () => {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(API_URL + '/api/terms/last-updated', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setLastUpdated(new Date(data.lastUpdated).toLocaleDateString());
            } catch {
                setLastUpdated(new Date().toLocaleDateString());
            }
        };
        fetchLastUpdate();
    }, []);

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">
                    Terms of Service
                </Heading>
                <Text>Last updated: {lastUpdated}</Text>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        1. Terms
                    </Heading>
                    <Text mb={4}>
                        By accessing MakeYour.vote, you agree to be bound by these terms of service
                        and agree that you are responsible for compliance with any applicable local
                        laws.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        2. Use License
                    </Heading>
                    <Text mb={4}>
                        Permission is granted to use MakeYour.vote for personal and commercial use
                        according to these terms and conditions. This is the grant of a license, not
                        a transfer of title.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        3. AI-Enhanced Features
                    </Heading>
                    <Text mb={4}>
                        Our platform utilizes artificial intelligence services including Google
                        Gemini for topic analysis and content recommendations. While we strive for
                        accuracy, we cannot guarantee the completeness or reliability of
                        AI-generated content.
                    </Text>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>Real-time topic suggestion</ListItem>
                        <ListItem>Contextual content recommendations</ListItem>
                        <ListItem>Automated trend detection</ListItem>
                        <ListItem>Natural language vote processing</ListItem>
                    </UnorderedList>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        4. User Content
                    </Heading>
                    <Text mb={4}>
                        Users retain ownership of content they create. By posting content, you grant
                        MakeYour.vote a worldwide license to use, copy, modify, and distribute that
                        content on our platform.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        5. Enterprise Services
                    </Heading>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>Enterprise API access</ListItem>
                        <ListItem>Premium analytics</ListItem>
                        <ListItem>Custom research</ListItem>
                        <ListItem>Private channels</ListItem>
                        <ListItem>Data services</ListItem>
                        <ListItem>White-label solutions</ListItem>
                        <ListItem>Consulting services</ListItem>
                    </UnorderedList>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        6. Liability
                    </Heading>
                    <Text mb={4}>
                        MakeYour.vote is not liable for any damages arising from the use or
                        inability to use our services, including but not limited to direct,
                        indirect, incidental, or consequential damages.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        7. Changes to Terms
                    </Heading>
                    <Text mb={4}>
                        We reserve the right to modify these terms at any time. Continued use of the
                        service after changes constitutes acceptance of the new terms.
                    </Text>
                </Box>

                <Box>
                    <Link as={RouterLink} to="/privacy" color="blue.500">
                        View Privacy Policy
                    </Link>
                </Box>
            </VStack>
        </Container>
    );
};

export default Terms;
