import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useEffect } from 'react';
import { Landing } from './Landing';
import Vote from './Vote.jsx';
import ReactGA from 'react-ga4';

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://makeyour.vote';
export const AuthContext = createContext(null);

function App() {
    useEffect(() => {
        ReactGA.initialize('G-8B86H1JDH1');
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/app/*" element={<Vote />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
