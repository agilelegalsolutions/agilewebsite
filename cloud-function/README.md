# Agile Legal Solutions® — AI Chatbot Backend (Google Cloud)

This serverless backend powers the AI Legal Assistant on [https://www.agiletrademarkfiling.com](https://www.agiletrademarkfiling.com).

## Security Architecture

1. **Zero Secret Key Exposure:** The `GEMINI_API_KEY` is stored strictly as a server environment variable in Google Cloud. It is never transmitted to the client, never logged, and never included in Git.
2. **CORS Restriction:** Only requests with origin `https://www.agiletrademarkfiling.com` (or `localhost` for testing) are accepted.
3. **In-Memory IP Rate Limiting:**
   * Max 5 requests / minute per IP.
   * Max 40 requests / 24 hours per IP.
4. **Honeypot Anti-Bot Filter:** Rejects automated bot crawlers immediately without consuming LLM quota.
5. **Prompt Lockdown:** System prompt strictly locks the model to Indian Trademark and IPR queries, rejecting arbitrary code generation, translations, or jailbreaks.
6. **Bar Council Compliance:** All legal guidance includes mandatory informational disclaimers in accordance with Bar Council of India rules.

---

## 1-Click Deployment to Google Cloud (Free Tier)

### Prerequisites
* A Google Cloud Account (Free tier gives **2,000,000 invocations/month free**).
* Google Cloud CLI (`gcloud`) or Google Cloud Shell (accessible via [shell.cloud.google.com](https://shell.cloud.google.com)).
* A free Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Option A: Using the Deploy Script
```bash
cd cloud-function
chmod +x deploy.sh
./deploy.sh "YOUR_GEMINI_API_KEY" "YOUR_GCP_PROJECT_ID" "asia-south1"
```
*(Tip: `asia-south1` is the Mumbai data center, providing the lowest latency across Delhi NCR and India).*

### Option B: Direct gcloud Command
```bash
cd cloud-function

gcloud functions deploy agile-trademark-chat \
    --gen2 \
    --runtime=nodejs22 \
    --region=asia-south1 \
    --source=. \
    --entry-point=chatHandler \
    --trigger-http \
    --allow-unauthenticated \
    --set-env-vars="GEMINI_API_KEY=AIzaSyD_YOUR_KEY_HERE,GEMINI_MODEL=gemini-2.0-flash" \
    --memory=256Mi \
    --min-instances=0 \
    --max-instances=5 \
    --timeout=30s
```

When deployment finishes, Google Cloud outputs the URL, e.g.:
```
https://agile-trademark-chat-xxxxxx-el.a.run.app
```

Copy this URL and set it in `Source/js/chat-widget.js`:
```javascript
const CHAT_API_ENDPOINT = "https://agile-trademark-chat-xxxxxx-el.a.run.app";
```

---

## Local Development & Testing

1. Install dependencies:
   ```bash
   cd cloud-function
   npm install
   ```

2. Run locally:
   ```bash
   export GEMINI_API_KEY="AIzaSyD_YOUR_KEY_HERE"
   npm start
   ```

3. Test with curl:
   ```bash
   curl -X POST http://localhost:8080 \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:8080" \
     -d '{"message": "What is the government fee for Class 42 for a startup?"}'
   ```
