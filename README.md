# TerrunoWine 🍷

**TerrunoWine** is an intelligent AI-powered e-commerce and sommelier platform designed to connect consumers with the elite wine heritage of Mendoza, Argentina. It combines computer vision and Agentic AI to transform the wine selection and purchasing experience.

## 🚧 Project Status: Active Development (Sprint 1)
Currently architecting the core infrastructure, focusing on the visual recognition pipeline for label scanning and the integration of specialized winery data.

## 🚀 Planned & Core Features
- **AI Sommelier (Gemini Integration):** Real-time expert advice on pairings, tasting notes, and aging potential via `geminiStudy.ts` logic.
- **Visual Label Recognition:** Planned feature for instant bottle identification and technical sheet retrieval.
- **Smart E-Commerce:** Secure purchasing flow integrated with a curated database of premium Argentinian wineries (Zuccardi, Catena Zapata, etc.).
- **Serverless Architecture:** Scalable backend powered by Firebase Functions and Firestore.

## 🛠️ Technical Stack
- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) for a high-performance, type-safe UI.
- **Backend:** [Firebase Functions](https://firebase.google.com/docs/functions) (Node.js) for serverless logic and secure API handling.
- **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore) for real-time inventory and user data.
- **Orchestration:** Managed scripts for cloud environment stability (`check-bucket.ts`, `cloud-run.yaml`).

## 📦 Project Structure
```text
backend/
└── functions/      # Serverless API logic (Node.js)
public/             # Static assets and PWA configuration
src/
├── components/     # UI Architecture
├── scripts/        # DevOps & Architecture documentation
└── services/       # AI & Firebase integration logic
