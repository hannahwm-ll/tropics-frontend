import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './scss/Header.scss';

function Header() {
    const [siteInfo, setSiteInfo] = useState({ name: '', slogan: '' });
    const [brandingContent, setBrandingContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/api/site-info`)
            .then(response => {
                setSiteInfo(response.data);
            })
            .catch(error => {
                console.error("Error fetching site info:", error);
            });

        axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/block_content/mit_ll_branding`)
            .then(response => {
                if (response.data.data.length > 0) {
                    setBrandingContent(response.data.data[0].attributes); // Access the first item's attributes
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching branding content:", error);
                setLoading(false);
            });
    }, []);
    if (loading) return <p>Loading header...</p>;
    return (
        <header id="header" className="site-header">
            <div id="site-header__inner" className="site-header__inner">
                <div className="site-branding">
                    <div className="site-branding__inner">
                        <a href="/" rel="home" className="site-branding__logo">
                            <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt={`${siteInfo.name} Logo`} className="logo"/>
                        </a>
                        <h1 className="site-slogan">{siteInfo.slogan || 'Time-Resolved Observations of Precipitation structure and storm Intensity with a Constellation of Smallsats'}</h1>
                    </div>
                    <div id="block-tropics-branding">
                        <p className="brand__organization">
                            {brandingContent?.field_organization?.processed ||
                                brandingContent?.field_organization?.value ||
                                'Organization not available'}
                        </p>
                        <p className="brand__people">
                            {brandingContent?.field_people || 'People not available'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
