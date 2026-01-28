// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const quickBtns = document.querySelectorAll('.quick-btn');

// API Base URL
const API_BASE = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkAPIStatus();
});

// Event Listeners
function initializeEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Chat functionality
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Quick action buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.dataset.prompt;
            sendMessage();
        });
    });

    // Form submissions
    document.getElementById('homeworkForm').addEventListener('submit', handleHomeworkSubmit);
    document.getElementById('quizForm').addEventListener('submit', handleQuizSubmit);
    document.getElementById('studyForm').addEventListener('submit', handleStudySubmit);
    document.getElementById('writingForm').addEventListener('submit', handleWritingSubmit);
}

// Tab Management
function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

// Chat Functions
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';

    // Show loading
    showLoading();

    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: 'general',
                userId: 'user_' + Date.now()
            })
        });

        const data = await response.json();
        
        if (data.success) {
            addMessage(data.response, 'bot');
        } else {
            addMessage(data.message || 'Sorry, I encountered an error. Please try again.', 'bot');
        }
    } catch (error) {
        console.error('Chat Error:', error);
        addMessage('Sorry, I\'m having trouble connecting. Please check your internet connection and try again.', 'bot');
    } finally {
        hideLoading();
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Format the content (convert newlines to <br>, etc.)
    const formattedContent = formatMessageContent(content);
    messageContent.innerHTML = formattedContent;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessageContent(content) {
    // Convert newlines to <br>
    let formatted = content.replace(/\n/g, '<br>');
    
    // Convert **bold** to <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert numbered lists
    formatted = formatted.replace(/^\d+\.\s/gm, '<br>$&');
    
    return formatted;
}

// Form Handlers
async function handleHomeworkSubmit(e) {
    e.preventDefault();
    
    const formData = {
        question: document.getElementById('homeworkQuestion').value,
        subject: document.getElementById('subject').value,
        level: document.getElementById('level').value
    };

    if (!formData.question.trim()) {
        alert('Please enter your homework question.');
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/study/homework`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            showResult('homeworkResult', 'Homework Help', data.response);
        } else {
            showResult('homeworkResult', 'Error', data.error || 'Failed to get homework help');
        }
    } catch (error) {
        console.error('Homework Error:', error);
        showResult('homeworkResult', 'Error', 'Connection error. Please try again.');
    } finally {
        hideLoading();
    }
}

async function handleQuizSubmit(e) {
    e.preventDefault();
    
    const formData = {
        topic: document.getElementById('quizTopic').value,
        difficulty: document.getElementById('difficulty').value,
        questionCount: document.getElementById('questionCount').value
    };

    if (!formData.topic.trim()) {
        alert('Please enter a quiz topic.');
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/study/quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            displayQuiz(data.quiz);
        } else {
            showResult('quizResult', 'Error', data.error || 'Failed to generate quiz');
        }
    } catch (error) {
        console.error('Quiz Error:', error);
        showResult('quizResult', 'Error', 'Connection error. Please try again.');
    } finally {
        hideLoading();
    }
}

async function handleStudySubmit(e) {
    e.preventDefault();
    
    const formData = {
        subjects: document.getElementById('subjects').value.split(',').map(s => s.trim()),
        timeAvailable: document.getElementById('timeAvailable').value,
        goals: document.getElementById('goals').value
    };

    if (!formData.subjects[0]) {
        alert('Please enter at least one subject.');
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/study/plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            showResult('studyResult', 'Your Personalized Study Plan', data.studyPlan);
        } else {
            showResult('studyResult', 'Error', data.error || 'Failed to generate study plan');
        }
    } catch (error) {
        console.error('Study Plan Error:', error);
        showResult('studyResult', 'Error', 'Connection error. Please try again.');
    } finally {
        hideLoading();
    }
}

async function handleWritingSubmit(e) {
    e.preventDefault();
    
    const formData = {
        text: document.getElementById('writingText').value,
        type: document.getElementById('writingType').value,
        feedback_type: document.getElementById('feedbackType').value
    };

    if (!formData.text.trim()) {
        alert('Please enter some text for feedback.');
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/study/writing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            showResult('writingResult', 'Writing Feedback', data.feedback);
        } else {
            showResult('writingResult', 'Error', data.error || 'Failed to provide writing feedback');
        }
    } catch (error) {
        console.error('Writing Error:', error);
        showResult('writingResult', 'Error', 'Connection error. Please try again.');
    } finally {
        hideLoading();
    }
}

// Utility Functions
function showResult(containerId, title, content) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <h3>${title}</h3>
        <pre>${content}</pre>
    `;
    container.classList.add('show');
}

function displayQuiz(quiz) {
    const container = document.getElementById('quizResult');
    
    if (quiz.questions && quiz.questions.length > 0) {
        let quizHTML = `<h3>Quiz: ${quiz.topic}</h3>`;
        
        quiz.questions.forEach((q, index) => {
            quizHTML += `
                <div class="quiz-question">
                    <h4>Question ${index + 1}: ${q.question}</h4>
                    <div class="quiz-options">
                        <label><input type="radio" name="q${index}" value="A"> A) ${q.options.A}</label>
                        <label><input type="radio" name="q${index}" value="B"> B) ${q.options.B}</label>
                        <label><input type="radio" name="q${index}" value="C"> C) ${q.options.C}</label>
                        <label><input type="radio" name="q${index}" value="D"> D) ${q.options.D}</label>
                    </div>
                    <p class="quiz-answer"><strong>Answer:</strong> ${q.correct}) ${q.options[q.correct]}</p>
                    <p class="quiz-explanation"><strong>Explanation:</strong> ${q.explanation}</p>
                </div>
            `;
        });
        
        container.innerHTML = quizHTML;
    } else {
        container.innerHTML = `
            <h3>Quiz Generator</h3>
            <pre>${quiz.message || 'Quiz generated successfully! Please check the content above.'}</pre>
        `;
    }
    
    container.classList.add('show');
}

function showLoading() {
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

async function checkAPIStatus() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        console.log('API Status:', data.message);
    } catch (error) {
        console.warn('API connection check failed:', error);
    }
}

// Add some CSS for quiz styling
const quizStyles = `
    .quiz-question {
        background: white;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        border-left: 4px solid #4f46e5;
    }
    
    .quiz-question h4 {
        color: #4f46e5;
        margin-bottom: 1rem;
    }
    
    .quiz-options {
        margin: 1rem 0;
    }
    
    .quiz-options label {
        display: block;
        margin-bottom: 0.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .quiz-options label:hover {
        background-color: #f3f4f6;
    }
    
    .quiz-answer {
        color: #059669;
        font-weight: 600;
        margin-top: 1rem;
    }
    
    .quiz-explanation {
        color: #6b7280;
        font-style: italic;
        margin-top: 0.5rem;
    }
`;

// Inject quiz styles
const styleSheet = document.createElement('style');
styleSheet.textContent = quizStyles;
document.head.appendChild(styleSheet);