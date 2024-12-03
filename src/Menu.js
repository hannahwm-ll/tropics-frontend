import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './scss/Menu.scss';

function Menu() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [homeTitle, setHomeTitle] = useState('');

    useEffect(() => {
        // Fetch the list of pages for the menu
        axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/node/page`)
            .then(response => {
                const homePage = response.data.data.find(page => page.attributes.drupal_internal__nid === 2);
                if (homePage) {
                    setHomeTitle(homePage.attributes.title);
                }
                const filteredPages = response.data.data.filter(page => page.attributes.drupal_internal__nid !== 2);
                setPages(filteredPages);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching pages for menu:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading menu...</p>;

    return (
        <nav className="primary-nav">
            <ul className="primary-nav__menu">
                <li>
                    <Link to="/">{homeTitle || "Home"}</Link>
                </li>
                {pages.map(page => (
                    <li key={page.id}>
                        <Link to={`/node/${page.attributes.drupal_internal__nid}`}>
                            {page.attributes.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Menu;
