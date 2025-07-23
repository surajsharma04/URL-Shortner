//  how to run:
//  cd backend
//  npm init -y
//  npm install express cors sqlite3 nanoid valid-url
//  npm start
// Developed a URL shortening web app using Node.js, Express, SQLite, and vanilla JavaScript, allowing users to convert long URLs into short, shareable links.

// Implemented a REST API with URL validation, short code generation (using nanoid), and database storage for original and shortened URLs.

// Designed a responsive frontend UI with real-time feedback, copy-to-clipboard functionality, and smooth user experience using HTML, CSS, and JavaScript.

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // To parse JSON request bodies
app.use(express.static('../frontend')); // Serve the frontend files

// --- Database Setup ---
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        // Create the 'urls' table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS urls (
            short_code TEXT PRIMARY KEY,
            long_url TEXT NOT NULL UNIQUE
        )`);
    }
});

// --- API Endpoints ---

/**
 * @route POST /shorten
 * @desc Create a short URL
 */
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = `http://localhost:${PORT}`;

    // Validate the long URL
    if (!validUrl.isUri(longUrl)) {
        return res.status(400).json({ error: 'Invalid URL provided.' });
    }

    const checkIfExistsQuery = `SELECT short_code FROM urls WHERE long_url = ?`;

    db.get(checkIfExistsQuery, [longUrl], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.', details: err.message });
        }

        // Functionality: Prevent duplicate short URLs for the same original URL.
        if (row) {
            const shortUrl = `${baseUrl}/${row.short_code}`;
            return res.status(200).json({ 
                short_url: shortUrl,
                message: "Short URL for this link already exists."
            });
        } else {
            // If it's a new URL, generate a code and insert it
            const shortCode = nanoid(7); // Generate a 7-character unique ID
            const insertQuery = `INSERT INTO urls (long_url, short_code) VALUES (?, ?)`;

            db.run(insertQuery, [longUrl, shortCode], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create short URL.', details: err.message });
                }
                
                const shortUrl = `${baseUrl}/${shortCode}`;
                res.status(201).json({ short_url: shortUrl });
            });
        }
    });
});

/**
 * @route GET /:shortCode
 * @desc Redirect to the original long URL
 */
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const selectQuery = `SELECT long_url FROM urls WHERE short_code = ?`;

    db.get(selectQuery, [shortCode], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.', details: err.message });
        }
        
        // Functionality: Redirect to the original URL.
        if (row) {
            return res.redirect(302, row.long_url);
        } else {
            return res.status(404).json({ error: 'Short URL not found.' });
        }
    });
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});