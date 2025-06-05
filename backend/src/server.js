// server.js
import express from 'express';
import cors from 'cors';
import {catalog} from './mock-products.js';
import dotenv from 'dotenv';
import {GoogleGenAI} from "@google/genai";
import {createClient} from '@supabase/supabase-js';

// Load environment variables first!
dotenv.config();

// Create a single supabase client AFTER loading environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Create conversations object
const conversations = {};

const app = express();
const PORT = process.env.PORT || 5000;

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

app.use(cors());
app.use(express.json());


// Example endpoint to fetch data (now protected)
app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select('*');

    if (error) {
        return res.status(500).json({error: error.message});
    }

    return res.json(data);
});

app.get('/response', async (req, res) => {
    const inputValue = req.query.inputValue;
    const messagesLength = req.query.messagesLength;
    const sessionId = req.query.sessionId || req.user.id || 'default';

    // Initialize conversation history if it doesn't exist
    if (!conversations[sessionId]) {
        conversations[sessionId] = [];
    }

    // Define your e-commerce context/system prompt
    const ecommerceContext = `
    It is very important that you don't invent anything. If you don't know something just say so.
    You can talk in English and in Spanish, always answer in the same language you were question.
    You are a helpful assistant for our e-commerce store "Cyber Gadgets". 
    Our store specializes in futuristic technological gadgets.
    Always be polite, helpful, and only answer questions related to our store and products.
    These are the products that we are offering right now: ${JSON.stringify(catalog.products, null, 2)}
    If asked about anything unrelated to our store, politely redirect the conversation to how you can help with shopping needs.
    Please don't hallucinate, think step by step.`;

    // Add user's new message to conversation history
    conversations[sessionId].push({role: "user", text: inputValue});

    // Create messages array with context and conversation history
    const messages = [
        {role: "system", text: ecommerceContext},
        ...conversations[sessionId].slice(-10) // Include up to last 10 messages to stay within context limits
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: messages,
        });

        // Add bot's response to conversation history
        conversations[sessionId].push({role: "model", text: response.text});

        res.status(200).json({
            id: messagesLength + 2,
            text: response.text,
            sender: "bot"
        });
    } catch (error) {
        res.status(500).json({error: "Failed to generate AI response."+error});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
