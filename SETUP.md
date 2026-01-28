# EduAssist-AI Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Free API Keys

#### Groq API (Recommended - Fast & Free)
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_...`)

#### Hugging Face API (Alternative - Free)
1. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Sign up for a free account
3. Create a new token with "Read" permissions
4. Copy the token (starts with `hf_...`)

### 3. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file and add your API keys
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here
PORT=3000
```

### 4. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

### 5. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## Features Overview

### 🤖 AI Chat Assistant
- General academic help and explanations
- Subject-specific guidance
- Study tips and motivation

### 📚 Homework Helper
- Step-by-step problem solving
- Subject-specific assistance
- Multiple academic levels supported

### ❓ Quiz Generator
- Custom quizzes on any topic
- Multiple difficulty levels
- Instant feedback and explanations

### 📅 Study Planner
- Personalized study schedules
- Goal-oriented planning
- Time management assistance

### ✍️ Writing Assistant
- Grammar and style feedback
- Structure improvement suggestions
- Academic writing support

## API Information

### Free Tier Limits
- **Groq**: Very generous free tier with fast responses
- **Hugging Face**: 1000 requests/month on free tier

### Supported Models
- **Groq**: LLaMA 3 8B (fast and accurate)
- **Hugging Face**: Various open-source models

## Troubleshooting

### Common Issues

1. **"No API keys configured" error**
   - Make sure you've created a `.env` file
   - Verify your API keys are correctly formatted
   - Restart the server after adding keys

2. **API rate limit exceeded**
   - Wait a few minutes before trying again
   - Consider getting additional free API keys
   - Upgrade to paid tiers if needed

3. **Connection errors**
   - Check your internet connection
   - Verify API keys are still valid
   - Try switching between Groq and Hugging Face

### Getting Help
- Check the console logs for detailed error messages
- Verify your API keys are active and have sufficient quota
- Make sure all dependencies are installed correctly

## Customization

### Adding New Features
- Modify `services/aiService.js` for AI logic
- Add new routes in `routes/` directory
- Update frontend in `public/` files

### Changing AI Models
- Update model names in `aiService.js`
- Adjust prompts for different model capabilities
- Test thoroughly with your specific use cases

## Deployment

### Local Network Access
```bash
# Allow access from other devices on your network
NODE_ENV=production PORT=3000 npm start
```

### Cloud Deployment
The app is ready for deployment on:
- Heroku
- Vercel
- Railway
- DigitalOcean App Platform

Make sure to set environment variables in your deployment platform.

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure and don't share them
- Regularly rotate your API keys
- Monitor your API usage to prevent unexpected charges

## Support

For issues or questions:
1. Check this setup guide
2. Review the troubleshooting section
3. Check API provider documentation
4. Create an issue in the project repository