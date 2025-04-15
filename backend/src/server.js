// server.js
import express from 'express';
import cors from 'cors';
import { catalog } from './mock-products.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/products', (req, res) => {
    try {
        catalog.products.forEach(product=>console.log(product))
        res.status(200).json(catalog.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
