# Install Ollama for Free Local LLM

Ollama allows you to run LLMs completely free on your local machine!

## Windows Installation

### Option 1: Download Installer (Recommended)
1. Visit [https://ollama.ai/download](https://ollama.ai/download)
2. Download the Windows installer
3. Run the installer and follow the setup wizard
4. Ollama will start automatically

### Option 2: Command Line (if you have winget)
```bash
winget install Ollama.Ollama
```

## After Installation

### 1. Install a Model
Open Command Prompt or PowerShell and run:

```bash
# Install a small, fast model (1.7GB)
ollama pull llama3.2:1b

# Or install a larger, more capable model (2GB)
ollama pull llama3.2:3b

# Or install a very small model (1.4GB)
ollama pull phi3:mini
```

### 2. Test the Installation
```bash
# Test if Ollama is running
ollama list

# Chat with the model directly (optional)
ollama run llama3.2:3b
```

### 3. Start EduAssist-AI
Once Ollama is installed and a model is downloaded:
```bash
npm start
```

The chatbot will automatically detect and use your local Ollama installation!

## Benefits of Local LLM
- ✅ **Completely Free** - No API costs
- ✅ **Privacy** - Data stays on your machine
- ✅ **No Rate Limits** - Use as much as you want
- ✅ **Works Offline** - No internet required after setup
- ✅ **Fast Responses** - Direct local processing

## Troubleshooting

### Ollama Not Starting
- Make sure Ollama service is running: `ollama serve`
- Check if port 11434 is available
- Restart your computer after installation

### Model Download Issues
- Ensure you have enough disk space (2-4GB per model)
- Check your internet connection
- Try a smaller model first: `ollama pull phi3:mini`

### EduAssist-AI Not Connecting
- Verify Ollama is running: visit http://localhost:11434 in browser
- Check the console logs for connection errors
- Make sure you've pulled at least one model

## Alternative: Use Free Online APIs

If you prefer not to install Ollama, the chatbot will automatically try these free options:
1. OpenRouter (free tier)
2. Hugging Face Inference API
3. Intelligent fallback responses

No setup required for these options!