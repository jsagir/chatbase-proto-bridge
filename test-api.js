const axios = require('axios');
require('dotenv').config();

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api/chat';
const TEST_MESSAGES = [
  {
    name: 'Simple greeting',
    messages: [
      { role: 'user', content: 'Hello!' }
    ],
    stream: false
  },
  {
    name: 'Question test',
    messages: [
      { role: 'user', content: 'What is the weather like today?' }
    ],
    stream: false
  },
  {
    name: 'Streaming test',
    messages: [
      { role: 'user', content: 'Tell me a very short joke' }
    ],
    stream: true
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test non-streaming endpoint
async function testNonStreaming(test) {
  console.log(`\n${colors.blue}Testing: ${test.name}${colors.reset}`);
  console.log(`${colors.cyan}Request:${colors.reset}`, JSON.stringify(test.messages, null, 2));
  
  try {
    const startTime = Date.now();
    const response = await axios.post(API_URL, {
      messages: test.messages,
      stream: false
    });
    const duration = Date.now() - startTime;
    
    console.log(`${colors.green}✓ Success${colors.reset} (${duration}ms)`);
    console.log(`${colors.cyan}Response:${colors.reset}`, JSON.stringify(response.data, null, 2));
    
    // Validate response format
    if (!response.data.response) {
      console.log(`${colors.yellow}⚠ Warning: Response missing expected 'response' field${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Failed${colors.reset}`);
    if (error.response) {
      console.log(`${colors.red}Status:${colors.reset} ${error.response.status}`);
      console.log(`${colors.red}Error:${colors.reset}`, error.response.data);
    } else {
      console.log(`${colors.red}Error:${colors.reset}`, error.message);
    }
    return false;
  }
}

// Test streaming endpoint
async function testStreaming(test) {
  console.log(`\n${colors.blue}Testing: ${test.name} (Streaming)${colors.reset}`);
  console.log(`${colors.cyan}Request:${colors.reset}`, JSON.stringify(test.messages, null, 2));
  
  try {
    const startTime = Date.now();
    const response = await axios.post(API_URL, {
      messages: test.messages,
      stream: true
    }, {
      responseType: 'stream',
      headers: {
        'Accept': 'text/event-stream'
      }
    });
    
    console.log(`${colors.green}✓ Stream started${colors.reset}`);
    console.log(`${colors.cyan}Streaming response:${colors.reset}`);
    
    let fullResponse = '';
    let chunkCount = 0;
    
    return new Promise((resolve) => {
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            chunkCount++;
            const data = line.slice(6);
            if (data === '[DONE]') {
              const duration = Date.now() - startTime;
              console.log(`\n${colors.green}✓ Stream completed${colors.reset} (${duration}ms, ${chunkCount} chunks)`);
              console.log(`${colors.cyan}Full response:${colors.reset} ${fullResponse}`);
              resolve(true);
            } else {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  process.stdout.write(parsed.content);
                  fullResponse += parsed.content;
                }
              } catch (e) {
                console.log(`\n${colors.yellow}⚠ Could not parse chunk:${colors.reset} ${data}`);
              }
            }
          }
        });
      });
      
      response.data.on('error', (error) => {
        console.log(`\n${colors.red}✗ Stream error:${colors.reset}`, error.message);
        resolve(false);
      });
    });
  } catch (error) {
    console.log(`${colors.red}✗ Failed to start stream${colors.reset}`);
    if (error.response) {
      console.log(`${colors.red}Status:${colors.reset} ${error.response.status}`);
      console.log(`${colors.red}Error:${colors.reset}`, error.response.data);
    } else {
      console.log(`${colors.red}Error:${colors.reset}`, error.message);
    }
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}    Chatbase-Proto Bridge API Tests${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`\n${colors.yellow}Testing API at:${colors.reset} ${API_URL}`);
  
  // Check if running locally and .env exists
  if (API_URL.includes('localhost')) {
    if (!process.env.CHATBASE_API_KEY || !process.env.CHATBOT_ID) {
      console.log(`\n${colors.red}⚠ Warning: Environment variables not found!${colors.reset}`);
      console.log('Make sure to create a .env file with:');
      console.log('  CHATBASE_API_KEY=your_key_here');
      console.log('  CHATBOT_ID=your_chatbot_id_here');
      console.log('\nOr set API_URL to test your deployed endpoint:');
      console.log('  API_URL=https://your-project.vercel.app/api/chat npm test\n');
    }
  }
  
  let passed = 0;
  let failed = 0;
  
  // Run tests
  for (const test of TEST_MESSAGES) {
    const success = test.stream 
      ? await testStreaming(test)
      : await testNonStreaming(test);
    
    if (success) passed++;
    else failed++;
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log(`\n${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}                 Summary${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}Passed:${colors.reset} ${passed}`);
  console.log(`${colors.red}Failed:${colors.reset} ${failed}`);
  console.log(`${colors.blue}Total:${colors.reset} ${TEST_MESSAGES.length}\n`);
  
  if (failed === 0) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Some tests failed. Check the errors above.${colors.reset}\n`);
  }
}

// Run tests
runTests().catch(console.error);