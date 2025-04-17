// server.js
import express from 'express';
import cors from 'cors';
import {catalog} from './mock-products.js';
import dotenv from 'dotenv';
import {GoogleGenAI} from "@google/genai";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const ai = new GoogleGenAI({apiKey: process.env.API_KEY});


// Routes
app.get('/products', (req, res) => {
    try {
        res.status(200).json(catalog.products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get('/response', async (req, res) => {

    const inputValue = req.query.inputValue;
    const messagesLength = req.query.messagesLength

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: inputValue,
    });

    res.status(200).json({
        id: messagesLength + 2,
        text: response.text,
        sender: "bot"
    });

})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
