# 🚀 Quick Test Guide for Your Deployment

Your Chatbase Proto Bridge is now DEPLOYED and READY!

## ✅ Your Live URLs:
- **Main URL**: https://chatbase-proto-bridge.vercel.app
- **API Endpoint**: https://chatbase-proto-bridge.vercel.app/api/chat

## 🧪 Quick Browser Test

1. Open your browser
2. Go to: https://chatbase-proto-bridge.vercel.app/api/chat
3. You should see: `{"error":"Method not allowed. Use POST."}`
4. **This is GOOD!** It means your API is running!

## 📝 Test with ReqBin (Easy Web Tool)

1. Go to https://reqbin.com/
2. Configure:
   - Method: **POST**
   - URL: `https://chatbase-proto-bridge.vercel.app/api/chat`
   - Headers: Click "Headers" → Add:
     - Name: `Content-Type`
     - Value: `application/json`
3. Body: Paste this:
```json
{
  "messages": [
    {"role": "user", "content": "Hello, are you working?"}
  ],
  "stream": false
}
```
4. Click **Send**

## 🎯 Expected Results:

### If you see "Server configuration error":
You need to add environment variables in Vercel:
1. Go to https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add:
   - `CHATBASE_API_KEY` = Your Chatbase API key
   - `CHATBOT_ID` = Your Chatbot ID
5. Save and redeploy (three dots → Redeploy)

### If you see a chatbot response:
```json
{
  "response": "Hello! I'm your Chatbase chatbot. How can I help you today?"
}
```
**SUCCESS! Your bridge is working!**

## 🔗 Connect to Proto Persona

1. Go to Proto Persona settings
2. Find "Webhook URL" or "API Endpoint"
3. Enter: `https://chatbase-proto-bridge.vercel.app/api/chat`
4. Save

## 📱 Final Test
Send a message in Proto Persona - you should get a response from your Chatbase chatbot!

## ⚡ Quick Command Line Test (Optional)

Windows PowerShell:
```powershell
$body = @{
    messages = @(
        @{role = "user"; content = "Hello"}
    )
    stream = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://chatbase-proto-bridge.vercel.app/api/chat" -Method Post -Body $body -ContentType "application/json"
```

Mac/Linux Terminal:
```bash
curl -X POST https://chatbase-proto-bridge.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}], "stream": false}'
```

## 🎉 You're Done!
Your bridge is deployed at: https://chatbase-proto-bridge.vercel.app/api/chat