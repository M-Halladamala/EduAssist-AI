# 🚀 Quick Start Guide

## Instant Setup (No API Keys Needed!)

Your EduAssist-AI chatbot is **ready to use right now** with intelligent educational responses!

### 1. Start the Chatbot
```bash
npm start
```

### 2. Open in Browser
Visit: **http://localhost:3001**

### 3. Start Learning!
The chatbot works immediately with smart educational responses for:
- ✅ Math problems and explanations
- ✅ Science concepts (Physics, Chemistry, Biology)
- ✅ Writing and grammar help
- ✅ History questions and analysis
- ✅ Study techniques and planning
- ✅ Homework assistance

## 🔥 Upgrade Options (For Even Better Responses)

### Option 1: Install Local LLM (Best - Completely Free)
```bash
# 1. Install Ollama from https://ollama.ai/download
# 2. Install a model:
ollama pull llama3.2:3b

# 3. Restart the chatbot - it will automatically use Ollama!
```

### Option 2: Add Free API Keys
Get free API keys from:
- **Groq**: https://console.groq.com/ (Fast & generous free tier)
- **OpenRouter**: https://openrouter.ai/ (Free tier available)

Add them to your `.env` file:
```
GROQ_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

## 🎯 What Makes This Special

### Smart Without AI
Even without any LLM setup, the chatbot provides:
- **Math solver**: Solves basic equations step-by-step
- **Subject expertise**: Tailored responses for different subjects
- **Study guidance**: Proven learning techniques and tips
- **Educational focus**: Always encourages learning over just answers

### Multiple LLM Fallbacks
The system automatically tries:
1. Local Ollama (if installed)
2. Groq API (if configured)
3. Free online LLMs
4. Intelligent educational responses

### Privacy & Cost
- **Local Ollama**: 100% private, unlimited usage
- **Free APIs**: Generous free tiers
- **Fallback responses**: No external calls, completely private

## 🧪 Test It Now

Try these questions to see the intelligent responses:

**Math**: "What is 15 + 27?"
**Science**: "Explain photosynthesis"
**Writing**: "Help me write an essay introduction"
**Study**: "How should I prepare for my history exam?"

## 🔧 Troubleshooting

### Server Won't Start
- Make sure port 3001 is available
- Run `npm install` if you see missing dependencies

### Want Better AI Responses?
1. Install Ollama (see `install-ollama.md`)
2. Or add free API keys to `.env`
3. Restart the server

### Need Help?
- Check the console logs for detailed information
- All LLM attempts are logged so you can see what's working
- The fallback responses are designed to be helpful even without AI

## 🎉 You're Ready!

Your educational AI chatbot is working right now. Start with the intelligent responses, then upgrade to full LLM power when you're ready!