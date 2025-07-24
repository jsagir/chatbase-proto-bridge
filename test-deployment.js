const axios = require('axios');

// Your deployed API URL
const API_URL = 'https://chatbase-proto-bridge.vercel.app/api/chat';

async function testDeployment() {
  console.log('🧪 Testing Chatbase Proto Bridge Deployment...\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Check if endpoint is accessible
  console.log('Test 1: Checking endpoint accessibility...');
  try {
    const response = await axios.get(API_URL);
  } catch (error) {
    if (error.response && error.response.status === 405) {
      console.log('✅ Endpoint is accessible (returns 405 for GET as expected)\n');
    } else {
      console.log('❌ Endpoint not accessible:', error.message, '\n');
      return;
    }
  }

  // Test 2: Send a test message
  console.log('Test 2: Sending test message...');
  try {
    const response = await axios.post(API_URL, {
      messages: [
        { role: 'user', content: 'Hello, are you working?' }
      ],
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.response) {
      console.log('✅ Got response from chatbot!');
      console.log('Response:', response.data.response.substring(0, 100) + '...\n');
    } else {
      console.log('❌ Unexpected response format:', response.data, '\n');
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ API Error:', error.response.status);
      console.log('Error details:', error.response.data, '\n');
      
      if (error.response.status === 500 && error.response.data.error === 'Server configuration error. Please check environment variables.') {
        console.log('⚠️  IMPORTANT: You need to add environment variables in Vercel!');
        console.log('1. Go to https://vercel.com/dashboard');
        console.log('2. Click on your project');
        console.log('3. Go to Settings → Environment Variables');
        console.log('4. Add these variables:');
        console.log('   - CHATBASE_API_KEY = your Chatbase API key');
        console.log('   - CHATBOT_ID = your Chatbot ID');
        console.log('5. Click Save and then redeploy\n');
      }
    } else {
      console.log('❌ Network error:', error.message, '\n');
    }
  }

  // Test 3: Test streaming (optional)
  console.log('Test 3: Testing streaming capability...');
  try {
    const response = await axios.post(API_URL, {
      messages: [
        { role: 'user', content: 'Count to 3' }
      ],
      stream: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      responseType: 'stream'
    });

    console.log('✅ Streaming endpoint is configured');
    console.log('(Full streaming test requires SSE client)\n');
  } catch (error) {
    if (error.response && error.response.status) {
      console.log('⚠️  Streaming test returned status:', error.response.status);
    } else {
      console.log('⚠️  Streaming test error:', error.message);
    }
  }

  console.log('\n📋 Summary:');
  console.log('- Your deployment URL: https://chatbase-proto-bridge.vercel.app');
  console.log('- API endpoint: https://chatbase-proto-bridge.vercel.app/api/chat');
  console.log('- Add this to Proto Persona webhook settings');
  console.log('\n🔗 Next Steps:');
  console.log('1. Make sure environment variables are set in Vercel');
  console.log('2. Add the API URL to Proto Persona settings');
  console.log('3. Test by sending a message in Proto Persona');
}

// Run the test
testDeployment().catch(console.error);