# Credit Memo Analysis Platform - Team Sparkx

An AI-powered credit analysis platform that processes PDF documents and extracts financial insights, risks, and key metrics using Google's Gemini AI.

## 🚀 Features

- **PDF Upload & Analysis**: Upload credit memos and financial documents for automated analysis
- **AI-Powered Insights**: Leverages Google Gemini AI to extract:
  - Executive summaries
  - Risk assessments with severity levels
  - Key financial metrics with confidence scores
- **Real-time Analysis**: Interactive dashboard showing analysis results
- **Caching System**: Prevents duplicate analysis of same documents
- **Rate Limiting**: Built-in protection against API abuse

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google API Key** - [Get API Key](https://makersuite.google.com/app/apikey)

## 🛠️ Project Structure

```
credit-memo-gen/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/          # Flask backend API
    ├── app.py              # Main Flask application
    ├── ai_config.py        # Gemini AI wrapper
    ├── auth.py             # Authentication endpoints
    ├── models.py           # Database models
    ├── requirements.txt    # Python dependencies
    └── .env               # Environment variables (create this)
```

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd mclaren-hackathon-Sparkx
```

### 2️⃣ Backend Setup (Python/Flask)

#### Navigate to Server Directory
```bash
cd credit-memo-gen/server
```

#### Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Create Environment File
Create a `.env` file in the `server` directory with the following content:

```env
# Google Gemini AI Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Flask Configuration
JWT_SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///credit_analyst.db

# Flask Settings
FLASK_ENV=development
FLASK_DEBUG=True
```

**Important**: Replace `your_google_api_key_here` with your actual Google API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### Initialize Database
The database will be created automatically when you first run the server. A demo user will be created with:
- Username: `demo`
- Password: `demo`

### 3️⃣ Frontend Setup (React/Vite)

Open a **new terminal window** and navigate to the client directory:

```bash
cd credit-memo-gen/client
```

#### Install Node Dependencies
```bash
npm install
```

---

## ▶️ Running the Application

You need to run **both** the backend and frontend servers simultaneously.

### Start Backend Server

In the `credit-memo-gen/server` directory:

```bash
# Make sure virtual environment is activated (if using one)
# Windows
venv\Scripts\activate

# Then run the server
python app.py
```

You should see:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

**Backend will be running on**: `http://127.0.0.1:5000`

### Start Frontend Server

In a **separate terminal**, navigate to `credit-memo-gen/client`:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend will be running on**: `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📖 How to Use

1. **Open Application**: Navigate to `http://localhost:5173` in your browser

2. **Upload PDF**: 
   - Click the upload zone or drag and drop a PDF document
   - Supported formats: PDF files (credit memos, financial statements, etc.)

3. **View Analysis**:
   - The PDF will be displayed on the left
   - Analysis results appear on the right, including:
     - Executive Summary
     - Risk Assessment with severity levels
     - Financial Metrics with confidence scores

4. **Interactive Dashboard**:
   - View charts and visualizations
   - Navigate through different sections
   - Use the floating chatbot for questions (if enabled)

---

## 🔑 API Endpoints

### Analysis Endpoint
```
POST /analyze
Content-Type: multipart/form-data

Request Body:
- file: PDF file (multipart upload)

Response:
{
  "executive_summary": "...",
  "risks": [
    {
      "title": "Risk Name",
      "description": "...",
      "severity": "High/Medium/Low",
      "source_page": 1,
      "confidence": "High"
    }
  ],
  "metrics": [
    {
      "label": "Metric Name",
      "value": "$10M",
      "source_page": 1,
      "confidence": "High"
    }
  ]
}
```

### Authentication Endpoints (Optional)
```
POST /api/auth/register
POST /api/auth/login
GET  /api/analysis/history
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Problem**: `NameError: name 'genai' is not defined`
```bash
# Solution: This has been fixed. Make sure you have the latest version of app.py
```

**Problem**: Database errors
```bash
# Solution: Delete the database and let it recreate
rm instance/credit_analyst.db
python app.py
```

**Problem**: `GOOGLE_API_KEY not found`
```bash
# Solution: Make sure .env file exists in server directory with valid API key
```

### Frontend Issues

**Problem**: `Failed to load resource: 401 (UNAUTHORIZED)`
```bash
# Solution: This has been fixed. Authentication is disabled for demo mode
```

**Problem**: `Failed to load resource: 500 (INTERNAL SERVER ERROR)`
```bash
# Solution: Check the Python terminal for error details
# Make sure backend server is running
# Verify GOOGLE_API_KEY is set correctly in .env
```

**Problem**: Cannot connect to backend
```bash
# Solution: Verify backend is running on http://127.0.0.1:5000
# Check that CORS is enabled in app.py
```

### Port Conflicts

If ports 5000 or 5173 are already in use:

**Backend** - Edit `app.py`:
```python
app.run(debug=True, port=5001)  # Change to different port
```

**Frontend** - Edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 5174  // Change to different port
  }
})
```

---

## 📦 Dependencies

### Backend (Python)
- Flask - Web framework
- Flask-CORS - Cross-origin resource sharing
- Flask-JWT-Extended - JWT authentication
- Flask-Limiter - Rate limiting
- Flask-Bcrypt - Password hashing
- Flask-SQLAlchemy - Database ORM
- Flask-Migrate - Database migrations
- pdfplumber - PDF text extraction
- python-dotenv - Environment variable management
- requests - HTTP library for API calls

### Frontend (React)
- React 18 - UI library
- Vite - Build tool and dev server
- Axios (if used) - HTTP client

---

## 🔒 Security Notes

- **Authentication**: Currently disabled for demo purposes
  - To enable: Uncomment `@jwt_required()` decorators in `app.py`
  - Use `/api/auth/login` endpoint to get JWT token
- **Rate Limiting**: 5 requests per minute per IP
- **API Keys**: Never commit `.env` file to version control
- **Production**: Use a proper WSGI server (gunicorn, waitress) instead of Flask dev server

---

## 🚀 Production Deployment

For production deployment:

1. **Backend**:
   - Use a production WSGI server (gunicorn/waitress)
   - Set `FLASK_ENV=production`
   - Use PostgreSQL instead of SQLite
   - Enable authentication
   - Set strong JWT_SECRET_KEY

2. **Frontend**:
   - Build production bundle: `npm run build`
   - Serve with nginx or similar
   - Update API endpoint URLs

3. **Environment Variables**:
   - Use proper secret management
   - Enable HTTPS
   - Configure proper CORS settings

---

## 👥 Team Sparkx

McLaren Hackathon 2026

---

## 📄 License

[Your License Here]

---

