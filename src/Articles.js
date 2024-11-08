import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch articles from Drupal JSON:API
        axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/node/article`)
            .then(response => {
                console.log("Fetched Data:", response.data); // Check here
                setArticles(response.data.data); // Store articles in state
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching articles:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Articles</h1>
            {articles.map(article => (
                <div key={article.id}>
                    <h2>{article.attributes.title}</h2>
                    <p>{article.attributes.body.value}</p>
                </div>
            ))}
        </div>
    );
}

export default Articles;
