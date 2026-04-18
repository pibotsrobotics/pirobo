import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description = "Pi Robo - Master Robotics, AI & Coding. Empowering School & College Students with future-ready skills in Robotics, AI, Coding, and IoT.", 
  keywords = "robotics, AI, coding, courses, workshops, internships, students, tech education, Pi Robo, Kerala, Makerhub",
  url = "https://www.pibots.in",
}) => {
  const siteTitle = title ? `${title} | Pi Robo` : 'Pi Robo - Robotics & AI Education';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
