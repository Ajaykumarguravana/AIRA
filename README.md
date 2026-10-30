# 🚀 AIRA — AI-Powered Retail Operating System & Command Center

AIRA is an intelligent, responsive digital store management platform that unifies physical store operations with real-time neural inventory intelligence, interactive 3D shelf mapping, camera barcode POS counter, demand forecasting, multilingual Indian regional voice assistance, and profitability analytics.

---

## 🌟 Key Features

- **⚡ Express Supermarket POS Counter**:
  - Live camera barcode scanner (EAN-13, EAN-8, UPC, Code 128, QR Code) with horizontal/vertical rotation.
  - USB / Bluetooth barcode scanner gun support.
  - Multi-payment support: UPI QR generator, Cash calculator with change due, and Card POS.
  - Supermarket receipt generation & printing with printable slip formatting.

- **📱 Fully Reactive & Responsive UI**:
  - Seamless responsive experience across smartphones, tablets, laptops, and ultra-wide desktops.
  - Off-canvas slide-over drawer with backdrop overlay for mobile devices.
  - Docked collapsible sidebar navigation for desktop screens.

- **🧠 Google Gemini Autonomous AI Store Assistant**:
  - Integrated with Google Gemini 2.5 models (`gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-2.5-pro`).
  - Multilingual voice support across 16 Indian and global languages (Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Malayalam, Punjabi, English, etc.).
  - Web Speech Recognition API & Web Audio API synthesis for voice-driven store management.

- **🏬 3D Interactive Store Health Digital Twin**:
  - Interactive Three.js / React Three Fiber 3D isometric physical-digital shelf mapping.
  - Departmental shelf telemetry: stock levels, fill percentage, and restock actions.

- **📊 Profitability, Financial Ledger & Demand Forecasting**:
  - Comprehensive unit profit, margin %, and ROI analytics.
  - LightGBM & Prophet-inspired demand forecasting with stockout date predictions.
  - One-click PDF consulting business report generation (via jsPDF & autoTable) and CSV exports.

---

## 🏗️ Architecture

```
AIRA/
├── frontend/             # React 19 + Vite 8 + Tailwind CSS v4 + Three.js
│   ├── public/           # Logos, favicon, and promo media
│   ├── src/
│   │   ├── components/   # Layout, Navbar, Sidebar, FloatingAssistant, 3D Canvas
│   │   ├── context/      # Multilingual LanguageContext
│   │   ├── pages/        # Dashboard, POSCheckout, Inventory, ProductStats, etc.
│   │   ├── services/     # Gemini API & Web Speech services
│   │   └── utils/        # Local user store, demo datasets
│   ├── package.json
│   └── vite.config.js
├── backend/              # Python FastAPI Server + SQLAlchemy ORM
│   ├── app/              # FastAPI routers, models, schemas, database
│   ├── requirements.txt  # Python backend dependencies
│   ├── aira_store.db     # SQLite local database
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📜 License
Developed with ❤️ for modern retail store managers.
