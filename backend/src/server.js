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

// Middleware to verify JWT token from Supabase
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    try {
        // Verify the JWT token using Supabase
        const {data: {user}, error} = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(403).json({error: 'Invalid or expired token'});
        }

        // Add the user information to the request
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({error: 'Token verification failed'});
    }
};
// Required backend modifications (server.js updates)

// Add this to your existing server.js file at the appropriate location

// Middleware to refresh token if needed
const refreshToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(); // No token, proceed to next middleware
    }

    try {
        // Check token expiration
        const {data, error} = await supabase.auth.getUser(token);

        if (error) {
            // If token is expired or invalid, try to refresh it
            const refreshResult = await supabase.auth.refreshSession();

            if (refreshResult.data && refreshResult.data.session) {
                // Set the new token in the response headers
                res.setHeader('X-New-Token', refreshResult.data.session.access_token);
            }
        }

        next();
    } catch (error) {
        console.error('Token refresh error:', error);
        next();
    }
};

// Use this middleware before protected routes
app.use('/api/user/*', refreshToken);

// You might also want to update the profile route to create a profile on first login
// Update your profile GET endpoint to create a profile if it doesn't exist
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        // Check if profile exists
        let {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            // Profile doesn't exist, create a new one
            const newProfile = {
                id: req.user.id,
                full_name: '',
                username: '',
                avatar_url: '',
                created_at: new Date(),
                updated_at: new Date(),
            };

            const {error: insertError} = await supabase
                .from('profiles')
                .insert(newProfile);

            if (insertError) throw insertError;

            data = newProfile;
        } else if (error) {
            throw error;
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({error: error.message});
    }
});

// Auth endpoints
app.post('/api/signup', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    try {
        const {data, error} = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm the email
        });

        if (error) throw error;

        return res.status(201).json({message: 'User created successfully', user: data.user});
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(400).json({error: error.message});
    }
});

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    try {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return res.status(200).json({
            message: 'Login successful',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(401).json({error: error.message});
    }
});

app.post('/api/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    try {
        // Sign out using Supabase
        const {error} = await supabase.auth.admin.signOut(token);

        if (error) throw error;

        return res.status(200).json({message: 'Logout successful'});
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({error: error.message});
    }
});

// User profile endpoint (protected route)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        // Fetch user profile data from Supabase
        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        return res.status(200).json(data || {id: req.user.id});
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({error: error.message});
    }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
    const {fullName, username, avatar_url} = req.body;

    try {
        // Update user profile in Supabase
        const profile = {
            id: req.user.id,
            full_name: fullName,
            username,
            avatar_url,
            updated_at: new Date(),
        };

        const {error} = await supabase
            .from('profiles')
            .upsert(profile)
            .eq('id', req.user.id);

        if (error) throw error;

        return res.status(200).json({message: 'Profile updated successfully', profile});
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({error: error.message});
    }
});

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
        res.status(500).json({error: "Failed to generate AI response."});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
