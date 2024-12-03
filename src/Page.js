import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from "./Footer";

import './scss/Page.scss';

function Page() {
    const { id, alias } = useParams(); // Extract id or alias from the URL
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let endpoint;

        if (id) {
            // If we have a node ID, fetch by node ID
            endpoint = `${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/node/page?filter[drupal_internal__nid]=${id}`;
        } else if (alias) {
            // If we have an alias, fetch by alias
            endpoint = `${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/node/page?filter[path][alias]=/${alias}`;
        }

        if (endpoint) {
            axios.get(endpoint)
                .then(response => {
                    const page = response.data.data[0]; // Access the first item
                    setPageData(page);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching page:", error);
                    setLoading(false);
                });
        }
    }, [id, alias]);

    if (loading) return <p>Loading...</p>;
    if (!pageData || !pageData.attributes) return <p>Page not found.</p>;

    return (
        <div id="main-wrapper" className="main-wrapper">
            <h1 class="title page-title">{pageData.attributes.title}</h1>
            <div
                dangerouslySetInnerHTML={{ __html: pageData.attributes.body.processed }}
            ></div>
            {/* Render the Footer component here */}
            <Footer />
        </div>
    );
}

export default Page;
