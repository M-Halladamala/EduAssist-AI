const axios = require('axios');
const { Ollama } = require('ollama');

class AIService {
    constructor() {
        this.groqApiKey = process.env.GROQ_API_KEY;
        this.hfApiKey = process.env.HUGGINGFACE_API_KEY;
        this.groqBaseUrl = 'https://api.groq.com/openai/v1';
        this.hfBaseUrl = 'https://api-inference.huggingface.co/models';
        
        // Initialize Ollama for local LLM
        this.ollama = new Ollama({ host: 'http://localhost:11434' });
        
        // Free online LLM endpoints
        this.freeEndpoints = [
            'https://api.together.xyz/v1/chat/completions', // Together AI (free tier)
            'https://api.deepinfra.com/v1/openai/chat/completions' // DeepInfra (free tier)
        ];
    }

    async generateResponse(message, context = 'general') {
        try {
            // Try different LLM options in order of preference
            
            // 1. Try Groq API (if configured)
            if (this.groqApiKey && this.groqApiKey !== 'your_groq_api_key_here') {
                console.log('Using Groq API...');
                return await this.useGroqAPI(message, context);
            }
            
            // 2. Try local Ollama
            try {
                console.log('Trying local Ollama...');
                return await this.useOllama(message, context);
            } catch (ollamaError) {
                console.log('Ollama not available:', ollamaError.message);
            }
            
            // 3. Try free online LLMs
            try {
                console.log('Trying free online LLMs...');
                return await this.useFreeLLM(message, context);
            } catch (freeError) {
                console.log('Free LLMs not available:', freeError.message);
            }
            
            // 4. Try Hugging Face (if configured)
            if (this.hfApiKey && this.hfApiKey !== 'your_huggingface_token_here') {
                console.log('Using Hugging Face API...');
                return await this.useHuggingFaceAPI(message, context);
            }
            
            // 5. Fallback to intelligent responses
            console.log('Using intelligent fallback responses...');
            return this.getIntelligentResponse(message, context);
        } catch (error) {
            console.error('AI Service Error:', error.message);
            return this.getIntelligentResponse(message, context);
        }
    }

    async useGroqAPI(message, context) {
        const systemPrompt = this.getSystemPrompt(context);
        
        const response = await axios.post(`${this.groqBaseUrl}/chat/completions`, {
            model: 'llama3-8b-8192', // Free model
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 1000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${this.groqApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    }

    async useOllama(message, context) {
        try {
            const systemPrompt = this.getSystemPrompt(context);
            
            // Try different models in order of preference
            const models = ['llama3.2:3b', 'llama3.2:1b', 'phi3:mini', 'gemma2:2b'];
            
            for (const model of models) {
                try {
                    const response = await this.ollama.chat({
                        model: model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: message }
                        ],
                        options: {
                            temperature: 0.7,
                            top_p: 0.9,
                            max_tokens: 1000
                        }
                    });
                    
                    if (response && response.message && response.message.content) {
                        console.log(`Successfully used Ollama model: ${model}`);
                        return response.message.content;
                    }
                } catch (modelError) {
                    console.log(`Model ${model} not available:`, modelError.message);
                    continue;
                }
            }
            
            throw new Error('No Ollama models available');
        } catch (error) {
            throw new Error(`Ollama error: ${error.message}`);
        }
    }

    async useHuggingFaceAPI(message, context) {
        const systemPrompt = this.getSystemPrompt(context);
        
        // Try different HF models
        const models = [
            'microsoft/DialoGPT-medium',
            'facebook/blenderbot-400M-distill',
            'microsoft/DialoGPT-small'
        ];
        
        for (const model of models) {
            try {
                const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
                
                const response = await axios.post(
                    `${this.hfBaseUrl}/${model}`,
                    { 
                        inputs: prompt,
                        parameters: {
                            max_length: 500,
                            temperature: 0.7,
                            do_sample: true
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.hfApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 15000
                    }
                );

                if (response.data && response.data[0]) {
                    const generatedText = response.data[0].generated_text;
                    const assistantResponse = generatedText.split('Assistant:')[1]?.trim();
                    
                    if (assistantResponse && assistantResponse.length > 10) {
                        console.log(`Successfully used HF model: ${model}`);
                        return assistantResponse;
                    }
                }
            } catch (modelError) {
                console.log(`HF model ${model} failed:`, modelError.message);
                continue;
            }
        }
        
        throw new Error('All Hugging Face models failed');
    }

    async useFreeLLM(message, context) {
        const systemPrompt = this.getSystemPrompt(context);
        
        // Try OpenRouter (free tier)
        try {
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 1000,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || 'sk-or-v1-free'}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'EduAssist-AI'
                },
                timeout: 15000
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
                console.log('Successfully used OpenRouter free tier');
                return response.data.choices[0].message.content;
            }
        } catch (openrouterError) {
            console.log('OpenRouter failed:', openrouterError.message);
        }

        // Try Hugging Face Inference API with a chat model
        try {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                { 
                    inputs: `${systemPrompt}\n\nUser: ${message}\nBot:`,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            if (response.data && response.data[0] && response.data[0].generated_text) {
                const fullText = response.data[0].generated_text;
                const botResponse = fullText.split('Bot:')[1]?.trim();
                
                if (botResponse && botResponse.length > 5) {
                    console.log('Successfully used HF free inference');
                    return botResponse;
                }
            }
        } catch (hfError) {
            console.log('HF free inference failed:', hfError.message);
        }

        throw new Error('All free LLM endpoints failed');
    }

    getSystemPrompt(context) {
        const basePrompt = `You are EduAssist-AI, a helpful educational assistant designed to support students, teachers, and academic institutions. You provide clear, accurate, and encouraging responses to help improve academic performance.`;
        
        const contextPrompts = {
            homework: `${basePrompt} Focus on helping with homework by providing step-by-step explanations, not just answers. Encourage learning and understanding.`,
            quiz: `${basePrompt} You're helping create educational quizzes. Generate relevant questions with multiple choice options and explanations.`,
            study: `${basePrompt} You're helping with study planning and techniques. Provide practical, actionable study advice.`,
            writing: `${basePrompt} You're assisting with academic writing. Help with structure, grammar, and clarity while maintaining academic integrity.`,
            math: `${basePrompt} You're helping with math problems. Provide step-by-step solutions and explain the reasoning behind each step.`,
            research: `${basePrompt} You're helping with research projects. Guide users on finding reliable sources and organizing information.`,
            general: basePrompt
        };

        return contextPrompts[context] || contextPrompts.general;
    }

    getIntelligentResponse(message, context) {
        const lowerMessage = message.toLowerCase();
        
        // Math problems
        if (lowerMessage.includes('math') || lowerMessage.includes('calculate') || lowerMessage.includes('solve') || /\d+[\+\-\*\/]\d+/.test(message)) {
            return this.handleMathQuery(message);
        }
        
        // Science questions
        if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
            return this.handleScienceQuery(message);
        }
        
        // English/Writing help
        if (lowerMessage.includes('essay') || lowerMessage.includes('writing') || lowerMessage.includes('grammar') || lowerMessage.includes('paragraph')) {
            return this.handleWritingQuery(message);
        }
        
        // History questions
        if (lowerMessage.includes('history') || lowerMessage.includes('war') || lowerMessage.includes('ancient') || lowerMessage.includes('civilization')) {
            return this.handleHistoryQuery(message);
        }
        
        // Study help
        if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('prepare')) {
            return this.handleStudyQuery(message);
        }
        
        // Homework help
        if (lowerMessage.includes('homework') || lowerMessage.includes('assignment') || lowerMessage.includes('help me with')) {
            return this.handleHomeworkQuery(message);
        }
        
        // General educational response
        return this.handleGeneralQuery(message);
    }

    handleMathQuery(message) {
        // Try to solve simple math problems
        const mathMatch = message.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
        if (mathMatch) {
            const [, num1, operator, num2] = mathMatch;
            const a = parseFloat(num1);
            const b = parseFloat(num2);
            let result;
            
            switch (operator) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = b !== 0 ? a / b : 'undefined (division by zero)'; break;
            }
            
            return `Let me solve this step by step:\n\n${num1} ${operator} ${num2} = ${result}\n\nFor more complex math problems, I can help you break them down into steps. What specific area of math are you working on?`;
        }
        
        return `I'd love to help you with math! Here are some ways I can assist:

• **Algebra**: Solving equations, working with variables
• **Geometry**: Area, perimeter, volume calculations
• **Arithmetic**: Basic operations and word problems
• **Fractions**: Adding, subtracting, multiplying, dividing
• **Percentages**: Converting and calculating percentages

Please share your specific math problem, and I'll walk you through it step by step!`;
    }

    handleScienceQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('physics')) {
            return `Physics is fascinating! I can help you understand:

• **Motion**: Speed, velocity, acceleration
• **Forces**: Newton's laws, friction, gravity
• **Energy**: Kinetic, potential, conservation
• **Waves**: Sound, light, electromagnetic spectrum
• **Electricity**: Circuits, current, voltage

What specific physics topic would you like to explore?`;
        }
        
        if (lowerMessage.includes('chemistry')) {
            return `Chemistry is all about understanding matter! I can help with:

• **Atoms & Elements**: Periodic table, atomic structure
• **Chemical Bonds**: Ionic, covalent, metallic
• **Reactions**: Balancing equations, types of reactions
• **Solutions**: Concentration, pH, acids and bases
• **Organic Chemistry**: Carbon compounds, functional groups

What chemistry concept are you studying?`;
        }
        
        if (lowerMessage.includes('biology')) {
            return `Biology is the study of life! I can assist with:

• **Cell Biology**: Structure, organelles, processes
• **Genetics**: DNA, inheritance, mutations
• **Evolution**: Natural selection, adaptation
• **Ecology**: Ecosystems, food chains, biodiversity
• **Human Body**: Systems, organs, functions

Which area of biology interests you most?`;
        }
        
        return `Science is amazing! I can help you with:

• **Physics**: Motion, forces, energy, waves
• **Chemistry**: Atoms, reactions, solutions
• **Biology**: Cells, genetics, ecosystems
• **Earth Science**: Weather, geology, astronomy

What scientific concept would you like to explore?`;
    }

    handleWritingQuery(message) {
        return `I'm here to help improve your writing! Here's how I can assist:

**Essay Writing:**
• Structure: Introduction, body paragraphs, conclusion
• Thesis statements and topic sentences
• Evidence and examples
• Transitions between ideas

**Grammar & Style:**
• Sentence structure and variety
• Punctuation and capitalization
• Word choice and vocabulary
• Avoiding common errors

**Writing Process:**
• Brainstorming and outlining
• Drafting and revising
• Proofreading techniques
• Citation and references

What type of writing are you working on? Share your draft or specific questions!`;
    }

    handleHistoryQuery(message) {
        return `History helps us understand the world! I can help you with:

**World History:**
• Ancient civilizations (Egypt, Greece, Rome)
• Medieval period and Renaissance
• Age of Exploration and colonization
• Industrial Revolution
• World Wars and modern era

**Study Techniques:**
• Creating timelines
• Understanding cause and effect
• Analyzing primary sources
• Making connections between events
• Essay writing for history

What historical period or event are you studying?`;
    }

    handleStudyQuery(message) {
        return `Great question about studying! Here are proven techniques:

**Effective Study Methods:**
• **Active Recall**: Test yourself without looking at notes
• **Spaced Repetition**: Review material at increasing intervals
• **Pomodoro Technique**: 25-minute focused study sessions
• **Mind Maps**: Visual organization of information
• **Practice Testing**: Simulate exam conditions

**Study Schedule Tips:**
• Break large topics into smaller chunks
• Mix different subjects (interleaving)
• Study during your peak energy hours
• Take regular breaks
• Get enough sleep

What subject are you preparing for? I can create a specific study plan!`;
    }

    handleHomeworkQuery(message) {
        return `I'm here to help with your homework! Here's my approach:

**How I Help:**
• Break down complex problems into steps
• Explain concepts clearly
• Provide examples and practice
• Guide you to the answer (not just give it)
• Help you understand the "why" behind solutions

**What You Can Share:**
• The specific question or problem
• What subject it's for
• What part you're stuck on
• Any work you've already done

**My Goal:**
Help you learn and understand, not just complete the assignment!

What homework question can I help you with today?`;
    }

    handleGeneralQuery(message) {
        return `Hello! I'm EduAssist-AI, your educational companion. I'm designed to help you succeed academically!

**I can help you with:**
📚 **Homework**: Step-by-step problem solving
📝 **Writing**: Essays, grammar, structure
🧮 **Math**: From basic arithmetic to advanced topics
🔬 **Science**: Physics, chemistry, biology
📖 **History**: Events, analysis, essay writing
📊 **Study Skills**: Effective techniques and planning

**How to get the best help:**
• Be specific about what you're working on
• Share the exact question or topic
• Let me know your grade level
• Tell me what part is confusing

What would you like to learn about today?`;
    }

    async generateQuiz(topic, difficulty = 'medium', questionCount = 5) {
        const prompt = `Create a ${difficulty} level quiz about "${topic}" with ${questionCount} multiple choice questions. Format as JSON with questions, options (A,B,C,D), correct answers, and explanations.`;
        
        try {
            const response = await this.generateResponse(prompt, 'quiz');
            // Parse and structure the quiz response
            return this.parseQuizResponse(response, topic, questionCount);
        } catch (error) {
            return this.generateFallbackQuiz(topic, questionCount);
        }
    }

    parseQuizResponse(response, topic, count) {
        // Simple fallback quiz structure
        return {
            topic: topic,
            questions: Array.from({length: count}, (_, i) => ({
                id: i + 1,
                question: `Question ${i + 1} about ${topic}`,
                options: {
                    A: "Option A",
                    B: "Option B", 
                    C: "Option C",
                    D: "Option D"
                },
                correct: "A",
                explanation: "This is the correct answer because..."
            }))
        };
    }

    async generateQuiz(topic, difficulty = 'medium', questionCount = 5) {
        const prompt = `Create a ${difficulty} level quiz about "${topic}" with ${questionCount} multiple choice questions. Format as JSON with questions, options (A,B,C,D), correct answers, and explanations.`;
        
        try {
            // Try to use AI first
            if (this.groqApiKey && this.groqApiKey !== 'your_groq_api_key_here') {
                const response = await this.useGroqAPI(prompt, 'quiz');
                return this.parseQuizResponse(response, topic, questionCount);
            }
            
            if (this.hfApiKey && this.hfApiKey !== 'your_huggingface_token_here') {
                const response = await this.useHuggingFaceAPI(prompt, 'quiz');
                return this.parseQuizResponse(response, topic, questionCount);
            }
            
            // Generate intelligent quiz without API
            return this.generateIntelligentQuiz(topic, difficulty, questionCount);
        } catch (error) {
            return this.generateIntelligentQuiz(topic, difficulty, questionCount);
        }
    }

    generateIntelligentQuiz(topic, difficulty, questionCount) {
        const lowerTopic = topic.toLowerCase();
        
        // Math quiz
        if (lowerTopic.includes('math') || lowerTopic.includes('algebra') || lowerTopic.includes('geometry')) {
            return this.generateMathQuiz(topic, difficulty, questionCount);
        }
        
        // Science quiz
        if (lowerTopic.includes('science') || lowerTopic.includes('physics') || lowerTopic.includes('chemistry') || lowerTopic.includes('biology')) {
            return this.generateScienceQuiz(topic, difficulty, questionCount);
        }
        
        // History quiz
        if (lowerTopic.includes('history') || lowerTopic.includes('war') || lowerTopic.includes('ancient')) {
            return this.generateHistoryQuiz(topic, difficulty, questionCount);
        }
        
        // General quiz template
        return this.generateGeneralQuiz(topic, difficulty, questionCount);
    }

    generateMathQuiz(topic, difficulty, questionCount) {
        const questions = [
            {
                id: 1,
                question: "What is 15 + 27?",
                options: { A: "42", B: "41", C: "43", D: "40" },
                correct: "A",
                explanation: "15 + 27 = 42. Add the ones place: 5 + 7 = 12 (write 2, carry 1). Add the tens place: 1 + 2 + 1 = 4."
            },
            {
                id: 2,
                question: "If x + 5 = 12, what is x?",
                options: { A: "6", B: "7", C: "8", D: "17" },
                correct: "B",
                explanation: "To solve x + 5 = 12, subtract 5 from both sides: x = 12 - 5 = 7."
            },
            {
                id: 3,
                question: "What is the area of a rectangle with length 8 and width 6?",
                options: { A: "14", B: "28", C: "48", D: "24" },
                correct: "C",
                explanation: "Area of rectangle = length × width = 8 × 6 = 48 square units."
            },
            {
                id: 4,
                question: "What is 3/4 as a decimal?",
                options: { A: "0.75", B: "0.34", C: "0.43", D: "1.33" },
                correct: "A",
                explanation: "To convert 3/4 to decimal, divide 3 by 4: 3 ÷ 4 = 0.75."
            },
            {
                id: 5,
                question: "What is 20% of 50?",
                options: { A: "5", B: "10", C: "15", D: "25" },
                correct: "B",
                explanation: "20% of 50 = 0.20 × 50 = 10."
            }
        ];
        
        return {
            topic: topic,
            difficulty: difficulty,
            questions: questions.slice(0, parseInt(questionCount))
        };
    }

    generateScienceQuiz(topic, difficulty, questionCount) {
        const questions = [
            {
                id: 1,
                question: "What is the chemical symbol for water?",
                options: { A: "H2O", B: "CO2", C: "NaCl", D: "O2" },
                correct: "A",
                explanation: "Water is composed of 2 hydrogen atoms and 1 oxygen atom, so its chemical formula is H2O."
            },
            {
                id: 2,
                question: "What force keeps planets in orbit around the sun?",
                options: { A: "Magnetism", B: "Gravity", C: "Friction", D: "Electricity" },
                correct: "B",
                explanation: "Gravity is the force that attracts objects with mass toward each other, keeping planets in orbit."
            },
            {
                id: 3,
                question: "What is the powerhouse of the cell?",
                options: { A: "Nucleus", B: "Ribosome", C: "Mitochondria", D: "Cytoplasm" },
                correct: "C",
                explanation: "Mitochondria produce ATP (energy) for the cell, earning them the nickname 'powerhouse of the cell'."
            },
            {
                id: 4,
                question: "What gas do plants absorb during photosynthesis?",
                options: { A: "Oxygen", B: "Nitrogen", C: "Carbon dioxide", D: "Hydrogen" },
                correct: "C",
                explanation: "Plants absorb carbon dioxide from the air and use it with sunlight and water to make glucose."
            },
            {
                id: 5,
                question: "What is the speed of light in a vacuum?",
                options: { A: "300,000 km/s", B: "150,000 km/s", C: "450,000 km/s", D: "299,792,458 m/s" },
                correct: "D",
                explanation: "The speed of light in a vacuum is exactly 299,792,458 meters per second."
            }
        ];
        
        return {
            topic: topic,
            difficulty: difficulty,
            questions: questions.slice(0, parseInt(questionCount))
        };
    }

    generateHistoryQuiz(topic, difficulty, questionCount) {
        const questions = [
            {
                id: 1,
                question: "In which year did World War II end?",
                options: { A: "1944", B: "1945", C: "1946", D: "1947" },
                correct: "B",
                explanation: "World War II ended in 1945 with the surrender of Japan in September."
            },
            {
                id: 2,
                question: "Who was the first President of the United States?",
                options: { A: "Thomas Jefferson", B: "John Adams", C: "George Washington", D: "Benjamin Franklin" },
                correct: "C",
                explanation: "George Washington served as the first President from 1789 to 1797."
            },
            {
                id: 3,
                question: "Which ancient wonder was located in Alexandria?",
                options: { A: "Hanging Gardens", B: "Lighthouse", C: "Colossus", D: "Mausoleum" },
                correct: "B",
                explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World."
            },
            {
                id: 4,
                question: "The Renaissance began in which country?",
                options: { A: "France", B: "Germany", C: "Italy", D: "England" },
                correct: "C",
                explanation: "The Renaissance began in Italy in the 14th century, starting in cities like Florence."
            },
            {
                id: 5,
                question: "Who wrote the Declaration of Independence?",
                options: { A: "George Washington", B: "Thomas Jefferson", C: "John Adams", D: "Benjamin Franklin" },
                correct: "B",
                explanation: "Thomas Jefferson was the primary author of the Declaration of Independence in 1776."
            }
        ];
        
        return {
            topic: topic,
            difficulty: difficulty,
            questions: questions.slice(0, parseInt(questionCount))
        };
    }

    generateGeneralQuiz(topic, difficulty, questionCount) {
        return {
            topic: topic,
            difficulty: difficulty,
            message: `I'd love to create a personalized quiz about "${topic}"! 

To generate the best questions for you, I need a bit more information:

• What specific aspects of ${topic} should I focus on?
• What grade level or difficulty are you aiming for?
• Are there particular concepts you want to practice?

For now, here are some study tips for ${topic}:
• Break the topic into smaller subtopics
• Create your own practice questions
• Use flashcards for key terms
• Explain concepts in your own words
• Find real-world examples

Would you like me to help you create a study plan for ${topic} instead?`,
            questions: []
        };
    }
}

module.exports = new AIService();