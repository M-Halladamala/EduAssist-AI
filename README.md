# EduAssist-AI

An AI-powered chatbot designed to help students, schools, and colleges improve academic performance through personalized assistance and educational support.

## Features

- **Study Assistant**: Get help with homework, explanations of complex topics
- **Quiz Generator**: Create practice quizzes on any subject
- **Study Planner**: Personalized study schedules and reminders
- **Research Helper**: Assistance with research projects and citations
- **Writing Assistant**: Help with essays, reports, and academic writing
- **Math Solver**: Step-by-step solutions for math problems
- **Language Learning**: Grammar checking and language practice

## AI Integration Options

EduAssist-AI tries multiple LLM options automatically:

### 1. **Local Ollama** (Recommended - Completely Free)
- Install Ollama locally for unlimited, private AI
- No API costs, no rate limits, works offline
- See `install-ollama.md` for setup instructions

### 2. **Free Online APIs**
- **Groq**: Fast LLaMA models with generous free tier
- **OpenRouter**: Free tier with LLaMA 3.2 models
- **Hugging Face**: Free inference API

### 3. **Intelligent Fallbacks**
- Smart educational responses without AI
- Subject-specific help and guidance
- Works even without any API setup

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express
- **AI Options**: 
  - Ollama (Local LLM - Free)
  - Groq API (Free LLaMA models)
  - OpenRouter (Free tier)
  - Hugging Face Inference API (Free tier)
- **Database**: JSON file storage (can be upgraded to MongoDB)

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your API keys in `.env`
4. Run the application: `npm start`
5. Open `http://localhost:3000` in your browser

## Free LLM Options

### Option 1: Local Ollama (Best - Completely Free)
1. Install Ollama: https://ollama.ai/download
2. Pull a model: `ollama pull llama3.2:3b`
3. Start EduAssist-AI: `npm start`

### Option 2: Free Online APIs
- Groq API (Free): https://console.groq.com/
- OpenRouter (Free tier): https://openrouter.ai/
- Hugging Face (Free): https://huggingface.co/settings/tokens

### Option 3: No Setup Required
- The chatbot includes intelligent fallback responses
- Works immediately without any API setup
- Provides educational help and guidance

## License

MIT License