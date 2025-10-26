# Resume Screening System 

AI-powered resume screening application

## Features

- User Authentication (Sign up, Login, JWT with refresh tokens)
- Resume Upload (PDF, DOCX, TXT - batch processing)
- Intelligent Evaluation Engine
  - AI/ML Skills Detection (30%)
  - LLM Experience Detection (20%)
  - Python Proficiency (30%)
  - 5+ Years Experience (20%)
- MongoDB Database
- Results Dashboard 

## Scoring Algorithm

**Overall Score** = (AI/ML × 0.3) + (LLM × 0.2) + (Python × 0.3) + (Experience × 0.2)

### Categories:
- **AI/ML Match**: Machine learning, deep learning, etc.
- **LLM Match**: Large language models, transformers, GPT, etc.
- **Python Match**: Python.
- **5+ Years**: Work experience extraction from dates and mentions


## Setup Instructions

### Prerequisites
- create vertual env in backend and install requirments


4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5002/api
- MongoDB: mongodb+srv://purushottampradhan97:lcRZLmzd6LbWRfvV@cluster0.rmymiak.mongodb.net/resume_screening?retryWrites=true&w=majority&appName=Cluster0


### Application setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

##  API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Resumes (All Protected - Requires JWT)
- `POST /api/resumes/upload` - Upload and analyze resumes
- `GET /api/resumes` - Get all user's resumes
- `GET /api/resumes/<id>` - Get single resume
- `DELETE /api/resumes/<id>` - Delete resume
- `POST /api/resumes/batch/delete` - Delete multiple resumes
- `DELETE /api/resumes/clear-all` - Delete all resumes

##  Authentication

- JWT-based authentication
- Access tokens (1 hour expiry)
- Refresh tokens (30 days expiry)
- Automatic token refresh on 401 errors
- Secure password hashing with werkzeug

## Database Schema


##  Technologies

### Backend
- Flask 2.3.3
- Flask-JWT-Extended 4.5.2
- PyMongo 4.5.0
- PyPDF2 3.0.1
- python-docx 0.8.11
- Python 3.8+

### Frontend
- React 18.2.0
- React Router v6
- Axios 1.5.0
- Context API
- CSS3

### Database
- MongoDB 7.0


## Example Usage

1. **Sign Up**
   - Navigate to http://localhost:3000/signup
   - Enter email, name, password
   - Click "Sign Up"

2. **Upload Resumes**
   - Go to Dashboard
   - Click upload box
   - Select one or more PDF/DOCX/TXT files
   - Click "Upload & Analyze"

3. **View Results**
   - Results appear in form of tables
   - Delete individual resumes or clear all

##  Resume Evaluation Example

Input: Resume with "5 years Python development, TensorFlow, GPT-4 API integration"

Output:
```json
{
  "filename": "john_doe.pdf",
  "scores": {
    "ai_ml_match": 85.5,
    "llm_match": 72.3,
    "python_match": 95.2,
    "experience_match": 100.0
  },
  "overall_score": 88.3
}
```

## Key Assumptions

1. **MongoDB for Data Storage** - All data persisted in MongoDB
2. **JWT Authentication** - Stateless authentication with tokens
3. **Keyword-based Evaluation** - Uses keyword matching for skill detection
4. **User Isolation** - Each user sees only their own resumes
5. **File Upload Limit** - 16MB per file
6. **Supported Formats** - PDF, DOCX, TXT
7. **Token Storage** - localStorage (can be enhanced to secure cookies)
8. **Timezone** - UTC for all timestamps



