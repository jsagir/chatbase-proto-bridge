const axios = require('axios');
  const { createParser } = require('eventsource-parser');

  module.exports = async (req, res) => {
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Credentials',
  true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
  'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers',
  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version,
   Content-Length, Content-MD5, Content-Type, Date,
  X-Api-Version');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not
  allowed. Use POST.' });
    }

    try {
      // Get environment variables
      const CHATBASE_API_KEY =
  process.env.CHATBASE_API_KEY;
      const CHATBOT_ID = process.env.CHATBOT_ID;

      // Validate environment variables
      if (!CHATBASE_API_KEY || !CHATBOT_ID) {
        console.error('Missing environment variables');
        return res.status(500).json({
          error: 'Server configuration error. Please check
   environment variables.'
        });
      }

      // Extract the request body
      const { messages, stream = false } = req.body;

      // Validate request body
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          error: 'Invalid request. Expected "messages"
  array in request body.'
        });
      }

      // Extract the last user message from the messages
  array
      const userMessage = messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n');

      if (!userMessage) {
        return res.status(400).json({
          error: 'No user message found in the messages
  array.'
        });
      }

      // Prepare Chatbase API request
      const chatbaseRequest = {
        messages: [{ content: userMessage, role: 'user'
  }],
        chatbotId: CHATBOT_ID,
        stream: stream,
        temperature: 0.7
      };

      if (stream) {
        // Handle streaming response
        res.setHeader('Content-Type',
  'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
          const response = await axios.post(
            'https://www.chatbase.co/api/v1/chat',
            chatbaseRequest,
            {
              headers: {
                'Authorization': `Bearer
  ${CHATBASE_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
              },
              responseType: 'stream'
            }
          );

          let fullResponse = '';

          // Create a parser for Server-Sent Events
          const parser = createParser((event) => {
            if (event.type === 'event') {
              const data = event.data;

              if (data === '[DONE]') {
                // Send the final [DONE] message
                res.write('data: [DONE]\n\n');
                res.end();
              } else {
                try {
                  const parsed = JSON.parse(data);
                  const content =
  parsed.choices?.[0]?.delta?.content || '';

                  if (content) {
                    fullResponse += content;
                    // Send each chunk in Proto Persona's
  expected format
                    res.write(`data: ${JSON.stringify({
  content })}\n\n`);
                  }
                } catch (parseError) {
                  console.error('Error parsing SSE data:',
   parseError);
                }
              }
            }
          });

          // Process the stream
          response.data.on('data', (chunk) => {
            const text = chunk.toString();
            parser.feed(text);
          });

          response.data.on('end', () => {
            // Ensure we send [DONE] if not already sent
            if (!res.writableEnded) {
              res.write('data: [DONE]\n\n');
              res.end();
            }
          });

          response.data.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.writableEnded) {
              res.write(`data: ${JSON.stringify({ error:
  'Stream error occurred' })}\n\n`);
              res.end();
            }
          });

        } catch (streamError) {
          console.error('Streaming error:', streamError);
          res.write(`data: ${JSON.stringify({ error:
  'Failed to connect to Chatbase' })}\n\n`);
          res.end();
        }
      } else {
        // Handle non-streaming response
        try {
          const response = await axios.post(
            'https://www.chatbase.co/api/v1/chat',
            chatbaseRequest,
            {
              headers: {
                'Authorization': `Bearer
  ${CHATBASE_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );

          // Extract the response text from Chatbase
          const chatbaseResponse = response.data;
          let responseText = '';

          if (chatbaseResponse.text) {
            responseText = chatbaseResponse.text;
          } else if (chatbaseResponse.choices &&
  chatbaseResponse.choices[0]) {
            responseText =
  chatbaseResponse.choices[0].message?.content || '';
          } else if (chatbaseResponse.answer) {
            responseText = chatbaseResponse.answer;
          }

          if (!responseText) {
            console.error('Unexpected Chatbase response
  structure:', chatbaseResponse);
            return res.status(500).json({
              error: 'Invalid response from Chatbase'
            });
          }

          // Return response in Proto Persona's expected
  format
          res.status(200).json({ response: responseText
  });

        } catch (apiError) {
          console.error('Chatbase API error:',
  apiError.response?.data || apiError.message);

          // Handle specific error cases
          if (apiError.response?.status === 401) {
            return res.status(401).json({
              error: 'Authentication failed. Please check
  your Chatbase API key.'
            });
          } else if (apiError.response?.status === 404) {
            return res.status(404).json({
              error: 'Chatbot not found. Please check your
   chatbot ID.'
            });
          } else {
            return res.status(500).json({
              error: 'Failed to get response from
  Chatbase',
              details: apiError.response?.data?.error ||
  apiError.message
            });
          }
        }
      }

    } catch (error) {
      console.error('General error:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  };
