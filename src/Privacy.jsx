import {
    Box,
    Container,
    Heading,
    Text,
    Link,
    VStack,
    UnorderedList,
    ListItem,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Switch,
    FormControl,
    FormLabel,
    Stack,
    Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from './App';

const Privacy = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [lastUpdated, setLastUpdated] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [consentSettings, setConsentSettings] = useState({
        analytics: true,
        marketing: false,
        necessary: true,
        preferences: true,
        aiProcessing: false
    });

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                const response = await fetch(`${API_URL}/api/privacy/last-updated`);
                const data = await response.json();
                setLastUpdated(new Date(data.lastUpdated).toLocaleDateString());

                const savedConsent = localStorage.getItem('gdprConsent');
                if (savedConsent) {
                    setConsentSettings(JSON.parse(savedConsent));
                }
            } catch (error) {
                console.error('Error fetching privacy update:', error);
                setLastUpdated(new Date().toLocaleDateString());
            }
        };
        fetchLastUpdate();
    }, []);

    const handleConsentChange = async (setting) => {
        const newSettings = {
            ...consentSettings,
            [setting]: !consentSettings[setting]
        };
        setConsentSettings(newSettings);
        localStorage.setItem('gdprConsent', JSON.stringify(newSettings));

        if (token) {
            try {
                await fetch(`${API_URL}/api/user/privacy-settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(newSettings)
                });
            } catch (error) {
                console.error('Error updating privacy settings:', error);
            }
        }
    };

    const handleExportData = async () => {
        if (!token) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in to export your data.',
                status: 'warning',
                duration: 5000,
                isClosable: true
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user/data-export`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'makeyourvote-data.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: 'Data Exported',
                description: 'Your data has been downloaded successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
        } catch (error) {
            console.error('Data export error:', error);
            toast({
                title: 'Export Failed',
                description: 'Unable to export data. Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    };

    const handleDeleteAccount = async () => {
        if (!token) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in to delete your account.',
                status: 'warning',
                duration: 5000,
                isClosable: true
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Deletion failed');

            localStorage.removeItem('token');
            localStorage.removeItem('gdprConsent');
            setToken(null);
            window.location.href = '/';

            toast({
                title: 'Account Deleted',
                description: 'Your account has been successfully deleted.',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
        } catch (error) {
            console.error('Account deletion error:', error);
            toast({
                title: 'Deletion Failed',
                description: 'Unable to delete account. Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    };

    return (
        <Container maxW="container.lg" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">
                    Privacy Policy
                </Heading>
                <Text>Last updated: {lastUpdated}</Text>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Privacy Settings
                    </Heading>
                    <Stack spacing={4}>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="necessary" mb="0">
                                Essential Cookies
                            </FormLabel>
                            <Switch
                                id="necessary"
                                isChecked={consentSettings.necessary}
                                isDisabled
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="analytics" mb="0">
                                Analytics
                            </FormLabel>
                            <Switch
                                id="analytics"
                                isChecked={consentSettings.analytics}
                                onChange={() => handleConsentChange('analytics')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="marketing" mb="0">
                                Marketing
                            </FormLabel>
                            <Switch
                                id="marketing"
                                isChecked={consentSettings.marketing}
                                onChange={() => handleConsentChange('marketing')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="preferences" mb="0">
                                Preferences
                            </FormLabel>
                            <Switch
                                id="preferences"
                                isChecked={consentSettings.preferences}
                                onChange={() => handleConsentChange('preferences')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="aiProcessing" mb="0">
                                AI Processing
                            </FormLabel>
                            <Switch
                                id="aiProcessing"
                                isChecked={consentSettings.aiProcessing}
                                onChange={() => handleConsentChange('aiProcessing')}
                            />
                        </FormControl>
                    </Stack>
                </Box>

                <Divider />

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Data Collection
                    </Heading>
                    <UnorderedList spacing={2}>
                        <ListItem>User account information</ListItem>
                        <ListItem>Voting history and preferences</ListItem>
                        <ListItem>Usage analytics and interactions</ListItem>
                        <ListItem>Device and browser information</ListItem>
                        <ListItem>AI-processed content and recommendations</ListItem>
                    </UnorderedList>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Your Rights
                    </Heading>
                    <Text mb={4}>
                        Under GDPR and other privacy regulations, you have the right to:
                    </Text>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>Access your personal data</ListItem>
                        <ListItem>Correct inaccurate data</ListItem>
                        <ListItem>Request data deletion</ListItem>
                        <ListItem>Object to data processing</ListItem>
                        <ListItem>Data portability</ListItem>
                    </UnorderedList>
                    <Button colorScheme="blue" onClick={handleExportData} mr={4}>
                        Export Data
                    </Button>
                    <Button colorScheme="red" onClick={onOpen}>
                        Delete Account
                    </Button>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Contact Information
                    </Heading>
                    <Text mb={4}>
                        For privacy-related inquiries, contact our Data Protection Officer at:{' '}
                        <Link href="mailto:privacy@makeyour.vote" color="blue.500">
                            privacy@makeyour.vote
                        </Link>
                    </Text>
                    <Link as={RouterLink} to="/terms" color="blue.500">
                        Terms of Service
                    </Link>
                </Box>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Account Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text mb={4}>
                            This action will permanently delete your account and all associated
                            data. This cannot be undone. Are you sure?
                        </Text>
                        <Button colorScheme="red" mr={3} onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Privacy;
