/**
 * CORS Middleware
 * Allows cross-origin requests from specified domains
 */

const allowedOrigins = [
    'https://bawar.sheen.af',
    'https://bawar.sheen.af/api',
    'http://localhost:3000',
    'http://localhost:3001',
];  

export function cors(req, res) {
    const origin = req.headers.origin;

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Allow credentials (cookies, authorization headers, etc.)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');

    // Allow specific headers
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, Authorization, Accept, Origin'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true; // Indicates preflight was handled
    }

    return false; // Continue with normal request
}
