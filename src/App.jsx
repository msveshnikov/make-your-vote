import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext } from 'react';
import { Landing } from './Landing';
import Vote from './Vote.jsx';

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://makeyour.vote';
export const AuthContext = createContext(null);

function App() {
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
