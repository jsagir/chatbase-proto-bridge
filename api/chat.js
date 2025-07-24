module.exports = async (req, res) => {
    // Simple test without dependencies
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // Check for environment variables
    const hasApiKey = !!process.env.CHATBASE_API_KEY;
    const hasChatbotId = !!process.env.CHATBOT_ID;

    if (!hasApiKey || !hasChatbotId) {
      return res.status(500).json({
        error: 'Server configuration error. Please check environment variables.',
        debug: {
          hasApiKey: hasApiKey,
          hasChatbotId: hasChatbotId
        }
      });
    }

    // For now, just return a test response
    return res.status(200).json({
      response: 'Bridge is working! Environment variables are set.',
      timestamp: new Date().toISOString()
    });
  };
