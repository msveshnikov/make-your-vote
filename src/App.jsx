import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useEffect } from 'react';
import { Landing } from './Landing';
import Vote from './Vote.jsx';
import ReactGA from 'react-ga4';
import Topic from './Topic.jsx';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://makeyour.vote';
export const AuthContext = createContext(null);

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
    },
    styles: {
        global: {
            'html, body': {
                background: 'linear-gradient(to right, #f0f4f8, #ffffff)'
            }
        }
    }
});

function App() {
    useEffect(() => {
        ReactGA.initialize('G-T7EGMCRVTL');
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/app/*" element={<Vote />} />
                    <Route path="/topic/:id" element={<Topic />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
