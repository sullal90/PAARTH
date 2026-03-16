# PAARTH Backend

This is the backend service for **PAARTH — AI Recitation Companion**.

The backend handles:
- Fetching Bhagavad Gita verses
- Sending recitation transcripts to Gemini
- Analyzing pronunciation and recitation accuracy
- Returning structured feedback (score, guidance, meaning)

The service is built using **Node.js + TypeScript** and can run locally or be deployed to **Google Cloud Run**.

---

# Tech Stack

- Node.js
- TypeScript
- Express
- Google Gemini API
- REST API
- Google Cloud Run (deployment)

---

# Project Structure

backend
│
├── server.ts            # Express server entry point
├── geminiAgent.ts       # Gemini prompt + evaluation logic
├── verseService.ts      # Verse retrieval logic
├── types.ts             # Shared response types
├── package.json
├── tsconfig.json
└── README.md

## Deployment (Google Cloud Run)

To deploy the backend service to Cloud Run:
```
gcloud run deploy paarth-backend \
--source . \
--region us-central1 \
--allow-unauthenticated
```

After deployment, Cloud Run will generate a public URL for the backend service.

Update the frontend API base URL to point to this deployed endpoint.

⸻

## Backend Responsibilities

The backend performs the following tasks:
    1.    Retrieve the requested Bhagavad Gita verse
    2.    Send verse and recitation transcript to Gemini
    3.    Evaluate pronunciation accuracy
    4.    Generate structured feedback
    5.    Return the response to the frontend

⸻

## Future Improvements

Possible future enhancements include:
    •    Phonetic pronunciation scoring
    •    Real-time streaming recitation feedback
    •    Multi-language verse explanations
    •    Progress tracking for users

⸻

## License

This project is part of the PAARTH AI Recitation Companion hackathon submission.