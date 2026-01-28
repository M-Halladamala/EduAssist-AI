const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Chat endpoint
router.post('/', async (req, res) => {
    try {
        const { message, context = 'general', userId = 'anonymous' } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Log the conversation for analytics (optional)
        console.log(`[${new Date().toISOString()}] User ${userId}: ${message}`);
        
        // Generate AI response
        const response = await aiService.generateResponse(message, context);
        
        // Log AI response
        console.log(`[${new Date().toISOString()}] AI Response: ${response.substring(0, 100)}...`);
        
        res.json({
            success: true,
            response: response,
            context: context,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate response',
            message: 'I apologize, but I encountered an error. Please try again or rephrase your question.'
        });
    }
});

// Get conversation history (placeholder for future implementation)
router.get('/history/:userId', (req, res) => {
    res.json({
        success: true,
        history: [],
        message: 'Conversation history feature coming soon!'
    });
});

// Clear conversation history
router.delete('/history/:userId', (req, res) => {
    res.json({
        success: true,
        message: 'Conversation history cleared'
    });
});

module.exports = router;