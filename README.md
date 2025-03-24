# Cyber Gadgets

A modern e-commerce demo built with React and Node.js.
It offers a catalog of fake futuristic and sci-fi products.

## Tech Stack

- **Frontend**: React + Vite, TailwindCSS, CSS Modules
- **Backend**: Node.js, Express
- **Database**: Supabase
- **Features**: AI chatbot (Gemini API)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm
- Supabase account
- Gemini API key

### Setup

1. Clone the repository
```bash
git clone https://github.com/JuanValeraDev/Cyber-Gadgets
cd cyber-gadgets
```

2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Configure environment variables
- Create `.env` files in both frontend and backend folders
- Add Supabase and Gemini API credentials

4. Run the application
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Project Structure

- `frontend/`: React SPA built with Vite
- `backend/`: Express API server connected to Supabase
