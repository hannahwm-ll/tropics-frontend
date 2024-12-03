import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Footer() {
    const [footerContent, setFooterContent] = useState(null);
    const [copyrightContent, setCopyrightContent] = useState(null);
    const [logos, setLogos] = useState([]);
    const [loadingFooter, setLoadingFooter] = useState(true);
    const [loadingCopyright, setLoadingCopyright] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/block_content/footer_top`)
            .then(response => {
                console.log("Footer Content:", response.data);
                const block = response.data.data[0];
                const logoRelationships = block.relationships.field_footer_logos.data || [];

                const logoPromises = logoRelationships.map(logo =>
                    axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/file/file/${logo.id}`)
                );

                Promise.allSettled(logoPromises).then(results => {
                    const urls = results
                        .filter(result => result.status === 'fulfilled')
                        .map(result => `${process.env.REACT_APP_DRUPAL_API_URL}${result.value.data.data.attributes.uri.url}`);
                    setLogos(urls);
                });

                setFooterContent(block.attributes); // Access the first item's attributes
                setLoadingFooter(false);
            })
            .catch(error => {
                console.error("Error fetching footer content:", error);
                setLoadingFooter(false);
            });

        axios.get(`${process.env.REACT_APP_DRUPAL_API_URL}/jsonapi/block_content/copyright`)
            .then(response => {
                console.log("Copyright Content:", response.data.data[0].attributes);
                setCopyrightContent(response.data.data[0].attributes); // Access the first item's attributes
                setLoadingCopyright(false);
            })
            .catch(error => {
                console.error("Error fetching copyright content:", error);
                setLoadingCopyright(false);
            });
    }, []);

    if (loadingFooter || loadingCopyright) return <p>Loading footer...</p>;

    return (
        <footer className="site-footer">
            <div className="site-footer__inner container">
                {footerContent && (
                    <>
                        <div>
                            <h4>{footerContent.field_footer_team_title}</h4>
                            <div dangerouslySetInnerHTML={{__html: footerContent.field_footer_team_list.value}}>
                            </div>
                        </div>
                        <div className="footer-logos">
                            {logos.map((url, index) => (
                                <img key={index} src={url} alt={`Logo ${index + 1}`} loading="lazy"/>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="copyright">
                {copyrightContent && (
                    <p>{copyrightContent.field_copyright_text}</p>
                )}
            </div>
        </footer>
    );
}

export default Footer;
