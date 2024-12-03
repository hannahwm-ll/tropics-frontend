import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './scss/Page.scss';

function Home({ nodeId }) {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/node/page?filter[drupal_internal__nid]=${nodeId}`)
            .then(response => {
                // Since we are using a filter, response.data.data might be an array
                setPageData(response.data.data[0]); // Access the first item
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching page:", error);
                setLoading(false);
            });
    }, [nodeId]);

    if (loading) return <p>Loading...</p>;
    if (!pageData || !pageData.attributes) return <p>Page not found.</p>;

    return (
        <div id="main-wrapper" className="main-wrapper">
            <h1 className="title page-title">{pageData.attributes.title}</h1>
            <div
                dangerouslySetInnerHTML={{ __html: pageData.attributes.body.processed }}
            ></div>
        </div>
    );
}

export default Home;
