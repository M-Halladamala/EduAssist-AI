const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Generate quiz
router.post('/quiz', async (req, res) => {
    try {
        const { topic, difficulty = 'medium', questionCount = 5 } = req.body;
        
        if (!topic) {
            return res.status(400).json({ 
                error: 'Topic is required for quiz generation' 
            });
        }

        const quiz = await aiService.generateQuiz(topic, difficulty, parseInt(questionCount));
        
        res.json({
            success: true,
            quiz: quiz,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Quiz Generation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate quiz'
        });
    }
});

// Study plan generator
router.post('/plan', async (req, res) => {
    try {
        const { subjects, timeAvailable, goals, difficulty } = req.body;
        
        const prompt = `Create a personalized study plan for: ${subjects.join(', ')}. 
        Available time: ${timeAvailable}. 
        Goals: ${goals}. 
        Difficulty level: ${difficulty}.
        Include specific daily tasks, time allocation, and milestones.`;
        
        const studyPlan = await aiService.generateResponse(prompt, 'study');
        
        res.json({
            success: true,
            studyPlan: studyPlan,
            subjects: subjects,
            timeframe: timeAvailable,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Study Plan Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate study plan'
        });
    }
});

// Homework help
router.post('/homework', async (req, res) => {
    try {
        const { question, subject, level } = req.body;
        
        if (!question) {
            return res.status(400).json({ 
                error: 'Question is required for homework help' 
            });
        }

        const context = `homework`;
        const enhancedPrompt = `Subject: ${subject || 'General'}, Level: ${level || 'High School'}. Question: ${question}`;
        
        const response = await aiService.generateResponse(enhancedPrompt, context);
        
        res.json({
            success: true,
            response: response,
            subject: subject,
            level: level,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Homework Help Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to provide homework help'
        });
    }
});

// Writing assistance
router.post('/writing', async (req, res) => {
    try {
        const { text, type, feedback_type } = req.body;
        
        if (!text) {
            return res.status(400).json({ 
                error: 'Text is required for writing assistance' 
            });
        }

        const prompt = `Please provide ${feedback_type || 'general'} feedback on this ${type || 'essay'}: "${text}"`;
        const response = await aiService.generateResponse(prompt, 'writing');
        
        res.json({
            success: true,
            feedback: response,
            originalText: text,
            type: type,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Writing Assistance Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to provide writing assistance'
        });
    }
});

module.exports = router;