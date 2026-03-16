AI Smart Learning - Demo ZIP
---------------------------

This archive contains a minimal runnable demo for the "AI Smart Learning Website":
- backend/ (Node/Express + MongoDB models + routes)
- frontend/ (React + Vite minimal app)
- emotion-service/ (Flask microservice; falls back to a simple predictor if TensorFlow is unavailable)

Quick start (local development)
1. Start MongoDB (local or update backend/.env to use Atlas)
2. Start emotion service:
   cd emotion-service
   python3 -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py

3. Start backend:
   cd backend
   npm install
   # edit .env (OPENAI_API_KEY) if you want chatbot functionality
   npm run dev

4. Start frontend:
   cd frontend
   npm install
   npm run dev

Notes:
- The emotion service ships with a fallback so it runs without TensorFlow; replace model.h5 with your trained Keras model to use real inference.
- The chatbot route forwards to OpenAI; set OPENAI_API_KEY in backend/.env to enable.
