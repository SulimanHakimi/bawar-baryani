const EXTERNAL_DATA_URL = 'http://localhost:5000/api/products';

function generateSiteMap(products) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>http://localhost:3000</loc>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>http://localhost:3000/menu</loc>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>http://localhost:3000/about</loc>
       <priority>0.7</priority>
     </url>
     ${products
       .map(({ _id }) => {
         return `
       <url>
           <loc>${`http://localhost:3000/product/${_id}`}</loc>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  try {
    const request = await fetch(EXTERNAL_DATA_URL);
    const products = await request.json();

    const sitemap = generateSiteMap(products);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}

export default SiteMap;
