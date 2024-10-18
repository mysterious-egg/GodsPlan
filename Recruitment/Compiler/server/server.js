// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supported languages and their JDoodle API identifiers
const languageMapping = {
    python3: { code: 'python3', versionIndex: '3' },
    cpp: { code: 'cpp', versionIndex: '4' },
    java: { code: 'java', versionIndex: '4' },
    nodejs: { code: 'nodejs', versionIndex: '4' },
    c: { code: 'c', versionIndex: '5' },
    csharp: { code: 'csharp', versionIndex: '4' },
};

// Compile and execute endpoint
app.post('/api/compile', async (req, res) => {
    const { code, language } = req.body;

    if (!languageMapping[language]) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const { code: langCode, versionIndex } = languageMapping[language];

    try {
        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: code,
            language: langCode,
            versionIndex: versionIndex,
            stdin: "",
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error during compilation:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'Compilation failed',
            details: error.response ? error.response.data : error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
