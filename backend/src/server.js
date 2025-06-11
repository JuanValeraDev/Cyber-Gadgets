import express from 'express';
import cors from 'cors';
import {catalog} from './mock-products.js';
import dotenv from 'dotenv';
import {GoogleGenAI} from "@google/genai";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Objeto en memoria que almacena el historial de conversaciones por sesión
const conversations = {};

const app = express();
const PORT = process.env.PORT || 5000;

// Inicializa el cliente de la API de Gemini usando la clave del entorno
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// Middleware para permitir peticiones desde otros orígenes
app.use(cors());
// Middleware para analizar el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Ruta principal que maneja las respuestas generadas por la IA
app.get('/response', async (req, res) => {
    const inputValue = req.query.inputValue;
    const messagesLength = req.query.messagesLength;
    const sessionId = req.query.sessionId || req.user?.id || 'default';

    // Si no hay historial para la sesión, se crea un array vacío
    if (!conversations[sessionId]) {
        conversations[sessionId] = [];
    }

    // Contexto base que se le proporciona al modelo como prompt del sistema
    const ecommerceContext = `
    It is very important that you don't invent anything. If you don't know something just say so.
    You can talk in English and in Spanish, always answer in the same language you were question.
    You are a helpful assistant for our e-commerce store "Cyber Gadgets". 
    Our store specializes in futuristic technological gadgets.
    Always be polite, helpful, and only answer questions related to our store and products.
    These are the products that we are offering right now: ${JSON.stringify(catalog.products, null, 2)}
    If asked about anything unrelated to our store, politely redirect the conversation to how you can help with shopping needs.
    Please don't hallucinate, think step by step.`;

    // Se agrega el mensaje del usuario al historial
    conversations[sessionId].push({role: "user", text: inputValue});

    // Se crea el array de mensajes para enviar al modelo (contexto + últimos 10 intercambios)
    const messages = [
        {role: "system", text: ecommerceContext},
        ...conversations[sessionId].slice(-10)
    ];

    try {
        // Se genera la respuesta del modelo
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: messages,
        });

        // Se guarda la respuesta del modelo en el historial
        conversations[sessionId].push({role: "model", text: response.text});

        // Se devuelve la respuesta al cliente
        res.status(200).json({
            id: messagesLength + 2,
            text: response.text,
            sender: "bot"
        });
    } catch (error) {
        // Manejo de errores en caso de fallo de la API
        res.status(500).json({error: "Failed to generate AI response." + error});
    }
});

// Arranca el servidor y escucha en el puerto definido
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
