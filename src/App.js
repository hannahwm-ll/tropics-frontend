import React from 'react';
import Menu from './Menu';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Page from "./Page";
import Header from "./Header";
import Footer from "./Footer";
import './scss/global.scss';
function App() {
    return (
        <Router>
            <div id="page-wrapper" className="page-wrapper">
                <Header />
                <Menu />
                <Routes>
                    <Route path="/" element={<Home nodeId="2" />} />
                    {/* Dynamic route for pages based on node ID */}
                    <Route path="/node/:id" element={<Page />} />
                    {/* Dynamic route for alias-based paths */}
                    <Route path="/:alias" element={<Page />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
