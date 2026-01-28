// Simple test script to verify LLM integration
const aiService = require('./services/aiService');

async function testLLM() {
    console.log('🧪 Testing LLM Integration...\n');
    
    const testMessages = [
        { message: "What is 2 + 2?", context: "math" },
        { message: "Explain photosynthesis", context: "science" },
        { message: "Help me with my homework", context: "homework" },
        { message: "Hello, how can you help me?", context: "general" }
    ];
    
    for (const test of testMessages) {
        console.log(`📝 Testing: "${test.message}" (${test.context})`);
        
        try {
            const response = await aiService.generateResponse(test.message, test.context);
            console.log(`✅ Response: ${response.substring(0, 100)}...`);
            console.log('---');
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
            console.log('---');
        }
    }
    
    console.log('🎉 LLM Integration test completed!');
}

// Run the test
testLLM().catch(console.error);