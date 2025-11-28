import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
        
        <meta name="theme-color" content="#800000" />
        <link rel="canonical" href="https://bawar-biryani.vercel.app/" />
        
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bawar Biryani" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Bawar Biryani",
              "description": "Authentic Afghani Pashtoon Biryani Restaurant",
              "servesCuisine": "Afghan",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ahmad sha baba mina kabul",
                "addressLocality": "Ahmad sha baba mina kabul Afghanistan 1012 Kabul",
                "addressCountry": "AF"
              },
              "telephone": "+93 78 981 4740",
              "email": "info@bawarbiryani.com"
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
