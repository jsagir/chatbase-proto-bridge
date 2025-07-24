# Chatbase to Proto Persona Bridge

This service creates a bridge between your Chatbase chatbot and Proto Persona platform, enabling seamless communication with support for both standard and streaming responses.

## 🚀 Quick Start

### Prerequisites
- A Chatbase account with an active chatbot
- A Vercel account (free tier works)
- GitHub account for deployment
- Node.js 18+ (for local testing)

## 📋 Step-by-Step Deployment Guide

### Step 1: Get Your Chatbase Credentials

1. **Get your Chatbase API Key:**
   - Log in to [Chatbase](https://www.chatbase.co)
   - Go to Account Settings: https://www.chatbase.co/account/settings
   - Find your API key and copy it

2. **Get your Chatbot ID:**
   - Go to your chatbot's dashboard
   - Look at the URL: `https://www.chatbase.co/chatbot/[YOUR_CHATBOT_ID]/settings`
   - Copy the ID from the URL

### Step 2: Deploy to Vercel

#### Option A: Deploy with Vercel Button (Easiest)

1. Fork this repository to your GitHub account
2. Click the deploy button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/chatbase-proto-bridge)

3. Connect your GitHub account if prompted
4. Add environment variables when prompted:
   - `CHATBASE_API_KEY`: Your Chatbase API key
   - `CHATBOT_ID`: Your Chatbot ID
5. Click "Deploy"

#### Option B: Manual Deployment

1. **Fork or download this repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chatbase-proto-bridge.git
   cd chatbase-proto-bridge
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy the project**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Yes" to set up and deploy
   - Select your account
   - Choose a project name or use default

5. **Set environment variables**
   ```bash
   vercel env add CHATBASE_API_KEY
   vercel env add CHATBOT_ID
   ```
   - Enter your values when prompted
   - Choose "Production", "Preview", and "Development" for each

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Step 3: Configure Proto Persona

1. Copy your deployment URL (e.g., `https://your-project.vercel.app`)
2. In Proto Persona settings, set your webhook URL to:
   ```
   https://your-project.vercel.app/api/chat
   ```
3. Save your Proto Persona configuration

## 🧪 Testing Your Deployment

### Test with cURL (Non-streaming)
```bash
curl -X POST https://your-project.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "stream": false
  }'
```

### Test with cURL (Streaming)
```bash
curl -X POST https://your-project.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "messages": [
      {"role": "user", "content": "Tell me a short story"}
    ],
    "stream": true
  }'
```

### Test with the included script
```bash
npm install
npm test
```

## 📁 Project Structure

```
chatbase-proto-bridge/
├── api/
│   └── chat.js          # Main API endpoint
├── package.json         # Project dependencies
├── vercel.json         # Vercel configuration
├── .env.example        # Environment variables template
├── test-api.js         # Test script
└── README.md           # This file
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Server configuration error"
**Problem:** Environment variables are not set
**Solution:** 
- Go to your Vercel dashboard
- Select your project
- Go to Settings → Environment Variables
- Add `CHATBASE_API_KEY` and `CHATBOT_ID`
- Redeploy: `vercel --prod`

#### 2. "Authentication failed"
**Problem:** Invalid Chatbase API key
**Solution:**
- Double-check your API key at https://www.chatbase.co/account/settings
- Make sure there are no extra spaces
- Update in Vercel dashboard and redeploy

#### 3. "Chatbot not found"
**Problem:** Invalid Chatbot ID
**Solution:**
- Verify your chatbot ID from the Chatbase URL
- Update the `CHATBOT_ID` environment variable
- Redeploy the project

#### 4. CORS Errors
**Problem:** Cross-Origin Resource Sharing blocked
**Solution:**
- The vercel.json already includes CORS headers
- If issues persist, check Proto Persona's domain requirements
- You may need to update the `Access-Control-Allow-Origin` header

#### 5. Timeout Errors
**Problem:** Long responses timeout
**Solution:**
- Vercel free tier has a 10-second timeout
- For longer responses, consider upgrading Vercel plan
- Or implement response chunking

### Checking Logs

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Functions" tab
4. Click on "View Logs" for the chat function
5. Look for error messages and request details

## 🔒 Security Best Practices

1. **Never commit your actual API keys**
   - Use environment variables only
   - Keep .env files in .gitignore

2. **Rotate your API keys regularly**
   - Change them every 3-6 months
   - Update in Vercel dashboard immediately

3. **Monitor usage**
   - Check Chatbase dashboard for unusual activity
   - Set up alerts if available

## 📊 Understanding the Response Formats

### Standard Response (Proto Persona format)
```json
{
  "response": "This is the chatbot's response"
}
```

### Streaming Response (SSE format)
```
data: {"content":"This"}
data: {"content":" is"}
data: {"content":" streaming"}
data: [DONE]
```

## 🆘 Getting Help

1. **Check the logs** in Vercel dashboard first
2. **Test with cURL** to isolate issues
3. **Verify credentials** are correct
4. **Check Chatbase status** at their status page
5. **Create an issue** in this repository with:
   - Error messages
   - Steps to reproduce
   - Expected vs actual behavior

## 📝 Local Development

To test locally before deploying:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Add your credentials to `.env`

4. Run locally:
   ```bash
   npm run dev
   ```

5. Test at `http://localhost:3000/api/chat`

## 🔄 Updating Your Deployment

When you make changes:

1. Commit changes to GitHub
2. Vercel will auto-deploy (if connected)
3. Or manually deploy:
   ```bash
   vercel --prod
   ```

## 📈 Monitoring Usage

- **Vercel Dashboard**: Monitor function invocations and errors
- **Chatbase Dashboard**: Track message usage and responses
- **Proto Persona**: Monitor webhook success rates

## 🎯 Next Steps

1. Test thoroughly with different message types
2. Monitor the logs for the first few days
3. Set up error alerts if needed
4. Consider implementing rate limiting for production use
5. Add custom error handling for your specific use case

---

**Need more help?** Create an issue in this repository with detailed information about your problem.