import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import 'dotenv/config';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const app = express();
const PORT = 4000;


// Replace these with your actual credentials
const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = 'http://localhost:8080'; // e.g. http://localhost:3000

app.use(cors());
app.use(bodyParser.json());


// Initialize the Bedrock client
const bedrockClient = new BedrockRuntimeClient({
    region: "ap-southeast-1", // Change to your preferred region
});

// Exchange auth code for access token
app.post('/api/google/exchange-code', async(req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Missing code' });

    const params = new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
    });

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });
        const data = await response.json();
        if (data.error) {
            return res.status(400).json({ error: data.error, details: data });
        }
        res.json({ access_token: data.access_token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to exchange code', details: err });
    }
});

// (Optional) Proxy Google Forms API requests
app.get('/api/google/forms/:formId', async(req, res) => {
    const { formId } = req.params;
    const { access_token } = req.query;
    if (!access_token) return res.status(400).json({ error: 'Missing access_token' });

    try {
        const response = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch form', details: err });
    }
});

app.post('/api/generate_question', async (req, res) => {
    const { surveySchema } = req.body;
    // Load prompt template
    const template = await fs.readFile('./generate_prompt.txt', 'utf8');

    // Inject dynamic schema
    const prompt = template.replace('{{schema}}', JSON.stringify(surveySchema, null, 2));
    // const response = await fetch('http://localhost:11434/api/generate', {
    //     method: 'POST',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     //   'Authorization': `Basic ${Buffer.from('admin:Kudatanya-123').toString('base64')}`,
    //     },
    //     body: JSON.stringify({ model:'deepseek-r1:latest', stream:false, prompt }),
    // });
    console.log(prompt)
    try {
        // Prepare the request body for Bedrock
        // Note: Different models have different input formats
        // This example uses Claude 3 format - adjust based on your chosen model
        const requestBody = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4000,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        // Create the invoke model command
        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0", // Replace with your preferred model
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(requestBody)
        });

        // Invoke the model
        const response = await bedrockClient.send(command);
        // Parse the response
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        console.log(responseBody);
        res.json(responseBody.content[0].text);

    } catch (error) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch form', details: err });
    }
   

   
});

app.post('/api/validate_answer', async (req, res) => {
    const { surveySchema, convoSchema } = req.body;
        // Load prompt template
    const template = await fs.readFile('./validate_prompt.txt', 'utf8');
    console.log(template.replace('{{conversational}}', JSON.stringify(convoSchema, null, 2)))
    // Inject dynamic conversation
    const prompt = template
    .replace('{{conversational}}', JSON.stringify(convoSchema, null, 2))
    .replace('{{survey}}', JSON.stringify(surveySchema, null, 2));
    try {
        // Prepare the request body for Bedrock
        // Note: Different models have different input formats
        // This example uses Claude 3 format - adjust based on your chosen model
        console.log(prompt)
        const requestBody = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4000,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        // Create the invoke model command
        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0", // Replace with your preferred model
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(requestBody)
        });

        // Invoke the model
        const response = await bedrockClient.send(command);
        // Parse the response
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        console.log(responseBody);
        res.json(responseBody.content[0].text);

    } catch (error) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch form', details: err });
    }
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});